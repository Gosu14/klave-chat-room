import { Notifier, Crypto, JSON, Ledger, Subscription, Context } from '@klave/sdk';
import {
    WriteMessageOutput,
    ClearChatOutput,
    ChatMessage,
    User,
    ChatRoomSetting,
    ChatMessageInput,
    ChatRoomId,
    ChatRoomOutput,
    ChatOutput,
    UserKey,
    UserOutput,
    ErrorOutput,
    UserOutputList,
    StringOutput,
    SuccessOutput,
    ChatRoomNameInput,
    ChatRoomAdditionalUsersInput
} from './types';
import { encode } from 'as-base64/assembly';
import { convertToUint8Array, getDate } from './utils';

const chatRoomIds = 'chatRoomIdentificationTable';
const chatRoom = 'chatRoomTable';
const users = 'usersTable';

/**
 * @query
 */
export function getUser(userKey: UserKey): void {
    Subscription.setReplayStart();
    const user = Ledger.getTable(users).get(userKey.key);
    if (user.length === 0) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: "This user hasn't been registered"
        });
        return;
    }
    const userParsed = JSON.parse<User>(user);
    Notifier.sendJson<UserOutput>({
        success: true,
        user: userParsed
    });
    return;
}

/**
 * @query
 */
export function listUsers(): void {
    Subscription.setReplayStart();
    const tableUsers = Ledger.getTable(users);
    const keysList = tableUsers.get('keysList');
    const existingKeys = JSON.parse<string[]>(keysList);

    const existingUsers: User[] = [];
    //we can't use forEach in assemblyScript
    for (let i = 0; i < existingKeys.length; i++) {
        const key = existingKeys[i];
        const user = JSON.parse<User>(tableUsers.get(key));
        existingUsers.push(user);
    }

    Notifier.sendJson<UserOutputList>({
        success: true,
        userList: existingUsers
    });
    return;
}

/**
 * @transaction
 */
export function setUser(input: User): void {
    const clientId = Context.get('sender');
    if (clientId !== input.key) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: 'You are not allowed to modify this user - your key is:' + clientId
        });
        return;
    }

    const tableUsers = Ledger.getTable(users);
    const userObj: User = {
        key: input.key,
        username: input.username,
        email: input.email,
        phoneNumber: input.phoneNumber,
        chatRooms: input.chatRooms
    };

    //check if key already exist, if not add it to the list
    const keysList = tableUsers.get('keysList');
    if (keysList.length > 0) {
        const existingKeys = JSON.parse<string[]>(keysList);
        if (!existingKeys.includes(input.key)) {
            existingKeys.push(input.key);
            tableUsers.set('keysList', JSON.stringify<string[]>(existingKeys));
        }
    } else {
        tableUsers.set('keysList', JSON.stringify<string[]>([input.key]));
    }

    //check if username already exists
    const list = tableUsers.get('userNameList');
    if (list.length > 0) {
        const existingUserNames = JSON.parse<string[]>(list);
        if (existingUserNames.includes(input.username)) {
            Notifier.sendJson<ErrorOutput>({
                success: false,
                exception: 'This user name already exists'
            });
            return;
        }
        existingUserNames.push(input.username);
        tableUsers.set('userNameList', JSON.stringify<string[]>(existingUserNames));
    } else {
        tableUsers.set('userNameList', JSON.stringify<string[]>([input.username]));
    }

    tableUsers.set(input.key, JSON.stringify<User>(userObj));

    Notifier.sendJson<UserOutput>({
        success: true,
        user: userObj
    });
    return;
}

/**
 * @query
 */
export function isExistingUser(input: UserKey): void {
    const clientId = Context.get('sender');
    if (clientId !== input.key) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: 'You are not allowed to check this user'
        });
        return;
    }

    const user = Ledger.getTable(users).get(input.key);
    if (user.length === 0) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: "This user doesn't exist"
        });
        return;
    }

    const userObj = JSON.parse<User>(user);
    Notifier.sendJson<UserOutput>({
        success: true,
        user: userObj
    });
    return;
}

/**
 * @transaction
 */
export function createChatRoom(input: ChatRoomSetting): void {
    const clientId = Context.get('sender');
    const tableUsers = Ledger.getTable(users);
    const tableChatRooms = Ledger.getTable(chatRoomIds);

    //create a unique identifier for the chatroom
    const chatRoomId = encode(convertToUint8Array(Crypto.getRandomValues(64)));

    //update the chatroom identification
    tableChatRooms.set(chatRoomId, JSON.stringify<ChatRoomSetting>(input));

    //update the connected user
    const user = tableUsers.get(clientId);
    if (user.length > 0) {
        const userDetails = JSON.parse<User>(user);
        if (!userDetails.chatRooms.includes(chatRoomId)) {
            userDetails.chatRooms.push(chatRoomId);
            tableUsers.set(userDetails.key, JSON.stringify<User>(userDetails));
        }

        //update all users of the chat room - should check if users are duplicated in the list
        for (let i = 0; i < input.users.length; i++) {
            const user = tableUsers.get(input.users[i]);
            if (user.length > 0) {
                const userDetails = JSON.parse<User>(user);
                if (!userDetails.chatRooms.includes(chatRoomId)) {
                    userDetails.chatRooms.push(chatRoomId);
                    tableUsers.set(userDetails.key, JSON.stringify<User>(userDetails));
                }
            }
        }
        const chatRoomOutput: ChatRoomOutput = {
            success: true,
            chatRoomId: chatRoomId,
            chatRoomSetting: input
        };
        Notifier.sendJson<ChatRoomOutput>(chatRoomOutput);
        return;
    }

    Notifier.sendJson<ErrorOutput>({
        success: false,
        exception: "User isn't registered"
    });
    return;
}

/**
 * @transaction
 */
export function updateChatRoomName(input: ChatRoomNameInput): void {

    const clientId = Context.get('sender');
    const chatRoomId = input.chatRoomId;

    const tableChatRooms = Ledger.getTable(chatRoomIds);

    const chatRoomSetting = tableChatRooms.get(chatRoomId);
    if (chatRoomSetting.length === 0) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: "ChatRoom doesn't exist"
        });
        return;
    }

    const chatRoomSettingObj : ChatRoomSetting = JSON.parse<ChatRoomSetting>(chatRoomSetting);
    if(!chatRoomSettingObj.users.includes(clientId)) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: "Your user isn't allowed to modify this chatroom"
        });
        return;
    }

    if (input.name !== "") {
        chatRoomSettingObj.name = input.name
        Notifier.sendJson<SuccessOutput>({
            success: false,
            message: "Chatroom name has been updated"
        });
        return;
    }

    Notifier.sendJson<ErrorOutput>({
        success: false,
        exception: "Chat room name cannot be empty"
    });
    return;
}

/**
 * @transaction
 */
export function leaveChatRoom(input: ChatRoomId): void {

    const clientId = Context.get('sender');
    const chatRoomId = input.chatRoomId;

    const chatRoomTable = Ledger.getTable(chatRoomIds);
    const userTable = Ledger.getTable(users);

    const user = userTable.get(clientId);
    if(user.length === 0) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: "This user hasn't been registered"
        });
        return;
    }

    const chatRoomSetting = chatRoomTable.get(chatRoomId);
    if (chatRoomSetting.length === 0) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: "ChatRoom doesn't exist"
        });
        return;
    }

    const chatRoomSettingObj : ChatRoomSetting = JSON.parse<ChatRoomSetting>(chatRoomSetting);
    if(!chatRoomSettingObj.users.includes(clientId)) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: "Your user isn't allowed to modify this chatroom"
        });
        return;
    }

    //remove chat room id from the user's settings
    const userObj : User = JSON.parse<User>(user);
    if (userObj.chatRooms.includes(chatRoomId)) {
        const chatRoomIdIndex = userObj.chatRooms.indexOf(clientId);
        userObj.chatRooms.splice(chatRoomIdIndex, 1);
        userTable.set(clientId, JSON.stringify<User>(userObj));
    }

    //remove user id from the chat room's setting
    const clientIdIndex = chatRoomSettingObj.users.indexOf(clientId);
    const removedUser = chatRoomSettingObj.users.splice(clientIdIndex, 1);
    Ledger.getTable(chatRoomIds).set(chatRoomId, JSON.stringify<ChatRoomSetting>(chatRoomSettingObj));
    Notifier.sendJson<SuccessOutput>({
        success: true,
        message: "User " + removedUser[0] + "left the chat room"
    });
    return;
}

/**
 * @query
 */
export function getChatRoom(input: ChatRoomId): void {

    const clientId = Context.get('sender');
    const chatRoomId = input.chatRoomId;

    const chatRoomTable = Ledger.getTable(chatRoomIds);
    const usersTable = Ledger.getTable(users);

    const user = usersTable.get(clientId);
    if(user.length === 0) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: "This user hasn't been registered"
        });
        return;
    }

    const chatRoomSetting = chatRoomTable.get(chatRoomId);
    if (chatRoomSetting.length === 0) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: "ChatRoom doesn't exist"
        });
        return;
    }

    const chatRoomSettingObj : ChatRoomSetting = JSON.parse<ChatRoomSetting>(chatRoomSetting);
    if(!chatRoomSettingObj.users.includes(clientId)) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: "Your user isn't allowed to load this chatroom"
        });
        return;
    }

    const chatRoomOutput : ChatRoomOutput = {
        success: true,
        chatRoomId: chatRoomId,
        chatRoomSetting: chatRoomSettingObj
    }
    Notifier.sendJson<ChatRoomOutput>(chatRoomOutput);
    return;

}

/**
 * @transaction
 */
export function addChatRoomUsers(input: ChatRoomAdditionalUsersInput): void {

    const clientId = Context.get('sender');
    const chatRoomId = input.chatRoomId;

    const chatRoomTable = Ledger.getTable(chatRoomIds);
    const chatRoomSetting = chatRoomTable.get(chatRoomId);
    if (chatRoomSetting.length === 0) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: "ChatRoom doesn't exist"
        });
        return;
    }

    const chatRoomSettingObj : ChatRoomSetting = JSON.parse<ChatRoomSetting>(chatRoomSetting);
    if(!chatRoomSettingObj.users.includes(clientId)) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: "Your user isn't allowed to modify this chatroom"
        });
        return;
    }

    if (input.additionalUsers.length === 0) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: "You don't have any additional users"
        });
        return;
    }

    for (let i=0;i<input.additionalUsers.length;i++) {
        if (!chatRoomSettingObj.users.includes(input.additionalUsers[i])) {
            chatRoomSettingObj.users.push(input.additionalUsers[i]);
        }
    }

    //update the chat room setting with the updated list of users
    Ledger.getTable(chatRoomIds).set(chatRoomId, JSON.stringify<ChatRoomSetting>(chatRoomSettingObj));

    Notifier.sendJson<SuccessOutput>({
        success: true,
        message: "Chat room users list updated"
    });
    return;
}

/**
 * @transaction
 */
export function writeMessage(input: ChatMessageInput): void {
    const clientId = Context.get('sender');
    const timestamp = getDate();

    const newMessage: ChatMessage = {
        sender: clientId,
        message: input.message,
        timestamp: timestamp
    };

    const user = Ledger.getTable(users).get(clientId);
    if (user.length === 0) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: "User isn't registered"
        });
        return;
    }
    const userObj = JSON.parse<User>(user);
    if (!userObj.chatRooms.includes(input.chatRoom)) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: 'User cannot post on this chat room'
        });
        return;
    }

    const chatTable = Ledger.getTable(chatRoom);
    const list = chatTable.get(input.chatRoom);

    if (list.length === 0) {
        chatTable.set(input.chatRoom, JSON.stringify<ChatMessage[]>([newMessage]));
    } else {
        const existingMessages = JSON.parse<ChatMessage[]>(list);

        existingMessages.push(newMessage);
        chatTable.set(input.chatRoom, JSON.stringify<ChatMessage[]>(existingMessages));
    }

    Notifier.sendJson<WriteMessageOutput>({
        success: true,
        message: 'Done',
        clientId: clientId
    });

    return;
}

/**
 * @query
 */
export function getChat(input: ChatRoomId): void {
    Subscription.setReplayStart();

    const clientId = Context.get('sender');
    const user = Ledger.getTable(users).get(clientId);
    if (user.length === 0) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: "This user hasn't been registered"
        });
        return;
    }
    const userObj = JSON.parse<User>(user);
    if (!userObj.chatRooms.includes(input.chatRoomId)) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: 'This user cannot load chat from this chatroom'
        });
        return;
    }

    const chatRoomTable = Ledger.getTable(chatRoomIds);
    const chatRoomSetting = chatRoomTable.get(input.chatRoomId);

    if (chatRoomSetting.length === 0) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: "This chatroom hasn't been set"
        });
        return;
    }

    const chatRoomSettingObj = JSON.parse<ChatRoomSetting>(chatRoomSetting);

    const chatTable = Ledger.getTable(chatRoom);
    const list = chatTable.get(input.chatRoomId);

    if (list.length === 0) {
        Notifier.sendJson<ChatOutput>({
            success: true,
            chatRoomId: input.chatRoomId,
            chatRoomName: chatRoomSettingObj.name,
            messages: []
        });
        return;
    }

    const msgs = JSON.parse<ChatMessage[]>(list);
    Notifier.sendJson<ChatOutput>({
        success: true,
        chatRoomId: input.chatRoomId,
        chatRoomName: chatRoomSettingObj.name,
        messages: msgs
    });
    return;
}

/**
 * @transaction
 */
export function clearChat(input: ChatRoomId): void {
    const clientId = Context.get('sender');

    const user = Ledger.getTable(users).get(clientId);
    if (user.length === 0) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: "User isn't registered"
        });
        return;
    }
    const userObj = JSON.parse<User>(user);
    if (!userObj.chatRooms.includes(input.chatRoomId)) {
        Notifier.sendJson<ErrorOutput>({
            success: false,
            exception: 'User cannot post on this chat room'
        });
        return;
    }

    const chatTable = Ledger.getTable(chatRoom);

    chatTable.set(input.chatRoomId, JSON.stringify<ChatMessage[]>([]));

    Notifier.sendJson<ClearChatOutput>({
        success: true,
        message: 'Messages are cleared'
    });
}

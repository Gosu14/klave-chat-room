import { JSON } from '@klave/sdk';

@serializable
export class ChatMessageInput {
    chatRoom!: string;
    message!: string;
}

@serializable
export class ChatMessage {
    sender!: string;
    message!: string;
    timestamp!: i64;
}

@serializable
export class ChatOutput {
    success!: boolean;
    chatRoomId!: string;
    chatRoomName!: string;
    messages!: ChatMessage[];
}

@serializable
export class WriteMessageOutput {
    success!: boolean;
    message!: string;
    clientId!: string;
}

@serializable
export class ClearChatOutput {
    success!: boolean;
    message!: string;
}

@serializable
export class KVInput {
    key!: string;
    value!: string;
}

@serializable
export class User {
    key!: string;
    username!: string;
    email!: string;
    phoneNumber!: string;
    chatRooms!: string[];
}

@serializable
export class UserName {
    username!: string;
}

@serializable
export class UserKey {
    key!: string;
}

@serializable
export class UserOutput {
    success!: boolean;
    user!: User;
}

@serializable
export class UserOutputList {
    success!: boolean;
    userList!: User[];
}

@serializable
export class ErrorOutput {
    success!: boolean;
    exception!: string;
}

@serializable
export class ChatRoomId {
    chatRoomId!: string;
}

@serializable
export class ChatRoomSetting {
    name!: string;
    users!: string[];
}

@serializable
export class ChatRoomOutput {
    success!: boolean;
    name!: string;
    chatRoomIdentification!: string;
}
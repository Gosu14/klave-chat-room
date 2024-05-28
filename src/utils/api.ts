import secretariumHandler from '@/utils/secretarium-handler';
import {
    UserList,
    User,
    UserResult,
    TransactionResult,
    ChatResult,
    ChatMessageInput,
    ChatRoomCreationInput,
    CreateChatRoomResult
} from '@/utils/types';

export const klaveContract = import.meta.env.VITE_APP_KLAVE_CONTRACT;

export const waitForConnection = () =>
    new Promise<void>((resolve) => {
        const loopCondition = () => {
            const isConnected = secretariumHandler.isConnected();
            if (isConnected) resolve();
            else setTimeout(loopCondition, 1000);
        };
        loopCondition();
    });

export const isConnected = () => secretariumHandler.isConnected();

export const isExistingUser = async (key: string): Promise<UserResult> =>
    waitForConnection()
        .then(() =>
            secretariumHandler.request(klaveContract, 'isExistingUser', { key }, `isExistingUser-${Math.random()}`)
        )
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const getUser = async (key: string): Promise<UserResult> =>
    waitForConnection()
        .then(() => secretariumHandler.request(klaveContract, 'getUser', { key }, `getChat-${Math.random()}`))
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const listUsers = async (): Promise<UserList> =>
    waitForConnection()
        .then(() => secretariumHandler.request(klaveContract, 'listUsers', {}, `getChat-${Math.random()}`))
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const getChat = async (chatRoomId: string): Promise<ChatResult> =>
    waitForConnection()
        .then(() => secretariumHandler.request(klaveContract, 'getChat', { chatRoomId }, `getChat-${Math.random()}`))
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const setUser = async (user: User): Promise<TransactionResult> =>
    waitForConnection()
        .then(() => secretariumHandler.request(klaveContract, 'setUser', user, `setChat-${Math.random()}`))
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const createChatRoom = async (input: ChatRoomCreationInput): Promise<CreateChatRoomResult> =>
    waitForConnection()
        .then(() =>
            secretariumHandler.request(klaveContract, 'createChatRoom', input, `createChatRoom-${Math.random()}`)
        )
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const writeMessage = async (input: ChatMessageInput): Promise<TransactionResult> =>
    waitForConnection()
        .then(() => secretariumHandler.request(klaveContract, 'writeMessage', input, `writeMessage-${Math.random()}`))
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const updateChatRoomName = async (chatRoomId: string, name: string): Promise<TransactionResult> =>
    waitForConnection()
        .then(() =>
            secretariumHandler.request(
                klaveContract,
                'updateChatRoomName',
                { chatRoomId, name },
                `updateChatRoomName-${Math.random()}`
            )
        )
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const leaveChatRoom = async (chatRoomId: string): Promise<TransactionResult> =>
    waitForConnection()
        .then(() =>
            secretariumHandler.request(klaveContract, 'leaveChatRoom', { chatRoomId }, `leaveChatRoom-${Math.random()}`)
        )
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

export const addChatRoomUsers = async (chatRoomId: string, additionalUsers: string[]): Promise<TransactionResult> =>
    waitForConnection()
        .then(() =>
            secretariumHandler.request(
                klaveContract,
                'addChatRoomUsers',
                { chatRoomId, additionalUsers },
                `addChatRoomUsers-${Math.random()}`
            )
        )
        .then(
            (tx) =>
                new Promise((resolve, reject) => {
                    tx.onResult((result) => {
                        resolve(result);
                    });
                    tx.onError((error) => {
                        reject(error);
                    });
                    tx.send().catch(reject);
                })
        );

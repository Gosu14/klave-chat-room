import { EncryptedKeyPair } from '@secretarium/connector';

export type KeyPair = EncryptedKeyPair & {
    id: string;
    name: string;
};

export type User = {
    key: string;
    username: string;
    email: string;
    phoneNumber: string;
    chatRooms: string[];
};

export type ChatMessage = {
    sender: string;
    message: string;
    timestamp: number;
};

export type ChatMessageInput = {
    chatRoom: string;
    message: string;
};

export type ChatRoomCreationInput = {
    name: string;
    users: string[];
};

export type ChatRoomResult = {
    success: boolean;
    name: string;
    chatRoomIdentification: string;
};

export type UserResult = {
    success: boolean;
    user: User;
    exception?: string;
};

export type UserList = {
    success: boolean;
    userList: User[];
    message?: string;
};

export type TransactionResult = {
    success: boolean;
    exception?: string;
};

export type ActionData = {
    error: boolean;
    message?: string;
};

export type CreateChatRoomResult =
    | {
          success: true;
          chatRoomIdentification: string;
          name: string;
      }
    | {
          success: false;
          exception: string;
      };

export type ChatResult =
    | {
          success: true;
          messages: ChatMessage[];
      }
    | {
          success: false;
          exception: string;
      };

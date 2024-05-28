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
    chatRoomId: string;
};

export type UserList = {
    success: boolean;
    userList: User[];
    message?: string;
};

export type TransactionResult =
    | {
          success: true;
          message: string;
      }
    | {
          success: false;
          exception: string;
      };

export type ActionData = {
    error: boolean;
    message?: string;
};

export type ChatRoomSetting = {
    name: string;
    users: string[];
};

export type UserResult =
    | {
          success: true;
          user: User;
      }
    | {
          success: false;
          exception: string;
      };

export type CreateChatRoomResult =
    | {
          success: true;
          chatRoomId: string;
          chatRoomSetting: ChatRoomSetting;
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

export type GetChatRoomResult =
    | {
          success: true;
          chatRoomId: string;
          chatRoomSetting: ChatRoomSetting;
      }
    | {
          success: false;
          exception: string;
      };

export type TransactionError = {
    success: false;
    exception: string;
}

export type EditChatLoader = {
    id: string;
    name: string;
    users: string[];
};

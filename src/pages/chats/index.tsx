import { redirect, useLoaderData } from 'react-router-dom';
import { ChatPreview } from '@/components/chat-preview';
import { Helmet } from 'react-helmet-async';
import { getCurrentDevicePublicKeyHash } from '@/lib/utils';
import { isConnected, getUser, getChat, listUsers } from '@/utils/api';
import { ChatMessage, User } from '@/utils/types';

type LoaderResult = {
    userList: User[];
    chats: {
        success: boolean;
        chatRoomId: string;
        chatRoomName: string;
        messages: ChatMessage[];
    }[];
};

export const loader = async () => {
    const isConnectedState = isConnected();

    if (!isConnectedState) {
        return redirect('/auth');
    }

    const key = getCurrentDevicePublicKeyHash();

    const getUserResult = await getUser(key);
    const { success: listUsersSuccess, userList } = await listUsers();

    // TODO: handle error
    if (!getUserResult.success || !listUsersSuccess) {
        return {
            error: true,
            message: 'Something went wrong'
        };
    }
    const chats = await Promise.all(getUserResult.user.chatRooms.map((chat) => getChat(chat)));

    return {
        chats,
        userList
    };
};

export const Chats = () => {
    const { userList, chats } = useLoaderData() as LoaderResult;

    return (
        <>
            <Helmet>
                <title>Chats | Chat App</title>
            </Helmet>
            <div className="grid h-full divide-x divide-slate-400">
                <div className="flex flex-col py-4">
                    <h1 className="px-4 text-2xl font-semibold">Chats</h1>
                    {chats?.length > 0 ? (
                        <div className="flex flex-col divide-y divide-slate-400 pt-8">
                            {chats.map((chat) => (
                                <ChatPreview
                                    key={chat.chatRoomId}
                                    id={chat.chatRoomId}
                                    chatRoomName={chat.chatRoomName}
                                    messages={chat.messages}
                                    userList={userList}
                                />
                            ))}
                        </div>
                    ) : (
                        <i className="pt-8 text-center">No chats yet</i>
                    )}
                </div>
            </div>
        </>
    );
};

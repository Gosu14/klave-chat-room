import { idToUrl, unixToDateTime, getCurrentDevicePublicKeyHash } from '@/lib/utils';
import { ChatMessage, User } from '@/utils/types';
import { NavLink } from 'react-router-dom';

type ChatPreviewProps = {
    id: string;
    chatRoomName: string;
    messages: ChatMessage[];
    userList: User[];
};

export const ChatPreview: React.FC<ChatPreviewProps> = ({ id, chatRoomName, messages, userList }) => {
    // const user = userList.find(
    //     (user) => user.key === messages[messages?.length - 1]?.sender
    // );

    let user;
    if (messages?.length > 0) {
        user = userList.find((user) => user.key === messages[messages?.length - 1]?.sender);
    }
    return (
        <NavLink
            to={`/chats/${idToUrl(id)}`}
            state={{ chatRoomName, userList }}
            className={({ isActive }) =>
                `flex items-center gap-4 p-4 ${
                    isActive ? 'bg-blue-200 text-blue-600' : 'transition-colors hover:bg-blue-100 hover:text-blue-500'
                }`
            }
        >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 p-4">
                <UserSVG />
            </div>
            {messages.length === 0 ? (
                <div className="flex flex-col text-sm">
                    <div className="font-semibold">Chat: {chatRoomName}</div>
                    <div className="italic">Start messaging</div>
                </div>
            ) : (
                <div className="flex flex-col gap-1 text-sm">
                    <span className="font-semibold">Chat: {chatRoomName}</span>
                    <div className="flex gap-1">
                        <span className="font-semibold">
                            {getCurrentDevicePublicKeyHash() === messages[messages.length - 1].sender
                                ? 'You'
                                : user?.username}
                            :
                        </span>
                        <span className="italic">{messages[messages.length - 1].message}</span>
                    </div>
                    <div>{unixToDateTime(messages[messages.length - 1].timestamp)}</div>
                </div>
            )}
        </NavLink>
    );
};

const UserSVG = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
        </svg>
    );
};

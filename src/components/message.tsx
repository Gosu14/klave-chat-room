import { ChatMessage, User } from '@/utils/types';
import { getCurrentDevicePublicKeyHash, cn, unixToDateTime } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

export const Message: React.FC<ChatMessage> = ({ message, sender, timestamp }) => {
    const { state } = useLocation();

    let senderUsername = '';
    if (state?.userList) {
        senderUsername = state.userList.find((user: User) => user.key === sender)?.username;
    }
    return (
        <div className={cn('flex flex-col', getCurrentDevicePublicKeyHash() === sender ? 'ml-auto' : 'mr-auto')}>
            <div className={cn('flex flex-col', getCurrentDevicePublicKeyHash() === sender ? 'ml-auto' : 'mr-auto')}>
                <span
                    className={cn('text-xs', getCurrentDevicePublicKeyHash() === sender ? 'text-right' : 'text-left')}
                >
                    {getCurrentDevicePublicKeyHash() === sender ? 'You' : senderUsername}
                </span>
                <span
                    className={cn(
                        'w-fit rounded-xl p-2',
                        getCurrentDevicePublicKeyHash() === sender ? 'bg-blue-500 text-white' : 'bg-slate-300'
                    )}
                >
                    {message}
                </span>
            </div>
            <span className="text-xs">{unixToDateTime(timestamp)}</span>
        </div>
    );
};

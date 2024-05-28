import { User } from '@/utils/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { createChatRoom } from '@/utils/api';
import { getCurrentDevicePublicKeyHash } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const UserPreview: React.FC<{ user: User }> = ({ user }) => {
    const [error, setError] = useState<string | undefined>();
    const [chatName, setChatName] = useState<string>('');
    const navigate = useNavigate();

    const handleCreateChat = async () => {
        await createChatRoom({
            name: chatName,
            users: [getCurrentDevicePublicKeyHash(), user.key]
        })
            .then((res) => {
                if (res.success) {
                    navigate('/chats');
                } else setError(res.exception);
            })
            .catch((err) => console.log(err));
    };

    return (
        <Card className="w-64">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 p-2">
                        <UserSVG />
                    </div>
                    {user.username} {user.key === getCurrentDevicePublicKeyHash() ? '(you)' : null}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="phone">Phone number</Label>
                            <Input id="phone" disabled value={user.phoneNumber} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email address</Label>
                            <Input id="email" disabled value={user.email} />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Popover>
                    <PopoverTrigger className="w-full" disabled={user.key === getCurrentDevicePublicKeyHash()}>
                        <Button
                            variant="secondary"
                            className="w-full"
                            disabled={user.key === getCurrentDevicePublicKeyHash()}
                        >
                            <Send className="mr-2 h-4 w-4" /> Message
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-full flex-col space-y-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="chatName">Chat name</Label>
                            <Input
                                id="email"
                                placeholder="Type in chat name"
                                onChange={(e) => setChatName(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" onClick={handleCreateChat}>
                            Create chat room
                        </Button>
                    </PopoverContent>
                </Popover>
                {error ? <span className="text-red-500">{error}</span> : null}
            </CardFooter>
        </Card>
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

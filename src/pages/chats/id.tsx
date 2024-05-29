import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { writeMessage } from '@/utils/api';
import { urlToId } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Send, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { Message } from '@/components/message';

export const ChatId = () => {
    const [text, setText] = useState('');
    const { chatId } = useParams<{ chatId: string }>();
    const { state } = useLocation();
    const messages = useChat(urlToId(chatId ?? ''));

    const handleWriteMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (chatId)
            try {
                writeMessage({ chatRoom: urlToId(chatId), message: text });
            } catch (error) {
                console.error(error);
            }

        setText('');
    };

    return (
        <>
            <Helmet>
                <title>Chat: {state.chatRoomName} | Chat App</title>
            </Helmet>
            <div className="flex h-screen w-full flex-col divide-y divide-slate-400">
                <div className="flex flex-none items-center justify-between p-4 text-2xl font-semibold shadow-md">
                    <Link to="/chats">
                        <Button className="rounded-full pr-4">
                            <ChevronLeft className="h-6 w-6" /> Back to chats
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">Chat: {state.chatRoomName}</div>
                        <Link to={`/chats/${chatId}/edit`}>
                            <Button className="rounded-full pr-4">
                                <Pencil className="h-6 w-6 mr-2" /> Edit chat
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex h-auto max-h-full flex-1 flex-col gap-2 overflow-auto p-4">
                    {messages.map((m, i) => (
                        <Message key={i} {...m} />
                    ))}
                </div>
                <div className="mt-auto flex-none p-4">
                    <form className="flex flex-col gap-2" onSubmit={handleWriteMessage}>
                        <Input
                            placeholder="Type your message here."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <Button type="submit">
                            <Send className="mr-2 h-4 w-4" /> Send message
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
};

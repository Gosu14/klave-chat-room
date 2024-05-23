import { useEffect, useState } from 'react';
import secretariumHandler from '@/utils/secretarium-handler';
import { ChatMessage, ChatResult } from '@/utils/types';
import { klaveContract, waitForConnection } from '@/utils/api';

export function useChat(chatRoomId: string) {
    const [data, setData] = useState<ChatMessage[]>([]);

    useEffect(() => {
        const getChat = async (): Promise<ChatResult> =>
            waitForConnection()
                .then(() =>
                    secretariumHandler.request(
                        klaveContract,
                        'getChat',
                        { chatRoomId },
                        `getChat-${Math.random()}`
                    )
                )
                .then(
                    (tx) =>
                        new Promise((resolve, reject) => {
                            tx.onResult((result) => {
                                setData(result.messages)
                                resolve(result);
                            });
                            tx.onError((error) => {
                                reject(error);
                            });
                            tx.send().catch(reject);
                        })
                );

        getChat();
    }, []);

    return data;
}

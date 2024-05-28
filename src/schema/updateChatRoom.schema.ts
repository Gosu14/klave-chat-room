import { z } from 'zod';

export const updateChatRoomSchema = z.object({
    id: z.string(),
    name: z
        .string()
        .min(2, {
            message: 'Chat room name must be at least 2 characters.'
        })
        .max(16, { message: 'Chat room name must be at most 16 characters.' }),
    users: z.array(z.string())
});

export type UpdateChatRoomFormType = z.infer<typeof updateChatRoomSchema>;

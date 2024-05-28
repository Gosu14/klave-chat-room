import { z } from 'zod';
import { zPhoneNumber } from '@/utils/zPhoneNumber';

export const updateProfileSchema = z.object({
    username: z
        .string()
        .min(2, {
            message: 'Username must be at least 2 characters.'
        })
        .max(16, { message: 'Username must be at most 16 characters.' }),
    email: z.string().email({
        message: 'This is not a valid email address.'
    }),
    phoneNumber: zPhoneNumber
});

export type UpdateProfileFormType = z.infer<typeof updateProfileSchema>;

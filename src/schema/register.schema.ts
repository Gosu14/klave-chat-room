import { z } from 'zod';
import { zPhoneNumber } from '@/utils/zPhoneNumber';

export const registerSchema = z
    .object({
        username: z
            .string()
            .min(2, {
                message: 'Username must be at least 2 characters.'
            })
            .max(16, { message: 'Username must be at most 16 characters.' }),
        email: z.string().email({
            message: 'This is not a valid email address.'
        }),
        phoneNumber: zPhoneNumber,
        password: z.string().min(4, {
            message: 'Password must be at least 4 characters.'
        }),
        confirmPassword: z.string().min(4, {
            message: 'Confirm password must be at least 4 characters.'
        })
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match.",
        path: ['confirmPassword'] // path of error
    });

export type RegisterFormType = z.infer<typeof registerSchema>;

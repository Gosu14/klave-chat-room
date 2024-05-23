import { z } from 'zod';

export const signinSchema = z.object({
    email: z.string().email({
        message: 'This is not a valid email address.'
    }),
    password: z.string().min(4, {
        message: 'Password must be at least 4 characters.'
    })
});

export type SigninFormType = z.infer<typeof signinSchema>;

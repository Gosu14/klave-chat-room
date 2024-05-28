import { Helmet } from 'react-helmet-async';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { getCurrentDevicePublicKeyHash } from '@/lib/utils';
import { getUser, isConnected, setUser } from '@/utils/api';
import {
    ActionFunction,
    Form as ReactRouterForm,
    redirect,
    useLoaderData,
    useSubmit,
    useActionData
} from 'react-router-dom';
import { ActionData, User } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';
import { updateProfileSchema, UpdateProfileFormType } from '@/schema/updateProfile.schema';

export const loader = async () => {
    const isConnectedState = isConnected();

    if (!isConnectedState) {
        return redirect('/auth');
    }

    const key = getCurrentDevicePublicKeyHash();
    const result = await getUser(key);

    if (!result.success) {
        return {
            error: true,
            user: null,
            message: result.exception
        };
    }

    return result.user
};

export const Settings = () => {
    const result = useActionData() as ActionData;
    const user = useLoaderData() as User;
    const submit = useSubmit();

    const form = useForm<UpdateProfileFormType>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber
        }
    });

    const onSubmit = (data: any) => {
        submit({ ...data, chatRooms: user.chatRooms ?? [] }, { method: 'post' });
    };

    return (
        <>
            <Helmet>
                <title>Settings | Chat App</title>
            </Helmet>
            <div className="flex flex-col p-4">
                <h1 className="pb-8 text-2xl font-semibold">Settings</h1>
                <div className="flex flex-col">
                    <Form {...form}>
                        <ReactRouterForm onSubmit={form.handleSubmit(onSubmit)} className="max-w-80 space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Type in your username" {...field} />
                                        </FormControl>
                                        <FormDescription>This is your public display name.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Type in your email address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Type in your phone number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                <Check className="mr-2 h-4 w-4" />
                                Update
                            </Button>
                        </ReactRouterForm>
                    </Form>
                    {result?.error ? (
                        <span className="pt-4 text-red-500">{result?.message}</span>
                    ) : (
                        <span className="pt-4 text-green-500">{result?.message}</span>
                    )}
                </div>
            </div>
        </>
    );
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const email = formData.get('email');
    const phoneNumber = formData.get('phoneNumber');
    const chatRooms = formData.getAll('chatRooms') as string[];

    console.log(username, email, phoneNumber, chatRooms);

    if (typeof username !== 'string') {
        return { error: true, message: 'Please fill in your username.' };
    }

    if (typeof email !== 'string') {
        return { error: true, message: 'Please fill in your email address.' };
    }

    if (typeof phoneNumber !== 'string') {
        return { error: true, message: 'Please fill in your phone number.' };
    }

    const result = await setUser({
        key: getCurrentDevicePublicKeyHash(),
        username,
        email,
        phoneNumber,
        chatRooms
    });

    if (!result.success) {
        return {
            error: true,
            message: result.exception
        };
    }

    return {
        error: false,
        message: 'Settings updated successfully'
    };
};

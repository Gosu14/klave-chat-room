import { Helmet } from 'react-helmet-async';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChevronLeft, LogIn } from 'lucide-react';
import {
    redirect,
    type ActionFunction,
    Form as ReactRouterForm,
    useActionData,
    useSubmit,
    Link
} from 'react-router-dom';
import secretariumHandler from '@/utils/secretarium-handler';
import { Key, Utils } from '@secretarium/connector';
import { setUser } from '@/utils/api';
import { ActionData } from '@/utils/types';
import { LOC_KEY } from '@/utils/constants';
import { formSchema, FormType } from '@/schema/form.schema';
import { urlToId } from '@/lib/utils';

export const Register = () => {
    const result = useActionData() as ActionData;
    const submit = useSubmit();

    const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = (data: any) => {
        submit({ ...data }, { method: 'post' });
    };

    return (
        <>
            <Helmet>
                <title>Register | Chat App</title>
            </Helmet>
            <h1 className="p-4 text-2xl font-semibold">Chat App</h1>
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
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Type in your password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Type in your password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-between gap-4">
                        <Link to="/auth">
                            <Button className="w-full" variant="outline">
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Go back
                            </Button>
                        </Link>
                        <Button type="submit" className="w-full">
                            <LogIn className="mr-2 h-4 w-4" />
                            Register
                        </Button>
                    </div>
                </ReactRouterForm>
            </Form>
            {result?.error ? <span className="pt-4 text-red-500">{result?.message}</span> : null}
        </>
    );
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const email = formData.get('email');
    const phoneNumber = formData.get('phoneNumber');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (typeof username !== 'string') {
        return { error: true, message: 'Please fill in your username.' };
    }

    if (typeof email !== 'string') {
        return { error: true, message: 'Please fill in your email address.' };
    }

    if (typeof phoneNumber !== 'string') {
        return { error: true, message: 'Please fill in your phone number.' };
    }

    if (typeof password !== 'string') {
        return { error: true, message: 'Please fill in your password.' };
    }

    if (typeof confirmPassword !== 'string') {
        return { error: true, message: 'Please confirm your password.' };
    }

    if (password !== confirmPassword) {
        return { error: true, message: "Passwords don't match." };
    }

    let base64key = '';

    await secretariumHandler
        .createKeyPair({
            name: email,
            password: password
        })
        .then((encKey) => {
            const localeStorageKey = LOC_KEY;
            const json = window.localStorage.getItem(localeStorageKey);
            const prevKeys = json ? JSON.parse(json) : [];
            const updatedKeys = [...prevKeys, encKey];
            const uniqueKeys = [...new Set(updatedKeys)];
            window.localStorage.setItem(localeStorageKey, JSON.stringify(uniqueKeys));
            return Key.importEncryptedKeyPair(encKey, password);
        })
        .then((key) => key.getRawPublicKey())
        .then((rawPublicKey) => Utils.hash(rawPublicKey))
        .then((hashPublicKey) => {
            (window as any).currentDevicePublicKeyHash = Utils.toBase64(hashPublicKey, true);
            base64key = Utils.toBase64(hashPublicKey, true);
            return secretariumHandler.connect();
        })
        .catch(console.error);

    const { success, exception } = await setUser({
        key: urlToId(base64key),
        username,
        email,
        phoneNumber,
        chatRooms: []
    });

    if (!success) {
        return {
            error: true,
            message: exception
        };
    }

    return redirect('/');
};

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    LoaderFunction,
    redirect,
    useLoaderData,
    useNavigate,
    Form as ReactRouterForm,
    useSubmit,
    ActionFunction,
    useActionData
} from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft, CircleAlert } from 'lucide-react';
import { addChatRoomUsers, getChatRoom, isConnected, leaveChatRoom, listUsers, updateChatRoomName } from '@/utils/api';
import { urlToId } from '@/lib/utils';
import { ActionData, EditChatLoader } from '@/utils/types';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { updateChatRoomSchema, UpdateChatRoomFormType } from '@/schema/updateChatRoom.schema';
import { toast } from 'sonner';

export const loader: LoaderFunction = async ({ params }) => {
    const isConnectedState = isConnected();

    if (!isConnectedState) {
        return redirect('/auth');
    }

    const chatId = params.chatId;
    if (!chatId) {
        return {
            error: true,
            message: 'Please provide a chat id.'
        };
    }

    const getChatRoomResult = await getChatRoom(urlToId(chatId));
    const listUsersResult = await listUsers();

    if (!getChatRoomResult.success) {
        return {
            error: true,
            message: getChatRoomResult.exception
        };
    }

    if (!listUsersResult.success) {
        return {
            error: true,
            message: 'Could not fetch user list.'
        };
    }

    return {
        id: getChatRoomResult.chatRoomId,
        name: getChatRoomResult.chatRoomSetting.name,
        users: getChatRoomResult.chatRoomSetting.users,
        userList: listUsersResult.userList
    };
};

export const EditChat = () => {
    const result = useActionData() as ActionData;
    const data = useLoaderData() as EditChatLoader;
    const navigate = useNavigate();
    const submit = useSubmit();

    const form = useForm<UpdateChatRoomFormType>({
        resolver: zodResolver(updateChatRoomSchema),
        defaultValues: {
            id: data.id,
            name: data.name,
            users: data.users,
            userToAdd: ''
        }
    });

    const onSubmit = (data: any) => {
        submit({ ...data }, { method: 'post' });
    };

    const handleLeaveChat = () => {
        leaveChatRoom(data.id)
            .then((result) => {
                if (result.success) {
                    navigate('/chats');
                    toast('Successfully left chat room.');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <>
            <Helmet>
                <title>Editing Chat | Chat App</title>
            </Helmet>
            <div className="flex h-screen w-full flex-col divide-y divide-slate-400">
                <div className="flex flex-none items-center justify-between p-4 text-2xl font-semibold shadow-md">
                    <Button className="rounded-full pr-4" onClick={() => navigate(-1)}>
                        <ChevronLeft className="h-6 w-6" /> Back to chat
                    </Button>
                    <div className="flex items-center gap-2">Editing chat: {data.name}</div>
                </div>
                <div className="flex h-full flex-col">
                    <Form {...form}>
                        <ReactRouterForm onSubmit={form.handleSubmit(onSubmit)} className="max-w-80 space-y-4 p-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chat room name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Type in your username" {...field} />
                                        </FormControl>
                                        <FormDescription>This is the chats public display name.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="userToAdd"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contacts</FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a contact" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {data.userList.map((user) => (
                                                    <SelectItem
                                                        key={user.key}
                                                        value={user.key}
                                                        disabled={data.users.includes(user.key)}
                                                    >
                                                        {user.username} - {user.email}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Select a contact to add to this chat room.</FormDescription>
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
                        <span className="p-4 text-red-500">{result?.message}</span>
                    ) : (
                        <span className="p-4 text-green-500">{result?.message}</span>
                    )}
                    <div className="mt-auto flex flex-col gap-4 bg-red-200 p-4">
                        <h2 className="flex items-center gap-2 text-xl font-semibold text-red-800">
                            <CircleAlert />
                            Danger zone
                        </h2>
                        <p>
                            The actions listed below are either destructrive, leading to a loss of data or a loss of
                            permissions.
                        </p>
                        <Button onClick={handleLeaveChat} className="w-56" variant="destructive">
                            Leave chat room
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const chatRoomId = formData.get('id');
    const chatRoomName = formData.get('name');
    const userToAdd = formData.get('userToAdd');
    //const users = formData.getAll('users') as [];

    if (typeof chatRoomName !== 'string') {
        return { error: true, message: 'Please fill in chat room name.' };
    }

    if (typeof chatRoomId !== 'string') {
        return { error: true, message: 'Invalid chat room id.' };
    }

    // remove empty strings from array
    const additionalUsersList = [userToAdd].filter((n) => n) as string[];

    console.log(additionalUsersList);
    const editChatRoomNameResult = await updateChatRoomName(chatRoomId, chatRoomName);
    const addUserResult = await addChatRoomUsers(chatRoomId, additionalUsersList);

    if (editChatRoomNameResult.success && addUserResult.success) {
        return { error: false, message: 'Chat room updated successfully.' };
    }

    return { error: true, message: 'Failed to edit chat room.' };
};

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    LoaderFunction,
    redirect,
    useLoaderData,
    useLocation,
    useNavigate,
    Form as ReactRouterForm,
    useSubmit
} from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft, CircleAlert } from 'lucide-react';
import { getChatRoom, isConnected } from '@/utils/api';
import { urlToId } from '@/lib/utils';
import { EditChatLoader } from '@/utils/types';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateChatRoomSchema, UpdateChatRoomFormType } from '@/schema/updateChatRoom.schema';

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

    const result = await getChatRoom(urlToId(chatId));

    if (!result.success) {
        return {
            error: true,
            message: result.exception
        };
    }

    return {
        id: result.chatRoomId,
        name: result.chatRoomSetting.name,
        users: result.chatRoomSetting.users
    };
};

export const EditChat = () => {
    const data = useLoaderData() as EditChatLoader;
    const { state } = useLocation();
    const navigate = useNavigate();
    const submit = useSubmit();

    const form = useForm<UpdateChatRoomFormType>({
        resolver: zodResolver(updateChatRoomSchema),
        defaultValues: {
            id: data.id,
            name: data.name,
            users: data.users
        }
    });

    const onSubmit = (data: any) => {
        submit({ ...data }, { method: 'post' });
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
                    <div className="flex items-center gap-2">Editing chat: {state.chatRoomName}</div>
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
                            <Button type="submit" className="w-full">
                                <Check className="mr-2 h-4 w-4" />
                                Update
                            </Button>
                        </ReactRouterForm>
                    </Form>
                    <div className="mt-auto flex flex-col gap-4 bg-red-200 p-4">
                        <h2 className="flex items-center gap-2 text-xl font-semibold text-red-800">
                            <CircleAlert />
                            Danger zone
                        </h2>
                        <p>
                            The actions listed below are either destructrive, leading to a loss of data or a loss of
                            permissions.
                        </p>
                        <Button className="max-w-80" variant="destructive">
                            Leave chat room
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

import { UserPreview } from '@/components/user-preview';
import { isConnected, listUsers } from '@/utils/api';
import { UserList } from '@/utils/types';
import { Helmet } from 'react-helmet-async';
import { redirect, useLoaderData } from 'react-router-dom';

export const loader = async () => {
    const isConnectedState = isConnected();

    if (!isConnectedState) {
        return redirect('/auth');
    }

    const { success, userList, message } = await listUsers();

    if (success) {
        return {
            userList
        };
    }
    // TODO: handle error
    return {
        userList: [],
        message
    };
};

export const Contacts = () => {
    const { userList } = useLoaderData() as UserList;

    return (
        <>
            <Helmet>
                <title>Contacts | Chat App</title>
            </Helmet>
            <div className="flex flex-col p-4">
                <h1 className="text-2xl font-semibold pb-8">Contacts</h1>
                <div className="flex flex-wrap gap-8">
                    {userList.map((user) => (
                        <UserPreview key={user.key} user={user} />
                    ))}
                </div>
            </div>
        </>
    );
};

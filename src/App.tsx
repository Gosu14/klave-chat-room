import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Settings, loader as SettingsLoader, action as UpdateUser } from '@/pages/settings';
import { Chats, loader as ChatsLoader } from '@/pages/chats';
import { ChatId } from '@/pages/chats/id';
import { EditChat, loader as EditChatLoader } from '@/pages/chats/edit';
import { Contacts, loader as ContactsLoader } from '@/pages/contacts';
import { Register, action as CreateUser } from '@/pages/auth/register';
import { Home } from '@/pages/home';
import { RootLayout } from '@/layouts/root-layout';
import { HelmetProvider } from 'react-helmet-async';
import { Auth } from '@/pages/auth';
import { SignIn, action as SignUserIn } from '@/pages/auth/keyname';
import { ErrorPage } from '@/pages/error-page';
import { AuthLayout } from '@/layouts/auth-layout';
import secretariumHandler from './utils/secretarium-handler';

secretariumHandler.initialize();

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'settings',
                element: <Settings />,
                loader: SettingsLoader,
                action: UpdateUser
            },
            {
                path: 'chats',
                element: <Chats />,
                loader: ChatsLoader
            },
            {
                path: 'chats/:chatId',
                element: <ChatId />
            },
            {
                path: 'chats/:chatId/edit',
                element: <EditChat />,
                loader: EditChatLoader
            },
            {
                path: 'contacts',
                loader: ContactsLoader,
                element: <Contacts />
            }
        ]
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Auth />
            },
            {
                path: 'register',
                element: <Register />,
                action: CreateUser
            },
            {
                path: ':keyname',
                element: <SignIn />,
                action: SignUserIn
            }
        ]
    }
]);

export default function App() {
    return (
        <HelmetProvider>
            <RouterProvider router={router} />
        </HelmetProvider>
    );
}

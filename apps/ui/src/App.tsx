import {
    createBrowserRouter,
    RouterProvider,
    useRouteError
} from 'react-router-dom';
import {
    Settings,
    loader as SettingsLoader,
    action as UpdateUser
} from '@/pages/settings';
import { Chats, loader as ChatsLoader } from '@/pages/chats';
import { ChatId } from '@/pages/chats/id';
import { Contacts, loader as ContactsLoader } from '@/pages/contacts';
import { Register, action as CreateUser } from '@/pages/auth/register';
import { Home } from '@/pages/home';
import { RootLayout } from '@/layouts/root-layout';
import { HelmetProvider } from 'react-helmet-async';
import { Auth } from '@/pages/auth';
import { SignIn, action as SignUserIn } from '@/pages/auth/keyname';
import { AuthLayout } from '@/layouts/auth-layout';
import secretariumHandler from './utils/secretarium-handler';

secretariumHandler.initialize();

const ErrorBoundary = () => {
    const error = useRouteError();
    console.error(error);
    return (
        <div className="flex h-screen items-center justify-center">
            Whoops! Something went wrong!
        </div>
    );
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
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
                path: 'contacts',
                loader: ContactsLoader,
                element: <Contacts />
            }
        ]
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <Auth />
            },
            {
                path: 'register',
                element: <Register />,
                action: CreateUser,
                errorElement: <ErrorBoundary />
            },
            {
                path: ':keyname',
                element: <SignIn />,
                action: SignUserIn,
                errorElement: <ErrorBoundary />
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

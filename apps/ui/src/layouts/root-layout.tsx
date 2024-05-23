import { Navigate, Outlet } from 'react-router-dom';
import { SideNav } from '@/components/ui/side-nav';
import { isConnected } from '@/utils/api';

export const RootLayout = () => {
    const isConnectedState = isConnected();

    if (!isConnectedState) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="grid grid-cols-12 divide-x divide-slate-400">
            <div className="col-span-1 md:col-span-2">
                <SideNav />
            </div>
            <div className="col-span-11 h-screen overflow-y-auto md:col-span-10">
                <Outlet />
            </div>
        </div>
    );
};

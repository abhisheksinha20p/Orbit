import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import Topbar from './Topbar';

const Layout = () => {
    return (
        <div className="flex min-h-screen relative">
            <Sidebar />
            <MobileSidebar />

            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                <Topbar />
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;

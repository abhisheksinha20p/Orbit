import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    FolderKanban,
    BarChart3,
    Code2,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { getInitials } from '../../utils/formatters';
import OrbitLogo from '../ui/OrbitLogo';

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const { sidebarCollapsed, toggleSidebar } = useUIStore();

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/projects', icon: FolderKanban, label: 'Projects' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/technologies', icon: Code2, label: 'Technologies' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const handleLogout = () => {
        logout();
    };

    return (
        <motion.aside
            className={`
        hidden lg:flex flex-col
        h-screen sticky top-0
        bg-white/5 backdrop-blur-xl
        border-r border-white/10
        transition-all duration-300
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
      `}
            initial={false}
            animate={{ width: sidebarCollapsed ? 80 : 256 }}
        >
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                    {sidebarCollapsed ? (
                        <div className="mx-auto">
                            <OrbitLogo size={40} animated={false} />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <OrbitLogo size={40} animated={true} />
                            <motion.h1
                                className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                Orbit
                            </motion.h1>
                        </div>
                    )}
                    {!sidebarCollapsed && (
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    {sidebarCollapsed && (
                        <button
                            onClick={toggleSidebar}
                            className="absolute right-2 top-6 p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-300
                ${isActive
                                    ? 'bg-gradient-primary text-white shadow-neon'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }
              `}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!sidebarCollapsed && (
                                <span className="font-medium">{item.label}</span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-white/10">
                <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                        {getInitials(user?.name || 'User')}
                    </div>
                    {!sidebarCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                    )}
                </div>
                {!sidebarCollapsed && (
                    <button
                        onClick={handleLogout}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                )}
            </div>
        </motion.aside>
    );
};

export default Sidebar;

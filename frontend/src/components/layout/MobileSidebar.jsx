import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FolderKanban,
    BarChart3,
    Code2,
    Settings,
    LogOut,
    X
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { getInitials } from '../../utils/formatters';
import { drawerSlide, modalOverlay } from '../../utils/animations';
import OrbitLogo from '../ui/OrbitLogo';

const MobileSidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const { mobileMenuOpen, closeMobileMenu } = useUIStore();

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/projects', icon: FolderKanban, label: 'Projects' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/technologies', icon: Code2, label: 'Technologies' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    useEffect(() => {
        closeMobileMenu();
    }, [location.pathname, closeMobileMenu]);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const handleLogout = () => {
        logout();
        closeMobileMenu();
    };

    return (
        <AnimatePresence>
            {mobileMenuOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        variants={modalOverlay}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={closeMobileMenu}
                    />

                    <motion.aside
                        className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-slate-900/95 backdrop-blur-xl border-r border-white/10 z-50 lg:hidden flex flex-col"
                        variants={drawerSlide}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <OrbitLogo size={40} animated={true} />
                                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                                    Orbit
                                </h1>
                            </div>
                            <button
                                onClick={closeMobileMenu}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

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
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </NavLink>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                                    {getInitials(user?.name || 'User')}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                                    <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileSidebar;

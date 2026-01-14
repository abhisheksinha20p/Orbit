import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Folder, Cpu, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Projects', path: '/projects', icon: Folder },
        { name: 'Technologies', path: '/technologies', icon: Cpu },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold gradient-text">Orbit</h1>
                <p className="text-white/60 text-sm mt-1">Project Management</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-white/20 text-white shadow-neon'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-white/10">
                <div className="glass-card flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-white font-medium text-sm">{user?.name}</p>
                            <p className="text-white/60 text-xs">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-white/70 hover:text-red-400 transition-colors p-2 hover:bg-white/10 rounded-lg"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 glass p-3 rounded-xl text-white"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 glass-white h-screen sticky top-0">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        />

                        {/* Sidebar */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 glass-white z-50"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

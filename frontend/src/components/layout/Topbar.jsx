import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { motion } from 'framer-motion';

const Topbar = () => {
    const { toggleMobileMenu } = useUIStore();

    return (
        <motion.header
            className="sticky top-0 z-30 bg-white/5 backdrop-blur-xl border-b border-white/10"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden md:flex items-center flex-1 max-w-md">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orbit-blue/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default Topbar;

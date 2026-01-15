import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, RefreshCw } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import { fadeInUp } from '../utils/animations';

const ServerError = () => {
    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial-blue opacity-20 blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial-purple opacity-20 blur-3xl animate-pulse-slow" />

            <motion.div
                className="w-full max-w-2xl relative z-10"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
            >
                <GlassCard gradient className="p-12 text-center">
                    <motion.h1
                        className="text-9xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        500
                    </motion.h1>

                    <h2 className="text-3xl font-bold text-white mb-4">
                        Server Error
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Something went wrong on our end. We're working to fix it.
                        Please try again in a moment.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <PrimaryButton icon={RefreshCw} onClick={handleRetry}>
                            Try Again
                        </PrimaryButton>
                        <Link to="/dashboard">
                            <SecondaryButton icon={Home}>
                                Go to Dashboard
                            </SecondaryButton>
                        </Link>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
};

export default ServerError;

import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Loader Component
 * Loading spinner with gradient animation
 */
const Loader = ({
    size = 'md',
    fullScreen = false,
    text = '',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4',
        xl: 'w-24 h-24 border-4'
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
                {/* Gradient spinner */}
                <motion.div
                    className={`
            ${sizeClasses[size]}
            rounded-full
            border-transparent
            border-t-orbit-blue
            border-r-orbit-purple
            ${className}
          `}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear'
                    }}
                />

                {/* Glow effect */}
                <div className={`
          absolute inset-0 ${sizeClasses[size]}
          rounded-full
          bg-gradient-primary
          opacity-20
          blur-md
        `} />
            </div>

            {text && (
                <motion.p
                    className="text-gray-300 text-sm font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {text}
                </motion.p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                {spinner}
            </div>
        );
    }

    return spinner;
};

Loader.propTypes = {
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    fullScreen: PropTypes.bool,
    text: PropTypes.string,
    className: PropTypes.string,
};

export default Loader;

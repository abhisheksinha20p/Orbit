import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Badge Component
 * Small status badge with various color variants
 */
const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    className = '',
    ...props
}) => {
    const variants = {
        default: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
        primary: 'bg-orbit-blue/20 text-orbit-blue-light border-orbit-blue/30',
        secondary: 'bg-orbit-purple/20 text-orbit-purple-light border-orbit-purple/30',
        success: 'bg-green-500/20 text-green-300 border-green-500/30',
        warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        error: 'bg-red-500/20 text-red-300 border-red-500/30',
        info: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    };

    const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
        lg: 'text-base px-3 py-1.5',
    };

    return (
        <motion.span
            className={`
        inline-flex items-center justify-center
        font-medium
        rounded-full
        border
        backdrop-blur-sm
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            {...props}
        >
            {children}
        </motion.span>
    );
};

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    className: PropTypes.string,
};

export default Badge;

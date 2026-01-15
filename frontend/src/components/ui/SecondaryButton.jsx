import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * SecondaryButton Component
 * Secondary glass button with border and subtle animations
 */
const SecondaryButton = ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    loading = false,
    size = 'md',
    fullWidth = false,
    icon: Icon,
    className = '',
    ...props
}) => {
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    const baseClasses = `
    bg-white/10 backdrop-blur-md
    border border-white/20
    text-white font-semibold
    rounded-xl
    hover:bg-white/20 hover:border-white/30
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

    return (
        <motion.button
            type={type}
            className={baseClasses}
            onClick={onClick}
            disabled={disabled || loading}
            whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
            whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
            transition={{ duration: 0.2 }}
            {...props}
        >
            {loading ? (
                <>
                    <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {Icon && <Icon className="w-5 h-5" />}
                    {children}
                </>
            )}
        </motion.button>
    );
};

SecondaryButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    fullWidth: PropTypes.bool,
    icon: PropTypes.elementType,
    className: PropTypes.string,
};

export default SecondaryButton;

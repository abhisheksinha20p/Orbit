import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * GlassCard Component
 * A reusable glass card with glassmorphism effect, backdrop blur, and hover animations
 */
const GlassCard = ({
    children,
    className = '',
    gradient = false,
    hover = true,
    padding = 'md',
    onClick,
    ...props
}) => {
    const paddingClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        none: 'p-0'
    };

    const baseClasses = `
    bg-white/10 backdrop-blur-xl 
    border border-white/20 
    rounded-2xl 
    shadow-glass
    transition-all duration-300
    ${gradient ? 'relative overflow-hidden' : ''}
    ${hover ? 'hover:shadow-glass-lg hover:scale-[1.02] hover:bg-white/15' : ''}
    ${paddingClasses[padding]}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

    return (
        <motion.div
            className={baseClasses}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={onClick}
            {...props}
        >
            {gradient && (
                <>
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-radial-blue opacity-50 pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-radial-purple opacity-50 pointer-events-none" />
                </>
            )}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

GlassCard.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    gradient: PropTypes.bool,
    hover: PropTypes.bool,
    padding: PropTypes.oneOf(['sm', 'md', 'lg', 'none']),
    onClick: PropTypes.func,
};

export default GlassCard;

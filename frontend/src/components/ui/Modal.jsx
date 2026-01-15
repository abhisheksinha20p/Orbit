import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';
import { modalOverlay, modalContent } from '../../utils/animations';

/**
 * Modal Component
 * Floating glass modal with backdrop blur and smooth animations
 */
const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnOutsideClick = true,
    className = ''
}) => {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4'
    };

    // Handle ESC key press
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = (e) => {
        if (closeOnOutsideClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        variants={modalOverlay}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={handleBackdropClick}
                    />

                    {/* Modal Content */}
                    <motion.div
                        className={`
              relative w-full ${sizeClasses[size]}
              bg-white/10 backdrop-blur-xl
              border border-white/20
              rounded-2xl
              shadow-glass-xl
              overflow-hidden
              ${className}
            `}
                        variants={modalContent}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Gradient Orbs */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-radial-blue opacity-30 pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-radial-purple opacity-30 pointer-events-none" />

                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10">
                                {title && (
                                    <h2 className="text-2xl font-bold text-white">
                                        {title}
                                    </h2>
                                )}
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="ml-auto p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                                        aria-label="Close modal"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Body */}
                        <div className="relative z-10 p-6">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
    showCloseButton: PropTypes.bool,
    closeOnOutsideClick: PropTypes.bool,
    className: PropTypes.string,
};

export default Modal;

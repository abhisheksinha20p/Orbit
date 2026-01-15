import React from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * Toast Component
 * Notification toast system with glassmorphism styling
 */
const Toast = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                // Default options
                duration: 4000,
                style: {
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#fff',
                    padding: '16px',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                },
                // Success
                success: {
                    duration: 3000,
                    iconTheme: {
                        primary: '#3b82f6',
                        secondary: '#fff',
                    },
                    style: {
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                    },
                },
                // Error
                error: {
                    duration: 5000,
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                    },
                    style: {
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                    },
                },
                // Loading
                loading: {
                    iconTheme: {
                        primary: '#8b5cf6',
                        secondary: '#fff',
                    },
                },
            }}
        />
    );
};

export default Toast;

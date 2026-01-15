/**
 * Framer Motion Animation Variants
 * Reusable animation configurations for consistent motion design
 */

// Fade in animation
export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.4, ease: 'easeOut' }
    }
};

// Fade in with upward slide
export const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
};

// Fade in with downward slide
export const fadeInDown = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
};

// Slide in from left
export const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: 'easeOut' }
    }
};

// Slide in from right
export const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: 'easeOut' }
    }
};

// Scale in animation
export const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.3, ease: 'easeOut' }
    }
};

// Stagger container for children animations
export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

// Stagger item (use with staggerContainer)
export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' }
    }
};

// Modal/Overlay animations
export const modalOverlay = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.2 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

export const modalContent = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: { duration: 0.2 }
    }
};

// Drawer/Sidebar animations
export const drawerSlide = {
    hidden: { x: '-100%' },
    visible: {
        x: 0,
        transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: {
        x: '-100%',
        transition: { duration: 0.3, ease: 'easeIn' }
    }
};

// Hover animations (use with whileHover)
export const hoverScale = {
    scale: 1.02,
    transition: { duration: 0.2 }
};

export const hoverLift = {
    y: -4,
    transition: { duration: 0.2 }
};

export const hoverGlow = {
    boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)',
    transition: { duration: 0.3 }
};

// Tap animations (use with whileTap)
export const tapScale = {
    scale: 0.95,
    transition: { duration: 0.1 }
};

// Page transition animations
export const pageTransition = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: 'easeOut' }
    },
    exit: {
        opacity: 0,
        x: 20,
        transition: { duration: 0.3, ease: 'easeIn' }
    }
};

// Loading spinner animation
export const spinnerRotate = {
    rotate: 360,
    transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
    }
};

// Pulse animation
export const pulse = {
    scale: [1, 1.05, 1],
    transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
    }
};

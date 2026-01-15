import { motion } from 'framer-motion';

const OrbitLogo = ({ size = 80, animated = true }) => {
  const LogoContent = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer orbit ring */}
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="url(#orbitGradient)"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      
      {/* Middle orbit ring */}
      <circle
        cx="50"
        cy="50"
        r="28"
        stroke="url(#orbitGradient)"
        strokeWidth="2"
        fill="none"
        opacity="0.8"
      />
      
      {/* Center core */}
      <circle
        cx="50"
        cy="50"
        r="12"
        fill="url(#orbitGradient)"
        filter="url(#glow)"
      />
      
      {/* Orbiting dots */}
      <circle cx="50" cy="10" r="4" fill="#06b6d4" filter="url(#glow)" />
      <circle cx="78" cy="50" r="3" fill="#a855f7" filter="url(#glow)" />
      <circle cx="50" cy="78" r="3" fill="#14b8a6" filter="url(#glow)" />
    </svg>
  );

  if (!animated) return LogoContent;

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {LogoContent}
    </motion.div>
  );
};

export default OrbitLogo;

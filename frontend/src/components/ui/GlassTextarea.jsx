import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * GlassTextarea Component
 * Multi-line text input with glassmorphism styling
 */
const GlassTextarea = forwardRef(({
    label,
    placeholder,
    value,
    onChange,
    error,
    disabled = false,
    required = false,
    rows = 4,
    maxLength,
    className = '',
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.length > 0;
    const charCount = value ? value.length : 0;

    return (
        <div className={`relative ${className}`}>
            {label && (
                <motion.label
                    className={`
            absolute left-4 transition-all duration-200 pointer-events-none z-10
            ${isFocused || hasValue
                            ? 'top-2 text-xs text-orbit-blue'
                            : 'top-4 text-sm text-gray-400'
                        }
          `}
                    initial={false}
                    animate={{
                        top: isFocused || hasValue ? '0.5rem' : '1rem',
                        fontSize: isFocused || hasValue ? '0.75rem' : '0.875rem',
                    }}
                >
                    {label} {required && <span className="text-red-400">*</span>}
                </motion.label>
            )}

            <textarea
                ref={ref}
                value={value}
                onChange={onChange}
                placeholder={!label ? placeholder : ''}
                disabled={disabled}
                rows={rows}
                maxLength={maxLength}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
          w-full
          bg-white/20 backdrop-blur-md
          border border-white/30
          rounded-xl
          px-4
          text-gray-900 placeholder-gray-500
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-orbit-blue/50 focus:border-orbit-blue/50
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-none
          ${label ? 'pt-6 pb-2' : 'py-3'}
          ${error ? 'border-red-400 focus:ring-red-400/50 focus:border-red-400/50' : ''}
        `}
                {...props}
            />

            {maxLength && (
                <div className="absolute bottom-2 right-4 text-xs text-gray-400">
                    {charCount}/{maxLength}
                </div>
            )}

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-400"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
});

GlassTextarea.displayName = 'GlassTextarea';

GlassTextarea.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    rows: PropTypes.number,
    maxLength: PropTypes.number,
    className: PropTypes.string,
};

export default GlassTextarea;

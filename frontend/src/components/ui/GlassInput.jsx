import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * GlassInput Component
 * Form input with glassmorphism styling, label animation, and icon support
 */
const GlassInput = forwardRef(({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    disabled = false,
    required = false,
    icon: Icon,
    suffixIcon: SuffixIcon,
    className = '',
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const hasValue = value && value.length > 0;

    return (
        <div className={`relative ${className}`}>
            {label && (
                <motion.label
                    className={`
            absolute left-4 transition-all duration-200 pointer-events-none
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

            <div className="relative">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon className="w-5 h-5" />
                    </div>
                )}

                <input
                    ref={ref}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={!label ? placeholder : ''}
                    disabled={disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
            w-full
            bg-white/20 backdrop-blur-md
            border border-white/30
            rounded-xl
            text-gray-900 placeholder-gray-500
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-orbit-blue/50 focus:border-orbit-blue/50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${label ? 'pt-6 pb-2' : 'py-3'}
            ${Icon ? 'pl-12' : 'pl-4'}
            ${isPassword || SuffixIcon ? 'pr-12' : 'pr-4'}
            ${error ? 'border-red-400 focus:ring-red-400/50 focus:border-red-400/50' : ''}
          `}
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}

                {SuffixIcon && !isPassword && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <SuffixIcon className="w-5 h-5" />
                    </div>
                )}
            </div>

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

GlassInput.displayName = 'GlassInput';

GlassInput.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    icon: PropTypes.elementType,
    suffixIcon: PropTypes.elementType,
    className: PropTypes.string,
};

export default GlassInput;

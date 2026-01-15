import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * GlassSelect Component
 * Dropdown select with glassmorphism styling
 */
const GlassSelect = forwardRef(({
    label,
    value,
    onChange,
    options = [],
    error,
    disabled = false,
    required = false,
    placeholder = 'Select an option',
    className = '',
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== '' && value !== null && value !== undefined;

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

            <div className="relative">
                <select
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
            w-full
            bg-white/20 backdrop-blur-md
            border border-white/30
            rounded-xl
            px-4 pr-10
            text-gray-900
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-orbit-blue/50 focus:border-orbit-blue/50
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none
            cursor-pointer
            ${label ? 'pt-6 pb-2' : 'py-3'}
            ${error ? 'border-red-400 focus:ring-red-400/50 focus:border-red-400/50' : ''}
            ${!hasValue ? 'text-gray-500' : ''}
          `}
                    {...props}
                >
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-slate-800 text-white"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDown className="w-5 h-5" />
                </div>
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

GlassSelect.displayName = 'GlassSelect';

GlassSelect.propTypes = {
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    error: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    className: PropTypes.string,
};

export default GlassSelect;

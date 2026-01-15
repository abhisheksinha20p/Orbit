/**
 * Form Validation Utilities
 * Helper functions for validating form inputs
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const validateEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Get email validation error message
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null if valid
 */
export const getEmailError = (email) => {
    if (!email) return 'Email is required';
    if (!validateEmail(email)) return 'Please enter a valid email address';
    return null;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and strength
 */
export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, strength: 'none', message: 'Password is required' };
    }

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return {
            isValid: false,
            strength: 'weak',
            message: `Password must be at least ${minLength} characters`
        };
    }

    let strength = 'weak';
    let strengthScore = 0;

    if (password.length >= minLength) strengthScore++;
    if (hasUpperCase) strengthScore++;
    if (hasLowerCase) strengthScore++;
    if (hasNumber) strengthScore++;
    if (hasSpecialChar) strengthScore++;

    if (strengthScore >= 4) strength = 'strong';
    else if (strengthScore >= 3) strength = 'medium';

    const isValid = strengthScore >= 3;

    return {
        isValid,
        strength,
        message: isValid ? null : 'Password should contain uppercase, lowercase, and numbers',
        details: {
            hasMinLength: password.length >= minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecialChar
        }
    };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value, fieldName = 'This field') => {
    if (value === null || value === undefined || value === '') {
        return `${fieldName} is required`;
    }
    if (typeof value === 'string' && value.trim() === '') {
        return `${fieldName} is required`;
    }
    return null;
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
    if (!value) return null;
    if (value.length < minLength) {
        return `${fieldName} must be at least ${minLength} characters`;
    }
    return null;
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
    if (!value) return null;
    if (value.length > maxLength) {
        return `${fieldName} must be no more than ${maxLength} characters`;
    }
    return null;
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const validateUrl = (url) => {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Get URL validation error message
 * @param {string} url - URL to validate
 * @returns {string|null} Error message or null if valid
 */
export const getUrlError = (url) => {
    if (!url) return 'URL is required';
    if (!validateUrl(url)) return 'Please enter a valid URL';
    return null;
};

/**
 * Validate phone number (US format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
export const validatePhone = (phone) => {
    if (!phone) return false;
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate number range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateRange = (value, min, max, fieldName = 'Value') => {
    if (value === null || value === undefined) return `${fieldName} is required`;
    const num = Number(value);
    if (isNaN(num)) return `${fieldName} must be a number`;
    if (num < min || num > max) {
        return `${fieldName} must be between ${min} and ${max}`;
    }
    return null;
};

/**
 * Validate that two values match (e.g., password confirmation)
 * @param {any} value1 - First value
 * @param {any} value2 - Second value
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateMatch = (value1, value2, fieldName = 'Values') => {
    if (value1 !== value2) {
        return `${fieldName} do not match`;
    }
    return null;
};

/**
 * Validate date is in the future
 * @param {Date|string} date - Date to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateFutureDate = (date, fieldName = 'Date') => {
    if (!date) return `${fieldName} is required`;
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        return `${fieldName} must be in the future`;
    }
    return null;
};

/**
 * Validate date is in the past
 * @param {Date|string} date - Date to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validatePastDate = (date, fieldName = 'Date') => {
    if (!date) return `${fieldName} is required`;
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (selectedDate > today) {
        return `${fieldName} must be in the past`;
    }
    return null;
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum size in megabytes
 * @returns {string|null} Error message or null if valid
 */
export const validateFileSize = (file, maxSizeMB) => {
    if (!file) return 'File is required';
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return `File size must be less than ${maxSizeMB}MB`;
    }
    return null;
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Array of allowed MIME types
 * @returns {string|null} Error message or null if valid
 */
export const validateFileType = (file, allowedTypes) => {
    if (!file) return 'File is required';
    if (!allowedTypes.includes(file.type)) {
        return `File type must be one of: ${allowedTypes.join(', ')}`;
    }
    return null;
};

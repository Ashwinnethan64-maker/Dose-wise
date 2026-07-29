import { motion } from 'framer-motion';

/**
 * IconButton — Circular icon-only action button.
 */
export default function IconButton({ icon, onClick, label, variant = 'default', size = 'md', disabled = false, className = '', ...props }) {
    const variants = {
        default: 'themed-text-muted hover:text-primary-600 hover:bg-primary-50/60',
        danger: 'themed-text-muted hover:text-medical-danger hover:bg-red-50/60',
        active: 'text-primary-600 bg-primary-50 hover:bg-primary-100',
        ghost: 'themed-text-muted hover:themed-text hover:bg-gray-100/60',
    };

    const sizes = {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-2.5',
    };

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={disabled ? undefined : { scale: 1.08 }}
            whileTap={disabled ? undefined : { scale: 0.92 }}
            aria-label={label}
            title={label}
            className={`
        inline-flex items-center justify-center rounded-xl
        transition-all duration-200
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
            {...props}
        >
            {icon}
        </motion.button>
    );
}

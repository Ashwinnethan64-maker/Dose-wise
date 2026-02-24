import { motion } from 'framer-motion';

/**
 * IconButton — Circular icon-only action button.
 */
export default function IconButton({ icon, onClick, label, variant = 'default', size = 'md', className = '' }) {
    const variants = {
        default: 'text-medical-muted hover:text-primary-600 hover:bg-primary-50',
        danger: 'text-medical-muted hover:text-medical-danger hover:bg-red-50',
        active: 'text-primary-600 bg-primary-50 hover:bg-primary-100',
        ghost: 'text-medical-muted hover:text-medical-text hover:bg-gray-100',
    };

    const sizes = {
        sm: 'p-2',
        md: 'p-2.5',
        lg: 'p-3',
    };

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={label}
            title={label}
            className={`
        inline-flex items-center justify-center rounded-xl
        transition-colors duration-200
        ${variants[variant]} ${sizes[size]} ${className}
      `}
        >
            {icon}
        </motion.button>
    );
}

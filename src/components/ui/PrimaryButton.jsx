import { motion } from 'framer-motion';

/**
 * PrimaryButton — Teal gradient button with hover lift + press effect.
 */
export default function PrimaryButton({ children, onClick, type = 'button', disabled, className = '', icon, size = 'md' }) {
    const sizes = {
        sm: 'text-sm py-2.5 px-4',
        md: 'text-elder-sm py-3.5 px-6',
        lg: 'text-elder-base py-4 px-8',
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ y: 0, scale: 0.97 }}
            className={`
        inline-flex items-center justify-center gap-2
        bg-gradient-to-r from-primary-500 to-primary-600
        text-white font-bold rounded-2xl
        shadow-btn hover:shadow-btn-hover
        transition-shadow duration-300
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${sizes[size]} ${className}
      `}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
        </motion.button>
    );
}

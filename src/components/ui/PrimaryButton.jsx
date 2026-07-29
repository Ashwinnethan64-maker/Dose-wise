import { motion } from 'framer-motion';

/**
 * PrimaryButton — Teal gradient button with hover lift + press effect.
 */
export default function PrimaryButton({ children, onClick, type = 'button', disabled, loading = false, className = '', icon, size = 'md', ...props }) {
    const sizes = {
        sm: 'text-sm py-2 px-4 rounded-xl',
        md: 'text-sm font-semibold py-2.5 px-5 rounded-xl',
        lg: 'text-base font-bold py-3 px-6 rounded-2xl',
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            whileHover={disabled || loading ? undefined : { y: -1, scale: 1.01 }}
            whileTap={disabled || loading ? undefined : { y: 0, scale: 0.98 }}
            className={`
        inline-flex items-center justify-center gap-2
        bg-gradient-to-r from-primary-500 to-primary-600
        text-white font-bold
        shadow-btn hover:shadow-btn-hover
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        ${sizes[size]} ${className}
      `}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : icon ? (
                <span className="shrink-0">{icon}</span>
            ) : null}
            {children}
        </motion.button>
    );
}

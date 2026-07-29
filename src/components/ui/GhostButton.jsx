import { motion } from 'framer-motion';

/**
 * GhostButton — Transparent button with border, hover fill.
 */
export default function GhostButton({ children, onClick, type = 'button', disabled = false, className = '', icon, variant = 'teal', ...props }) {
    const variants = {
        teal: 'border-primary-200 text-primary-600 hover:bg-primary-50/60 hover:border-primary-300',
        danger: 'border-red-200 text-medical-danger hover:bg-red-50/60 hover:border-red-300',
        muted: 'border-gray-200 text-medical-muted hover:bg-gray-50/60 hover:border-gray-300',
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={disabled ? undefined : { y: -1, scale: 1.01 }}
            whileTap={disabled ? undefined : { scale: 0.98 }}
            className={`
        inline-flex items-center justify-center gap-2
        bg-transparent border font-semibold rounded-xl
        text-sm py-2 px-4 transition-all duration-200
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]} ${className}
      `}
            {...props}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
        </motion.button>
    );
}

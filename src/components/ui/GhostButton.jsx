import { motion } from 'framer-motion';

/**
 * GhostButton — Transparent button with border, hover fill.
 */
export default function GhostButton({ children, onClick, type = 'button', className = '', icon, variant = 'teal' }) {
    const variants = {
        teal: 'border-primary-200 text-primary-600 hover:bg-primary-50 hover:border-primary-300',
        danger: 'border-red-200 text-medical-danger hover:bg-red-50 hover:border-red-300',
        muted: 'border-gray-200 text-medical-muted hover:bg-gray-50 hover:border-gray-300',
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`
        inline-flex items-center justify-center gap-2
        bg-transparent border-2 font-semibold rounded-2xl
        text-sm py-2.5 px-5 transition-colors duration-200
        ${variants[variant]} ${className}
      `}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
        </motion.button>
    );
}

import { motion } from 'framer-motion';

/**
 * GlassCard — Glass morphism card using CSS variables for theme awareness.
 */
export default function GlassCard({ children, className = '', hover = false, glow = false, onClick, padding = 'p-5' }) {
    return (
        <motion.div
            onClick={onClick}
            whileHover={hover ? { y: -3, scale: 1.01 } : undefined}
            className={`
        rounded-2xl border
        transition-all duration-300
        ${hover ? 'cursor-pointer' : ''}
        ${glow ? 'hover-glow' : ''}
        ${padding} ${className}
      `}
            style={{
                background: 'var(--color-surface)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                borderColor: 'var(--color-border)',
                boxShadow: `0 8px 32px var(--color-card-shadow), inset 0 1px 0 var(--color-inset)`,
            }}
        >
            {children}
        </motion.div>
    );
}

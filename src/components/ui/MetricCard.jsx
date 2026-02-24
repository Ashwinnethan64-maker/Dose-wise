import { motion } from 'framer-motion';

/**
 * MetricCard — Dashboard stat card, theme-aware via CSS vars.
 */
export default function MetricCard({ icon, value, label, color = 'teal', onClick, className = '' }) {
    const colors = {
        teal: { bg: 'bg-primary-50', text: 'text-primary-600', glow: 'rgba(13,158,158,0.12)' },
        red: { bg: 'bg-red-50', text: 'text-medical-danger', glow: 'rgba(231,76,60,0.12)' },
        green: { bg: 'bg-green-50', text: 'text-medical-safe', glow: 'rgba(39,174,96,0.12)' },
        amber: { bg: 'bg-amber-50', text: 'text-medical-warn', glow: 'rgba(243,156,18,0.12)' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', glow: 'rgba(59,130,246,0.12)' },
    };
    const c = colors[color] || colors.teal;

    return (
        <motion.div
            onClick={onClick}
            whileHover={{ y: -3, scale: 1.02 }}
            className={`
        rounded-2xl border p-6
        transition-all duration-300 cursor-pointer ${className}
      `}
            style={{
                background: 'var(--color-surface)',
                backdropFilter: 'blur(16px) saturate(180%)',
                borderColor: 'var(--color-border)',
                boxShadow: `0 8px 32px ${c.glow}, inset 0 1px 0 var(--color-inset)`,
            }}
        >
            <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                <span className={c.text}>{icon}</span>
            </div>
            <motion.p
                className="text-3xl font-bold themed-text"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                {value}
            </motion.p>
            <p className="text-sm themed-text-muted font-medium mt-1">{label}</p>
        </motion.div>
    );
}

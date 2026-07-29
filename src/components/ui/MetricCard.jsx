import { motion } from 'framer-motion';

/**
 * MetricCard — Dashboard stat card, theme-aware via CSS vars.
 */
export default function MetricCard({ icon, value, label, color = 'teal', onClick, className = '' }) {
    const colors = {
        teal: { bg: 'bg-teal-100/80 dark:bg-teal-900/60 border border-teal-300/60 dark:border-teal-500/50', text: 'text-teal-700 dark:text-teal-200', glow: 'rgba(13,158,158,0.15)' },
        red: { bg: 'bg-rose-100/90 dark:bg-rose-950/70 border border-rose-300/70 dark:border-rose-500/50', text: 'text-rose-600 dark:text-rose-300', glow: 'rgba(231,76,60,0.15)' },
        green: { bg: 'bg-emerald-100/80 dark:bg-emerald-900/60 border border-emerald-300/60 dark:border-emerald-500/50', text: 'text-emerald-700 dark:text-emerald-200', glow: 'rgba(39,174,96,0.15)' },
        amber: { bg: 'bg-amber-100/80 dark:bg-amber-900/60 border border-amber-300/60 dark:border-amber-500/50', text: 'text-amber-700 dark:text-amber-200', glow: 'rgba(243,156,18,0.15)' },
        blue: { bg: 'bg-sky-100/80 dark:bg-sky-900/60 border border-sky-300/60 dark:border-sky-500/50', text: 'text-sky-700 dark:text-sky-200', glow: 'rgba(59,130,246,0.15)' },
    };
    const c = colors[color] || colors.teal;

    return (
        <motion.div
            onClick={onClick}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`
        rounded-2xl border p-5
        transition-all duration-250 cursor-pointer select-none ${className}
      `}
            style={{
                background: 'var(--color-surface)',
                backdropFilter: 'blur(16px) saturate(180%)',
                borderColor: 'var(--color-border)',
                boxShadow: `0 4px 20px ${c.glow}, inset 0 1px 0 var(--color-inset)`,
                willChange: 'transform',
            }}
        >
            <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3 shrink-0 shadow-sm [&>svg]:w-5 [&>svg]:h-5`}>
                <span className={c.text}>{icon}</span>
            </div>
            <motion.p
                className="text-2xl font-bold themed-text"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.35 }}
            >
                {value}
            </motion.p>
            <p className="text-xs themed-text-muted font-semibold mt-1 uppercase tracking-wider">{label}</p>
        </motion.div>
    );
}

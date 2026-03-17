import { motion } from 'framer-motion';
import { Pencil, Trash2, Clock, Repeat } from 'lucide-react';
import IconButton from './ui/IconButton';

const PILL_GLOW = {
    white: { bg: 'bg-gray-100', border: 'border-gray-300', glow: 'rgba(156,163,175,0.3)' },
    blue: { bg: 'bg-blue-100', border: 'border-blue-300', glow: 'rgba(59,130,246,0.3)' },
    red: { bg: 'bg-red-100', border: 'border-red-300', glow: 'rgba(239,68,68,0.3)' },
    yellow: { bg: 'bg-yellow-100', border: 'border-yellow-300', glow: 'rgba(250,204,21,0.3)' },
    green: { bg: 'bg-green-100', border: 'border-green-300', glow: 'rgba(34,197,94,0.3)' },
    orange: { bg: 'bg-orange-100', border: 'border-orange-300', glow: 'rgba(249,115,22,0.3)' },
    pink: { bg: 'bg-pink-100', border: 'border-pink-300', glow: 'rgba(236,72,153,0.3)' },
    purple: { bg: 'bg-purple-100', border: 'border-purple-300', glow: 'rgba(168,85,247,0.3)' },
};

export default function MedicationCard({ med, onEdit, onDelete, interactions = [] }) {
    const pill = PILL_GLOW[med.color?.toLowerCase()] || PILL_GLOW.white;
    const hasCritical = interactions.some((i) => i.severity === 'critical');

    return (
        <motion.div
            whileHover={{ y: -3, scale: 1.01 }}
            className={`rounded-2xl border p-5 transition-all duration-300 ${hasCritical ? 'border-red-200/80' : ''}`}
            style={{
                background: 'var(--color-surface)',
                backdropFilter: 'blur(12px)',
                borderColor: hasCritical ? undefined : 'var(--color-border)',
                boxShadow: '0 8px 32px var(--color-card-shadow), inset 0 1px 0 var(--color-inset)',
            }}
        >
            <div className="flex items-start gap-4">
                <div
                    className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl shrink-0 ${pill.bg} ${pill.border}`}
                    style={{ boxShadow: `0 0 16px ${pill.glow}` }}
                >
                    💊
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-elder-base font-bold themed-text truncate">{med.name}</h3>
                    <p className="text-sm themed-text-muted mt-0.5">{med.dosage}</p>
                    <div className="flex flex-wrap gap-2 mt-2.5">
                        {med.schedule && (
                            <span className="flex items-center gap-1 text-xs bg-primary-50/80 text-primary-700 px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
                                <Clock size={11} /> {med.schedule}
                            </span>
                        )}
                        {med.frequency && (
                            <span className="flex items-center gap-1 text-xs bg-blue-50/80 text-blue-700 px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
                                <Repeat size={11} /> {med.frequency}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex gap-1 shrink-0">
                    <IconButton icon={<Pencil size={17} />} onClick={() => onEdit?.(med)} label="Edit" variant="default" />
                    <IconButton icon={<Trash2 size={17} />} onClick={() => onDelete?.(med.id)} label="Delete" variant="danger" />
                </div>
            </div>

            {interactions.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 space-y-1.5">
                    {interactions.map((inter, i) => (
                        <div key={i} className={`text-xs px-3 py-1.5 rounded-xl font-medium border ${inter.severity === 'critical' ? 'bg-red-50/80 text-red-700 border-red-200' : 'bg-amber-50/80 text-amber-700 border-amber-200'
                            }`}>
                            {inter.severity === 'critical' ? '🚨' : '⚠️'} {inter.drug}: {inter.message}
                        </div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}

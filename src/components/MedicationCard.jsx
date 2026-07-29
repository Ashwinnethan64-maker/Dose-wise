import { motion } from 'framer-motion';
import { Pencil, Trash2, Clock, Repeat } from 'lucide-react';
import IconButton from './ui/IconButton';
import { useLanguage } from '../context/LanguageContext';

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
    const { t } = useLanguage();
    const pill = PILL_GLOW[med.color?.toLowerCase()] || PILL_GLOW.white;
    const hasCritical = interactions.some((i) => i.severity === 'critical');

    return (
        <motion.div
            whileHover={{ y: -2, scale: 1.005 }}
            className={`rounded-2xl border p-3.5 sm:p-5 transition-all duration-250 ${hasCritical ? 'border-red-200/80' : ''}`}
            style={{
                background: 'var(--color-surface)',
                backdropFilter: 'blur(12px)',
                borderColor: hasCritical ? undefined : 'var(--color-border)',
                boxShadow: '0 4px 24px var(--color-card-shadow), inset 0 1px 0 var(--color-inset)',
                willChange: 'transform',
            }}
        >
            <div className="flex items-start gap-3 sm:gap-4">
                {med.image && (med.fileType?.startsWith('image/') || med.image.startsWith('data:image/')) ? (
                    <img
                        src={med.image}
                        alt={med.name}
                        className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0 border border-primary-200/50 shadow-sm"
                    />
                ) : (
                    <div
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl border-2 flex items-center justify-center text-lg sm:text-xl shrink-0 ${pill.bg} ${pill.border}`}
                        style={{ boxShadow: `0 0 12px ${pill.glow}` }}
                    >
                        💊
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold themed-text truncate">{med.name}</h3>
                    <p className="text-xs sm:text-sm themed-text-muted mt-0.5 opacity-75 truncate">{med.dosage}</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                        {med.schedule && (
                            <span className="flex items-center gap-1 text-[11px] sm:text-xs bg-primary-50/80 text-primary-700 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium backdrop-blur-sm">
                                <Clock size={11} className="shrink-0" /> {t(med.schedule)}
                            </span>
                        )}
                        {med.frequency && (
                            <span className="flex items-center gap-1 text-[11px] sm:text-xs bg-blue-50/80 text-blue-700 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium backdrop-blur-sm">
                                <Repeat size={11} className="shrink-0" /> {t(med.frequency)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <IconButton icon={<Pencil size={16} />} onClick={() => onEdit?.(med)} label={t('editMedication')} variant="default" className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center" />
                    <IconButton icon={<Trash2 size={16} />} onClick={() => onDelete?.(med.id)} label={t('deleteMedication')} variant="danger" className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center" />
                </div>
            </div>

            {interactions.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3.5 space-y-2">
                    {interactions.map((inter, i) => (
                        <div key={i} className={`text-xs px-3.5 py-2 rounded-xl font-medium border ${inter.severity === 'critical' ? 'bg-red-50/80 text-red-700 border-red-200' : 'bg-amber-50/80 text-amber-700 border-amber-200'
                            }`}>
                            {inter.severity === 'critical' ? '🚨' : '⚠️'} {inter.drug}: {inter.message}
                        </div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}

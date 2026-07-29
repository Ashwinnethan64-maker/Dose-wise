import { motion, AnimatePresence } from 'framer-motion';
import { Check, SkipForward, Calendar, Clock, Bell } from 'lucide-react';
import useMedications from '../hooks/useMedications';
import useAdherence from '../hooks/useAdherence';
import useReminders from '../hooks/useReminders';
import { useToast } from '../components/ui/Toast';
import AnimatedPage, { StaggerContainer, StaggerItem } from '../components/ui/AnimatedPage';
import GlassCard from '../components/ui/GlassCard';
import SectionHeader from '../components/ui/SectionHeader';
import StatusBadge from '../components/ui/StatusBadge';
import { useLanguage } from '../context/LanguageContext';

export default function Adherence() {
    const { t } = useLanguage();
    const { medications } = useMedications();
    const { logDose, getStatusToday, weeklyData, adherencePercentage } = useAdherence();
    const { snooze } = useReminders(medications);
    const { addToast } = useToast();

    const todayMeds = medications.map((med) => ({
        ...med,
        status: getStatusToday(med.id),
    }));

    const handleTaken = (med) => { logDose(med.id, 'taken'); addToast(`${med.name} ${t('statusTaken')} ✅`, 'success'); };
    const handleSkipped = (med) => { logDose(med.id, 'skipped'); addToast(`${med.name} ${t('statusSkipped')}`, 'warning'); };
    const handleSnooze = (med) => { snooze(med.name); addToast(`${med.name} ${t('snoozedNotice')}`, 'info'); };

    return (
        <AnimatedPage className="space-y-6 sm:space-y-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold themed-text">{t('dailyAdherenceTitle')}</h1>
                <p className="text-sm sm:text-base themed-text-muted mt-1 font-medium">{t('dailyAdherenceSub')}</p>
            </div>

            <div>
                <SectionHeader title={t('todaysChecklist')} icon={<Clock size={22} />} className="mb-4" />

                {todayMeds.length === 0 ? (
                    <GlassCard className="text-center py-10 sm:py-12 px-6">
                        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-4">
                                <Clock size={28} className="text-primary-400" />
                            </div>
                        </motion.div>
                        <p className="text-sm sm:text-base themed-text-muted">{t('noMedsToTrack')}</p>
                    </GlassCard>
                ) : (
                    <StaggerContainer className="space-y-3 sm:space-y-4">
                        {todayMeds.map((med) => (
                            <StaggerItem key={med.id}>
                                <GlassCard padding="p-4 sm:p-6" className={`transition-all duration-300 ${med.status === 'taken' ? '!border-green-200/80' :
                                        med.status === 'skipped' ? '!border-orange-200/80' : ''
                                    }`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
                                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0 transition-all ${med.status === 'taken' ? 'bg-green-100' :
                                                    med.status === 'skipped' ? 'bg-orange-100' :
                                                        'bg-gradient-to-br from-primary-50 to-primary-100'
                                                }`}>💊</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-base sm:text-lg font-bold themed-text truncate">{med.name}</p>
                                                <p className="text-xs sm:text-sm themed-text-muted mt-0.5 truncate">
                                                    {med.dosage}{med.schedule ? ` · ${t(med.schedule)}` : ''}{med.frequency ? ` · ${t(med.frequency)}` : ''}
                                                </p>
                                            </div>
                                        </div>

                                        <AnimatePresence mode="wait">
                                            {!med.status ? (
                                                <motion.div key="actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 pt-1 sm:pt-0">
                                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={() => handleTaken(med)}
                                                        className="h-11 sm:h-10 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 shrink-0 min-w-[44px]">
                                                        <Check size={16} /> {t('takenBtn')}
                                                    </motion.button>
                                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={() => handleSkipped(med)}
                                                        className="h-11 sm:h-10 px-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 shrink-0 min-w-[44px]">
                                                        <SkipForward size={16} /> {t('skippedBtn')}
                                                    </motion.button>
                                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={() => handleSnooze(med)}
                                                        className="h-11 sm:h-10 px-3.5 bg-primary-50 hover:bg-primary-100 text-primary-600 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shrink-0 min-w-[44px]" title="Snooze 15 min">
                                                        <Bell size={15} /> {t('snoozeBtn')}
                                                    </motion.button>
                                                </motion.div>
                                            ) : (
                                                <motion.div key="status" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 shrink-0">
                                                    <StatusBadge status={med.status} />
                                                    <span className="text-xs themed-text-muted">
                                                        · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </GlassCard>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                )}
            </div>

            {/* Weekly Calendar View */}
            <div>
                <SectionHeader title={t('weeklyCalendar')} icon={<Calendar size={22} />} className="mb-4" />
                <GlassCard padding="p-4 sm:p-6" className="overflow-x-auto">
                    <div className="grid grid-cols-7 gap-1.5 sm:gap-4 min-w-[280px]">
                        {weeklyData.map((day) => {
                            const total = day.taken + day.skipped;
                            const pct = total > 0 ? Math.round((day.taken / total) * 100) : -1;
                            const isToday = day.date === new Date().toISOString().split('T')[0];
                            return (
                                <motion.div key={day.date} whileHover={{ scale: 1.05 }} className="text-center flex flex-col items-center">
                                    <p className={`text-[11px] sm:text-xs font-bold mb-1.5 sm:mb-2 ${isToday ? 'text-primary-500' : 'themed-text-muted'}`}>{day.dayName}</p>
                                    <div className={`w-full max-w-[70px] min-h-[48px] sm:min-h-[56px] py-1.5 sm:py-2 px-1 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-200 shadow-sm ${isToday ? 'ring-2 ring-primary-400 ring-offset-1 sm:ring-offset-2' : ''
                                        } ${pct < 0 ? 'bg-gray-50 text-gray-400 border-gray-200' :
                                            pct >= 80 ? 'bg-green-50 text-green-700 border-green-200' :
                                                pct >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        <span className="text-[11px] sm:text-sm font-extrabold leading-tight">{pct < 0 ? '–' : `${pct}%`}</span>
                                        {total > 0 && <span className="text-[9px] sm:text-[10px] opacity-75 font-semibold leading-none mt-0.5">{day.taken}/{total}</span>}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
                        {[
                            { color: 'bg-green-100 text-green-700 border-green-200', label: t('legendHigh') },
                            { color: 'bg-amber-100 text-amber-700 border-amber-200', label: t('legendMid') },
                            { color: 'bg-red-100 text-red-700 border-red-200', label: t('legendLow') },
                            { color: 'bg-gray-100 text-gray-500 border-gray-200', label: t('legendNoData') },
                        ].map(({ color, label }) => (
                            <span key={label} className={`text-xs font-semibold px-3 py-1 rounded-full border ${color}`}>{label}</span>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Overall */}
            <GlassCard glow padding="p-6 sm:p-8" className="text-center">
                <p className="text-xs sm:text-sm themed-text-muted font-semibold uppercase tracking-wider mb-2">{t('overallAdherenceRate')}</p>
                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className={`text-4xl sm:text-5xl font-extrabold ${adherencePercentage >= 80 ? 'text-medical-safe' : adherencePercentage >= 50 ? 'text-medical-warn' : 'text-medical-danger'}`}>
                    {adherencePercentage}%
                </motion.p>
            </GlassCard>
        </AnimatedPage>
    );
}

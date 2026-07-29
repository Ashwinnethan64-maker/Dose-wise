import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, TrendingUp, Calendar, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import useMedications from '../hooks/useMedications';
import useAdherence from '../hooks/useAdherence';
import AdherenceRing from '../components/AdherenceRing';
import AnimatedPage, { StaggerContainer, StaggerItem } from '../components/ui/AnimatedPage';
import GlassCard from '../components/ui/GlassCard';
import SectionHeader from '../components/ui/SectionHeader';
import { useLanguage } from '../context/LanguageContext';

function useAnimatedCounter(target, duration = 800) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.round(start));
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);
    return count;
}

export default function Caregiver() {
    const { t } = useLanguage();
    const { medications } = useMedications();
    const { adherencePercentage, missedToday, weeklyData, logs } = useAdherence();

    const animatedAdherence = useAnimatedCounter(adherencePercentage);
    const animatedMissed = useAnimatedCounter(missedToday.length, 400);
    const animatedMedCount = useAnimatedCounter(medications.length, 400);

    const lastThreeDays = weeklyData.slice(-3);
    const prevThreeDays = weeklyData.slice(-6, -3);
    const recentAvg = lastThreeDays.reduce((acc, d) => acc + (d.total > 0 ? (d.taken / d.total) * 100 : 100), 0) / 3;
    const prevAvg = prevThreeDays.reduce((acc, d) => acc + (d.total > 0 ? (d.taken / d.total) * 100 : 100), 0) / 3;
    const trend = recentAvg - prevAvg;
    const TrendIcon = trend > 2 ? ArrowUp : trend < -2 ? ArrowDown : Minus;
    const trendColor = trend > 2 ? 'text-medical-safe' : trend < -2 ? 'text-medical-danger' : 'themed-text-muted';

    const medBreakdown = medications.map((med) => {
        const medLogs = logs.filter((l) => l.medicationId === med.id);
        const taken = medLogs.filter((l) => l.status === 'taken').length;
        const total = medLogs.length;
        return { ...med, taken, total, percentage: total > 0 ? Math.round((taken / total) * 100) : 100 };
    });

    return (
        <AnimatedPage className="space-y-6 sm:space-y-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold themed-text flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0 shadow-btn">
                        <Users size={20} className="text-white" />
                    </div>
                    {t('caregiverTitle')}
                </h1>
                <p className="text-sm sm:text-base themed-text-muted mt-1 font-medium">{t('caregiverSub')}</p>
            </div>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6">
                <StaggerItem className="h-full">
                    <GlassCard glow padding="p-5 sm:p-7" className="flex flex-col items-center justify-center h-full text-center min-h-[170px] sm:min-h-[200px]">
                        <AdherenceRing percentage={adherencePercentage} size={92} label={t('overall')} />
                        <div className="flex items-center gap-1.5 mt-3">
                            <p className="text-[11px] sm:text-xs themed-text-muted font-semibold uppercase tracking-wider">{t('adherenceRate')}</p>
                            <TrendIcon size={14} className={trendColor} />
                        </div>
                    </GlassCard>
                </StaggerItem>

                <StaggerItem className="h-full">
                    <GlassCard glow padding="p-5 sm:p-7" className={`flex flex-col items-center justify-center h-full text-center min-h-[170px] sm:min-h-[200px] ${missedToday.length > 0 ? '!border-red-200/60' : ''}`}>
                        <div className={`w-10 h-10 rounded-xl mx-auto mb-2.5 flex items-center justify-center ${missedToday.length > 0 ? 'bg-rose-100/90 dark:bg-rose-950/70 border border-rose-300/70 dark:border-rose-500/50' : 'bg-teal-100/80 dark:bg-teal-900/60 border border-teal-300/60 dark:border-teal-500/50'}`}>
                            <AlertTriangle size={20} className={missedToday.length > 0 ? 'text-rose-600 dark:text-rose-300' : 'text-teal-700 dark:text-teal-200'} />
                        </div>
                        <motion.p key={animatedMissed} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl sm:text-3xl font-bold themed-text">
                            {animatedMissed}
                        </motion.p>
                        <p className="text-[11px] sm:text-xs themed-text-muted font-semibold uppercase tracking-wider mt-1">{t('missedToday')}</p>
                        {missedToday.length > 0 && (
                            <div className="mt-2.5 space-y-1">
                                {missedToday.map((m) => {
                                    const med = medications.find((md) => md.id === m.medicationId);
                                    return <span key={m.id} className="block text-xs bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-0.5 font-medium truncate">{med?.name || t('unknownMed')}</span>;
                                })}
                            </div>
                        )}
                    </GlassCard>
                </StaggerItem>

                <StaggerItem className="h-full">
                    <GlassCard glow padding="p-5 sm:p-7" className="flex flex-col items-center justify-center h-full text-center min-h-[170px] sm:min-h-[200px]">
                        <div className="w-10 h-10 rounded-xl bg-teal-100/80 dark:bg-teal-900/60 border border-teal-300/60 dark:border-teal-500/50 mx-auto mb-2.5 flex items-center justify-center shadow-sm">
                            <TrendingUp size={20} className="text-teal-700 dark:text-teal-200" />
                        </div>
                        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl sm:text-3xl font-bold themed-text">{animatedMedCount}</motion.p>
                        <p className="text-[11px] sm:text-xs themed-text-muted font-semibold uppercase tracking-wider mt-1">{t('medsTrackedLabel')}</p>
                    </GlassCard>
                </StaggerItem>
            </StaggerContainer>

            <div>
                <SectionHeader title={t('weeklyReportCard')} icon={<Calendar size={22} />} className="mb-3.5 sm:mb-4" />
                <GlassCard padding="p-4 sm:p-6" className="overflow-x-auto">
                    <div className="grid grid-cols-7 gap-1.5 sm:gap-4 min-w-[280px]">
                        {weeklyData.map((day) => {
                            const total = day.taken + day.skipped;
                            const pct = total > 0 ? Math.round((day.taken / total) * 100) : -1;
                            return (
                                <motion.div key={day.date} whileHover={{ scale: 1.06 }} className="text-center flex flex-col items-center">
                                    <p className="text-[11px] sm:text-xs themed-text-muted font-semibold mb-1.5 sm:mb-2">{day.dayName}</p>
                                    <div className={`w-full max-w-[72px] h-12 sm:h-14 rounded-xl flex flex-col items-center justify-center border text-xs font-bold ${pct < 0 ? 'bg-gray-50 text-gray-400 border-gray-200' :
                                            pct >= 80 ? 'bg-green-50 text-green-700 border-green-200' :
                                                pct >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        <span className="text-xs font-bold">{pct < 0 ? '–' : `${pct}%`}</span>
                                        {total > 0 && <span className="text-[9px] opacity-60 mt-0.5">{day.taken}✓ {day.skipped}✗</span>}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </GlassCard>
            </div>

            <div>
                <SectionHeader title={t('perMedBreakdown')} className="mb-3.5 sm:mb-4" />
                {medBreakdown.length === 0 ? (
                    <GlassCard className="text-center py-8">
                        <p className="themed-text-muted">{t('noMedsTrackedCaregiver')}</p>
                    </GlassCard>
                ) : (
                    <StaggerContainer className="space-y-2.5 sm:space-y-3">
                        {medBreakdown.map((med) => (
                            <StaggerItem key={med.id}>
                                <GlassCard hover padding="p-3.5 sm:p-5" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
                                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0" style={{ background: 'var(--color-badge-bg)' }}>💊</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm sm:text-base font-bold themed-text truncate">{med.name}</p>
                                            <p className="text-xs sm:text-sm themed-text-muted mt-0.5 truncate">{t('takenOfTotal', { taken: med.taken, total: med.total })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                                        <div className="w-24 sm:w-28 h-2.5 rounded-full bg-gray-100 overflow-hidden relative">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${med.percentage}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                                                className={`h-full rounded-full relative ${med.percentage >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                                                        med.percentage >= 50 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                                                            'bg-gradient-to-r from-red-400 to-red-500'
                                                    }`} />
                                        </div>
                                        <span className={`text-xs sm:text-sm font-bold w-10 sm:w-12 text-right ${med.percentage >= 80 ? 'text-medical-safe' :
                                                med.percentage >= 50 ? 'text-medical-warn' : 'text-medical-danger'
                                            }`}>{med.percentage}%</span>
                                    </div>
                                </GlassCard>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                )}
            </div>
        </AnimatedPage>
    );
}

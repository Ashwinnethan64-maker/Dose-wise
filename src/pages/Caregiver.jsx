import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, TrendingUp, Calendar, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import useMedications from '../hooks/useMedications';
import useAdherence from '../hooks/useAdherence';
import AdherenceRing from '../components/AdherenceRing';
import AnimatedPage, { StaggerContainer, StaggerItem } from '../components/ui/AnimatedPage';
import GlassCard from '../components/ui/GlassCard';
import SectionHeader from '../components/ui/SectionHeader';

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
        <AnimatedPage className="space-y-7">
            <div>
                <h1 className="text-elder-2xl font-bold themed-text flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <Users size={20} className="text-white" />
                    </div>
                    Caregiver Dashboard
                </h1>
                <p className="text-sm themed-text-muted mt-1 font-medium">Monitor medication adherence and missed doses</p>
            </div>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StaggerItem>
                    <GlassCard glow className="flex flex-col items-center">
                        <AdherenceRing percentage={adherencePercentage} size={130} label="Overall" />
                        <div className="flex items-center gap-1.5 mt-3">
                            <p className="text-sm themed-text-muted font-medium">Adherence Rate</p>
                            <TrendIcon size={16} className={trendColor} />
                        </div>
                    </GlassCard>
                </StaggerItem>

                <StaggerItem>
                    <GlassCard glow className={`text-center ${missedToday.length > 0 ? '!border-red-200/60' : ''}`}>
                        <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center ${missedToday.length > 0 ? 'bg-red-100' : 'bg-primary-50'}`}>
                            <AlertTriangle size={24} className={missedToday.length > 0 ? 'text-medical-danger' : 'themed-text-muted'} />
                        </div>
                        <motion.p key={animatedMissed} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold themed-text">
                            {animatedMissed}
                        </motion.p>
                        <p className="text-sm themed-text-muted font-medium mt-1">Missed Today</p>
                        {missedToday.length > 0 && (
                            <div className="mt-3 space-y-1">
                                {missedToday.map((m) => {
                                    const med = medications.find((md) => md.id === m.medicationId);
                                    return <span key={m.id} className="block text-xs bg-red-100 text-red-700 rounded-full px-3 py-1 font-medium">{med?.name || 'Unknown'}</span>;
                                })}
                            </div>
                        )}
                    </GlassCard>
                </StaggerItem>

                <StaggerItem>
                    <GlassCard glow className="text-center">
                        <div className="w-14 h-14 rounded-2xl bg-primary-50 mx-auto mb-3 flex items-center justify-center">
                            <TrendingUp size={24} className="text-primary-500" />
                        </div>
                        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold themed-text">{animatedMedCount}</motion.p>
                        <p className="text-sm themed-text-muted font-medium mt-1">Medications Tracked</p>
                    </GlassCard>
                </StaggerItem>
            </StaggerContainer>

            <div>
                <SectionHeader title="Weekly Report Card" icon={<Calendar size={22} />} className="mb-4" />
                <GlassCard>
                    <div className="grid grid-cols-7 gap-3 mb-4">
                        {weeklyData.map((day) => {
                            const total = day.taken + day.skipped;
                            const pct = total > 0 ? Math.round((day.taken / total) * 100) : -1;
                            return (
                                <motion.div key={day.date} whileHover={{ scale: 1.08 }} className="text-center">
                                    <p className="text-xs themed-text-muted font-semibold mb-2">{day.dayName}</p>
                                    <div className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center border text-xs font-bold ${pct < 0 ? 'bg-gray-50 text-gray-400 border-gray-200' :
                                            pct >= 80 ? 'bg-green-50 text-green-700 border-green-200' :
                                                pct >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        <span className="text-sm font-bold">{pct < 0 ? '–' : `${pct}%`}</span>
                                        {total > 0 && <span className="text-[10px] opacity-60 mt-0.5">{day.taken}✓ {day.skipped}✗</span>}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </GlassCard>
            </div>

            <div>
                <SectionHeader title="Per-Medication Breakdown" className="mb-4" />
                {medBreakdown.length === 0 ? (
                    <GlassCard className="text-center py-8">
                        <p className="themed-text-muted">No medications being tracked.</p>
                    </GlassCard>
                ) : (
                    <StaggerContainer className="space-y-3">
                        {medBreakdown.map((med) => (
                            <StaggerItem key={med.id}>
                                <GlassCard hover padding="p-4" className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: 'var(--color-badge-bg)' }}>💊</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold themed-text truncate">{med.name}</p>
                                        <p className="text-xs themed-text-muted">{med.taken} taken / {med.total} total</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="w-24 h-2.5 rounded-full bg-gray-100 overflow-hidden relative">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${med.percentage}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                                                className={`h-full rounded-full relative ${med.percentage >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                                                        med.percentage >= 50 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                                                            'bg-gradient-to-r from-red-400 to-red-500'
                                                    }`} />
                                        </div>
                                        <span className={`text-sm font-bold w-12 text-right ${med.percentage >= 80 ? 'text-medical-safe' :
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

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

export default function Adherence() {
    const { medications } = useMedications();
    const { logDose, getStatusToday, weeklyData, adherencePercentage } = useAdherence();
    const { snooze } = useReminders(medications);
    const { addToast } = useToast();

    const todayMeds = medications.map((med) => ({
        ...med,
        status: getStatusToday(med.id),
    }));

    const handleTaken = (med) => { logDose(med.id, 'taken'); addToast(`${med.name} marked as taken ✅`, 'success'); };
    const handleSkipped = (med) => { logDose(med.id, 'skipped'); addToast(`${med.name} skipped`, 'warning'); };
    const handleSnooze = (med) => { snooze(med.name); addToast(`${med.name} snoozed for 15 minutes`, 'info'); };

    return (
        <AnimatedPage className="space-y-7">
            <div>
                <h1 className="text-elder-2xl font-bold themed-text">Daily Adherence</h1>
                <p className="text-sm themed-text-muted mt-1 font-medium">Track your medication intake for today</p>
            </div>

            <div>
                <SectionHeader title="Today's Checklist" icon={<Clock size={22} />} className="mb-4" />

                {todayMeds.length === 0 ? (
                    <GlassCard className="text-center py-10">
                        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-4">
                                <Clock size={28} className="text-primary-400" />
                            </div>
                        </motion.div>
                        <p className="text-elder-sm themed-text-muted">No medications to track. Add medications first.</p>
                    </GlassCard>
                ) : (
                    <StaggerContainer className="space-y-3">
                        {todayMeds.map((med) => (
                            <StaggerItem key={med.id}>
                                <GlassCard className={`transition-all duration-300 !p-5 ${med.status === 'taken' ? '!border-green-200/80' :
                                        med.status === 'skipped' ? '!border-orange-200/80' : ''
                                    }`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all ${med.status === 'taken' ? 'bg-green-100' :
                                                med.status === 'skipped' ? 'bg-orange-100' :
                                                    'bg-gradient-to-br from-primary-50 to-primary-100'
                                            }`}>💊</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-elder-base font-bold themed-text truncate">{med.name}</p>
                                            <p className="text-sm themed-text-muted">{med.dosage} · {med.schedule} · {med.frequency}</p>
                                        </div>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {!med.status ? (
                                            <motion.div key="actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} className="flex gap-3 mt-4">
                                                <motion.button whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => handleTaken(med)}
                                                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-elder-sm py-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center gap-2">
                                                    <Check size={20} /> TAKEN
                                                </motion.button>
                                                <motion.button whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => handleSkipped(med)}
                                                    className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-bold text-elder-sm py-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center gap-2">
                                                    <SkipForward size={20} /> SKIPPED
                                                </motion.button>
                                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSnooze(med)}
                                                    className="px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-sm py-3 rounded-xl transition-colors flex items-center gap-1.5" title="Snooze 15 min">
                                                    <Bell size={16} /> Snooze
                                                </motion.button>
                                            </motion.div>
                                        ) : (
                                            <motion.div key="status" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-3">
                                                <StatusBadge status={med.status} />
                                                <span className="text-xs themed-text-muted ml-2">
                                                    · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </GlassCard>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                )}
            </div>

            {/* Weekly Calendar View */}
            <div>
                <SectionHeader title="Weekly Calendar" icon={<Calendar size={22} />} className="mb-4" />
                <GlassCard>
                    <div className="grid grid-cols-7 gap-3">
                        {weeklyData.map((day) => {
                            const total = day.taken + day.skipped;
                            const pct = total > 0 ? Math.round((day.taken / total) * 100) : -1;
                            const isToday = day.date === new Date().toISOString().split('T')[0];
                            return (
                                <motion.div key={day.date} whileHover={{ scale: 1.1 }} className="text-center">
                                    <p className={`text-xs font-semibold mb-2 ${isToday ? 'text-primary-500' : 'themed-text-muted'}`}>{day.dayName}</p>
                                    <div className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold border-2 transition-all duration-200 ${isToday ? 'ring-2 ring-primary-400 ring-offset-2' : ''
                                        } ${pct < 0 ? 'bg-gray-50 text-gray-400 border-gray-200' :
                                            pct >= 80 ? 'bg-green-50 text-green-700 border-green-200' :
                                                pct >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        <span className="text-base">{pct < 0 ? '–' : `${pct}%`}</span>
                                        {total > 0 && <span className="text-[10px] opacity-60">{day.taken}/{total}</span>}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
                        {[
                            { color: 'bg-green-100 text-green-700 border-green-200', label: '80%+' },
                            { color: 'bg-amber-100 text-amber-700 border-amber-200', label: '50-79%' },
                            { color: 'bg-red-100 text-red-700 border-red-200', label: '<50%' },
                            { color: 'bg-gray-100 text-gray-500 border-gray-200', label: 'No data' },
                        ].map(({ color, label }) => (
                            <span key={label} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${color}`}>{label}</span>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Overall */}
            <GlassCard glow className="text-center">
                <p className="text-sm themed-text-muted font-medium mb-1">Overall Adherence Rate</p>
                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className={`text-4xl font-bold ${adherencePercentage >= 80 ? 'text-medical-safe' : adherencePercentage >= 50 ? 'text-medical-warn' : 'text-medical-danger'}`}>
                    {adherencePercentage}%
                </motion.p>
            </GlassCard>
        </AnimatedPage>
    );
}

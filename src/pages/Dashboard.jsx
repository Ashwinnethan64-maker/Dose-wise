import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScanLine, Pill, AlertTriangle, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import useMedications from '../hooks/useMedications';
import useAdherence from '../hooks/useAdherence';
import AdherenceRing from '../components/AdherenceRing';
import AnimatedPage, { StaggerContainer, StaggerItem } from '../components/ui/AnimatedPage';
import MetricCard from '../components/ui/MetricCard';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';

export default function Dashboard() {
    const { medications } = useMedications();
    const { adherencePercentage, missedToday, getStatusToday, weeklyData } = useAdherence();
    const navigate = useNavigate();

    const todayMeds = medications.map((med) => ({
        ...med,
        status: getStatusToday(med.id),
    }));
    const pendingCount = todayMeds.filter((m) => !m.status).length;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <AnimatedPage className="space-y-7">
            {/* Header */}
            <div>
                <h1 className="text-elder-2xl font-bold themed-text flex items-center gap-2">
                    {greeting} <motion.span animate={{ rotate: [0, 14, -8, 14, 0] }} transition={{ duration: 1.5, delay: 0.3 }}>👋</motion.span>
                </h1>
                <p className="text-sm themed-text-muted mt-1 font-medium">
                    Here's your health overview for today
                </p>
            </div>

            {/* Quick Action Cards — equal height grid */}
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Adherence Ring */}
                <StaggerItem>
                    <GlassCard hover glow className="flex flex-col items-center justify-center cursor-pointer h-full min-h-[180px]" onClick={() => navigate('/adherence')}>
                        <AdherenceRing percentage={adherencePercentage} size={100} label="Adherence" />
                        <p className="text-sm themed-text-muted mt-3 font-medium">Overall Score</p>
                    </GlassCard>
                </StaggerItem>

                {/* Quick Scan — equal height */}
                <StaggerItem>
                    <motion.button
                        onClick={() => navigate('/scan')}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full h-full min-h-[180px] bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 rounded-2xl shadow-btn hover:shadow-glow-lg p-6 text-white text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-center"
                    >
                        {/* Pulse ring */}
                        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-white/30 animate-ping" />
                        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-white/60" />
                        <ScanLine size={30} className="mb-3 opacity-90" />
                        <h3 className="text-elder-base font-bold flex items-center gap-1.5">
                            Scan Pill <Sparkles size={16} className="opacity-70" />
                        </h3>
                        <p className="text-sm opacity-75 mt-1">Identify with AI camera</p>
                    </motion.button>
                </StaggerItem>

                {/* Pending Meds */}
                <StaggerItem>
                    <MetricCard icon={<Pill size={24} />} value={pendingCount} label="Pending Today" color="teal" onClick={() => navigate('/adherence')} className="h-full min-h-[180px]" />
                </StaggerItem>

                {/* Missed Alerts */}
                <StaggerItem>
                    <MetricCard icon={<AlertTriangle size={24} />} value={missedToday.length} label="Missed Today"
                        color={missedToday.length > 0 ? 'red' : 'teal'} onClick={() => navigate('/adherence')} className="h-full min-h-[180px]" />
                </StaggerItem>
            </StaggerContainer>

            {/* Today's Medications */}
            <div>
                <SectionHeader
                    title="Today's Medications"
                    icon={<Pill size={22} />}
                    action={
                        <motion.button whileHover={{ x: 3 }} onClick={() => navigate('/medications')}
                            className="text-sm text-primary-500 hover:text-primary-700 font-semibold transition-colors flex items-center gap-1">
                            View All <ArrowRight size={15} />
                        </motion.button>
                    }
                    className="mb-4"
                />

                {todayMeds.length === 0 ? (
                    <GlassCard className="text-center py-10">
                        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                            <Pill size={44} className="text-primary-300 mx-auto mb-4" />
                        </motion.div>
                        <p className="text-elder-sm themed-text-muted mb-1">No medications added yet</p>
                        <p className="text-sm themed-text-muted opacity-60 mb-5">Start by adding your first medication</p>
                        <motion.button whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/medications')}
                            className="bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold text-sm py-2.5 px-5 rounded-xl transition-colors">
                            ➕ Add Your First Medication
                        </motion.button>
                    </GlassCard>
                ) : (
                    <StaggerContainer className="space-y-3">
                        {todayMeds.map((med) => (
                            <StaggerItem key={med.id}>
                                <GlassCard
                                    hover
                                    className={`flex items-center gap-4 !p-4 ${med.status === 'taken' ? '!border-green-200/80' :
                                            med.status === 'skipped' ? '!border-orange-200/80' : ''
                                        }`}
                                >
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                                        style={{ background: 'var(--color-badge-bg)' }}>
                                        💊
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold themed-text truncate">{med.name}</p>
                                        <p className="text-sm themed-text-muted">{med.dosage} · {med.schedule}</p>
                                    </div>
                                    <StatusBadge status={med.status || 'pending'} />
                                </GlassCard>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                )}
            </div>

            {/* Weekly Overview */}
            <div>
                <SectionHeader title="Weekly Overview" icon={<Calendar size={22} />} className="mb-4" />
                <GlassCard>
                    <div className="grid grid-cols-7 gap-2">
                        {weeklyData.map((day) => {
                            const total = day.taken + day.skipped;
                            const pct = total > 0 ? Math.round((day.taken / total) * 100) : -1;
                            const isToday = day.date === new Date().toISOString().split('T')[0];
                            return (
                                <motion.div key={day.date} whileHover={{ scale: 1.08 }} className="text-center">
                                    <p className={`text-xs font-semibold mb-2 ${isToday ? 'text-primary-500' : 'themed-text-muted'}`}>
                                        {day.dayName}
                                    </p>
                                    <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-xs font-bold transition-all ${isToday ? 'ring-2 ring-primary-400 ring-offset-2' : ''
                                        } ${pct < 0 ? 'bg-gray-100 text-gray-400' :
                                            pct >= 80 ? 'bg-green-100 text-green-700' :
                                                pct >= 50 ? 'bg-amber-100 text-amber-700' :
                                                    'bg-red-100 text-red-700'
                                        }`}>
                                        {pct < 0 ? '–' : `${pct}%`}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </GlassCard>
            </div>
        </AnimatedPage>
    );
}

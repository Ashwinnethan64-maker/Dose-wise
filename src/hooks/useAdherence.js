import { useCallback, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * useAdherence — Track daily medication adherence.
 * Log entries: { id, medicationId, status: 'taken'|'skipped', timestamp, date }
 */
export default function useAdherence() {
    const [logs, setLogs] = useLocalStorage('dosewise_adherence', []);

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const logDose = useCallback((medicationId, status) => {
        const entry = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
            medicationId,
            status, // 'taken' | 'skipped'
            timestamp: new Date().toISOString(),
            date: today,
        };
        setLogs((prev) => [...prev, entry]);
        return entry;
    }, [setLogs, today]);

    const getTodayLogs = useCallback(
        () => logs.filter((l) => l.date === today),
        [logs, today]
    );

    const isTakenToday = useCallback(
        (medicationId) => logs.some((l) => l.date === today && l.medicationId === medicationId),
        [logs, today]
    );

    const getStatusToday = useCallback(
        (medicationId) => {
            const entry = logs.find(
                (l) => l.date === today && l.medicationId === medicationId
            );
            return entry ? entry.status : null;
        },
        [logs, today]
    );

    // Weekly data: last 7 days
    const weeklyData = useMemo(() => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayLogs = logs.filter((l) => l.date === dateStr);
            const taken = dayLogs.filter((l) => l.status === 'taken').length;
            const skipped = dayLogs.filter((l) => l.status === 'skipped').length;
            days.push({
                date: dateStr,
                dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
                taken,
                skipped,
                total: taken + skipped,
            });
        }
        return days;
    }, [logs]);

    // Overall adherence percentage
    const adherencePercentage = useMemo(() => {
        if (logs.length === 0) return 100;
        const taken = logs.filter((l) => l.status === 'taken').length;
        return Math.round((taken / logs.length) * 100);
    }, [logs]);

    // Missed doses: medications logged as skipped today
    const missedToday = useMemo(
        () => logs.filter((l) => l.date === today && l.status === 'skipped'),
        [logs, today]
    );

    return {
        logs,
        logDose,
        getTodayLogs,
        isTakenToday,
        getStatusToday,
        weeklyData,
        adherencePercentage,
        missedToday,
    };
}

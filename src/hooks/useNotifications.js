import { useEffect, useRef } from 'react';
import useMedications from './useMedications';
import useProfile from './useProfile';
import { useToast } from '../components/ui/Toast';

/**
 * useNotifications — Simulates medication reminder notifications.
 * When notifications are enabled, it fires a toast every 45 seconds
 * cycling through the user's medications.
 */
export default function useNotifications() {
    const { medications } = useMedications();
    const { profile } = useProfile();
    const { addToast } = useToast();
    const indexRef = useRef(0);
    const timerRef = useRef(null);

    useEffect(() => {
        // Clear any existing timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        if (!profile.notificationsEnabled || medications.length === 0) return;

        // Simulate reminders every 45 seconds
        timerRef.current = setInterval(() => {
            const med = medications[indexRef.current % medications.length];
            if (med) {
                addToast(
                    `⏰ Time to take ${med.name} — ${med.schedule || 'now'}`,
                    'info'
                );
                indexRef.current += 1;
            }
        }, 45000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [profile.notificationsEnabled, medications, addToast]);
}

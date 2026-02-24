import { useCallback, useEffect, useRef } from 'react';

/**
 * useReminders — Browser Notification API integration for medication reminders.
 */
export default function useReminders(medications = []) {
    const timersRef = useRef([]);

    // Request notification permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    const sendNotification = useCallback((title, body) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                new Notification(title, {
                    body,
                    icon: '💊',
                    badge: '💊',
                    tag: 'dosewise-reminder',
                });
            } catch {
                // Safari / iOS fallback
                console.log('[Reminder]', title, body);
            }
        }
    }, []);

    const scheduleReminder = useCallback(
        (medName, timeStr, delayMs = 0) => {
            const timer = setTimeout(() => {
                sendNotification(
                    '💊 Time to take your medication',
                    `${medName} — scheduled at ${timeStr}`
                );
            }, delayMs);
            timersRef.current.push(timer);
            return timer;
        },
        [sendNotification]
    );

    const snooze = useCallback(
        (medName) => {
            sendNotification('⏰ Snoozed', `${medName} reminder snoozed for 15 minutes`);
            return scheduleReminder(medName, 'Snoozed', 15 * 60 * 1000);
        },
        [sendNotification, scheduleReminder]
    );

    // Schedule daily reminders based on medication schedule times
    useEffect(() => {
        // Clear previous timers
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];

        medications.forEach((med) => {
            if (!med.schedule) return;
            const [hours, minutes] = med.schedule.split(':').map(Number);
            const now = new Date();
            const target = new Date();
            target.setHours(hours, minutes, 0, 0);

            if (target > now) {
                const delay = target - now;
                scheduleReminder(med.name, med.schedule, delay);
            }
        });

        return () => {
            timersRef.current.forEach(clearTimeout);
        };
    }, [medications, scheduleReminder]);

    return { sendNotification, scheduleReminder, snooze };
}

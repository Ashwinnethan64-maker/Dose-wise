import { useState, useEffect } from 'react';

/**
 * useLocalStorage — Persist state to localStorage with JSON serialization.
 * @param {string} key
 * @param {*} initialValue
 */
export default function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setStoredValue = (newValue) => {
        try {
            const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
            setValue(valueToStore);
            localStorage.setItem(key, JSON.stringify(valueToStore));
            window.dispatchEvent(new CustomEvent('local-storage-update', { detail: { key, value: valueToStore } }));
        } catch (err) {
            console.error('[useLocalStorage] Failed to save:', err);
        }
    };

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key && e.newValue) {
                try {
                    setValue(JSON.parse(e.newValue));
                } catch (err) {
                    console.error('[useLocalStorage] Sync error:', err);
                }
            }
        };

        const handleCustomUpdate = (e) => {
            if (e.detail && e.detail.key === key) {
                setValue(e.detail.value);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('local-storage-update', handleCustomUpdate);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage-update', handleCustomUpdate);
        };
    }, [key]);

    return [value, setStoredValue];
}

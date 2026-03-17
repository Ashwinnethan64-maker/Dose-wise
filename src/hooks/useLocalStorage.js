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

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error('[useLocalStorage] Failed to save:', err);
        }
    }, [key, value]);

    return [value, setValue];
}

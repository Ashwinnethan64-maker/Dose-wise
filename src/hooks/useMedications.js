import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * useMedications — CRUD for medications stored in localStorage.
 * Each medication: { id, name, dosage, schedule, frequency, image, color, createdAt }
 */
export default function useMedications() {
    const [medications, setMedications] = useLocalStorage('dosewise_medications', []);

    const addMedication = useCallback((med) => {
        const newMed = {
            ...med,
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
            createdAt: new Date().toISOString(),
        };
        setMedications((prev) => [...prev, newMed]);
        return newMed;
    }, [setMedications]);

    const updateMedication = useCallback((id, updates) => {
        setMedications((prev) =>
            prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
        );
    }, [setMedications]);

    const deleteMedication = useCallback((id) => {
        setMedications((prev) => prev.filter((m) => m.id !== id));
    }, [setMedications]);

    const getMedication = useCallback(
        (id) => medications.find((m) => m.id === id) || null,
        [medications]
    );

    return { medications, addMedication, updateMedication, deleteMedication, getMedication };
}

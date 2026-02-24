import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pill } from 'lucide-react';
import useMedications from '../hooks/useMedications';
import MedicationCard from '../components/MedicationCard';
import MedicationModal from '../components/MedicationModal';
import { checkAllInteractions } from '../utils/drugInteraction';
import { useToast } from '../components/ui/Toast';
import AnimatedPage, { StaggerContainer, StaggerItem } from '../components/ui/AnimatedPage';
import PrimaryButton from '../components/ui/PrimaryButton';
import SectionHeader from '../components/ui/SectionHeader';
import ConfirmModal from '../components/ui/ConfirmModal';

export default function Medications() {
    const { medications, addMedication, updateMedication, deleteMedication } = useMedications();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingMed, setEditingMed] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const { addToast } = useToast();

    const handleSave = (data) => {
        if (editingMed) { updateMedication(editingMed.id, data); addToast('Medication updated successfully', 'success'); }
        else { addMedication(data); addToast('Medication added successfully', 'success'); }
        setEditingMed(null);
    };

    const handleEdit = (med) => { setEditingMed(med); setModalOpen(true); };
    const handleAdd = () => { setEditingMed(null); setModalOpen(true); };
    const handleDeleteRequest = (id) => { const med = medications.find((m) => m.id === id); setDeleteTarget(med || { id }); };
    const handleDeleteConfirm = () => { if (deleteTarget) { deleteMedication(deleteTarget.id); addToast(`${deleteTarget.name || 'Medication'} removed`, 'info'); setDeleteTarget(null); } };

    return (
        <AnimatedPage className="space-y-6">
            <div className="flex items-center justify-between">
                <SectionHeader
                    title="My Medications"
                    subtitle={`${medications.length} medication${medications.length !== 1 ? 's' : ''} tracked`}
                    icon={<Pill size={24} />}
                />
                <PrimaryButton onClick={handleAdd} icon={<Plus size={20} />}>Add</PrimaryButton>
            </div>

            {medications.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl border p-14 text-center themed-modal">
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-5">
                            <Pill size={36} className="text-primary-400" />
                        </div>
                    </motion.div>
                    <h3 className="text-elder-lg font-bold themed-text mb-2">No Medications Yet</h3>
                    <p className="text-sm themed-text-muted mb-6 max-w-sm mx-auto leading-relaxed">
                        Add your medications to start tracking doses, get reminders, and check drug interactions.
                    </p>
                    <PrimaryButton onClick={handleAdd} icon={<Plus size={18} />} size="md">Add Your First Medication</PrimaryButton>
                </motion.div>
            ) : (
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {medications.map((med) => {
                        const interactions = checkAllInteractions(med.name, medications.filter((m) => m.id !== med.id));
                        return (
                            <StaggerItem key={med.id}>
                                <MedicationCard med={med} onEdit={handleEdit} onDelete={handleDeleteRequest} interactions={interactions} />
                            </StaggerItem>
                        );
                    })}
                </StaggerContainer>
            )}

            <AnimatePresence>
                {modalOpen && (
                    <MedicationModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingMed(null); }}
                        onSave={handleSave} medication={editingMed} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm}
                    title="Remove Medication?"
                    message={`Are you sure you want to remove "${deleteTarget?.name || 'this medication'}"? This action cannot be undone.`}
                    confirmLabel="Remove" variant="danger" />
            </AnimatePresence>
        </AnimatedPage>
    );
}

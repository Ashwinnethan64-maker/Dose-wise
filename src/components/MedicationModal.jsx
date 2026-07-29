import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Trash2, Check, FileText, File as FileIcon } from 'lucide-react';
import PrimaryButton from './ui/PrimaryButton';

/* ─── Pill Color Palette ──────────────────────────────────── */
const PILL_COLORS = [
    { name: 'white', hex: '#e5e7eb', ring: 'ring-gray-400' },
    { name: 'blue', hex: '#60a5fa', ring: 'ring-blue-400' },
    { name: 'red', hex: '#f87171', ring: 'ring-red-400' },
    { name: 'yellow', hex: '#fbbf24', ring: 'ring-yellow-400' },
    { name: 'green', hex: '#4ade80', ring: 'ring-green-400' },
    { name: 'orange', hex: '#fb923c', ring: 'ring-orange-400' },
    { name: 'pink', hex: '#f472b6', ring: 'ring-pink-400' },
    { name: 'purple', hex: '#a78bfa', ring: 'ring-purple-400' },
];

/**
 * MedicationModal — Add / Edit medication with pill color selector and multi-type file upload.
 */
export default function MedicationModal({ isOpen, onClose, onSave, medication = null }) {
    const isEditing = !!medication;
    const [form, setForm] = useState({
        name: '', dosage: '', frequency: 'Once daily', schedule: 'Morning', notes: '', image: null, color: 'white',
        fileName: '', fileType: ''
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (medication) {
            setForm({
                name: medication.name || '',
                dosage: medication.dosage || '',
                frequency: medication.frequency || 'Once daily',
                schedule: medication.schedule || 'Morning',
                notes: medication.notes || '',
                image: medication.image || null,
                color: medication.color || 'white',
                fileName: medication.fileName || '',
                fileType: medication.fileType || ''
            });
        } else {
            setForm({
                name: '', dosage: '', frequency: 'Once daily', schedule: 'Morning', notes: '', image: null, color: 'white',
                fileName: '', fileType: ''
            });
        }
    }, [medication, isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setForm((prev) => ({
                ...prev,
                image: reader.result,
                fileName: file.name,
                fileType: file.type
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveFile = () => {
        setForm((prev) => ({ ...prev, image: null, fileName: '', fileType: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.name.trim() || !form.dosage || !form.dosage.trim()) return;
        const saveData = {
            name: form.name.trim(),
            dosage: form.dosage.trim(),
            frequency: form.frequency || 'Once daily',
            schedule: form.schedule || 'Morning',
            notes: form.notes || '',
            image: form.image || null,
            color: form.color || 'white',
            fileName: form.fileName || '',
            fileType: form.fileType || '',
        };
        if (medication && medication.id) {
            saveData.id = medication.id;
        }
        onSave(saveData);
        onClose();
    };

    const isImage = form.fileType?.startsWith('image/') || (form.image && form.image.startsWith('data:image/'));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0"
                style={{ background: 'var(--color-modal-backdrop)' }}
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="relative w-full max-w-md rounded-2xl border max-h-[90vh] flex flex-col themed-modal shadow-xl overflow-hidden"
            >
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b shrink-0" style={{ borderColor: 'var(--color-border)' }}>
                    <h2 className="text-base font-bold themed-text">{isEditing ? 'Edit Medication' : 'Add Medication'}</h2>
                    <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-1.5 rounded-lg themed-text-muted hover:themed-text transition-colors"
                        aria-label="Close modal">
                        <X size={16} />
                    </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1 overflow-hidden">
                    {/* Scrollable Form Body */}
                    <div className="p-6 space-y-4 overflow-y-auto flex-1">
                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-semibold themed-text mb-1.5">Photo or Document (Optional)</label>
                            {form.image ? (
                                <div className="relative rounded-xl overflow-hidden border group" style={{ borderColor: 'var(--color-border)' }}>
                                    {isImage ? (
                                        <img src={form.image} alt="Medication" className="w-full h-36 object-cover" />
                                    ) : (
                                        <div className="w-full h-36 flex flex-col items-center justify-center gap-2 themed-text"
                                            style={{ background: 'var(--color-pref-row)' }}>
                                            <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600">
                                                {form.fileType?.includes('pdf') ? <FileText size={28} /> : <FileIcon size={28} />}
                                            </div>
                                            <p className="px-4 text-[13px] font-bold text-center truncate w-full">{form.fileName || 'Document'}</p>
                                            <p className="text-[10px] themed-text-muted uppercase tracking-wider font-bold">{(form.fileType?.split('/')[1] || 'File')}</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => fileInputRef.current?.click()}
                                            className="px-3 py-2 bg-white/95 rounded-xl hover:bg-white transition-colors flex items-center gap-2 text-xs font-bold text-primary-600 shadow-lg">
                                            <Camera size={14} />
                                            CHANGE FILE
                                        </motion.button>
                                        <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={handleRemoveFile}
                                            className="p-2 bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-lg" title="Remove file">
                                            <Trash2 size={18} className="text-white" />
                                        </motion.button>
                                    </div>
                                </div>
                            ) : (
                                <motion.button type="button" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors themed-text-muted"
                                    style={{ borderColor: 'var(--color-border-input)', background: 'var(--color-input-bg)' }}>
                                    <Camera size={24} className="text-primary-500" />
                                    <span className="text-xs font-bold">Tap to upload Photo / PDF / DOC</span>
                                </motion.button>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,.pdf,.doc,.docx,.txt"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>

                        {/* ── Pill Color Selector ─────────────────────────────── */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider themed-text-muted mb-2">Pill Color</label>
                            <div className="flex flex-wrap gap-2.5">
                                {PILL_COLORS.map((c) => (
                                    <motion.button
                                        key={c.name}
                                        type="button"
                                        whileHover={{ scale: 1.12 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setForm({ ...form, color: c.name })}
                                        className={`w-8 h-8 rounded-full relative transition-all duration-200
                        ${form.color === c.name ? `ring-2 ring-offset-2 ${c.ring}` : 'ring-1 ring-black/10 hover:ring-2 hover:ring-primary-300'}`}
                                        style={{
                                            backgroundColor: c.hex,
                                            ringOffsetColor: 'var(--color-modal)',
                                        }}
                                        title={c.name.charAt(0).toUpperCase() + c.name.slice(1)}
                                        aria-label={`Select ${c.name} pill color`}
                                    >
                                        {form.color === c.name && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute inset-0 flex items-center justify-center"
                                            >
                                                <Check size={13} className={c.name === 'white' || c.name === 'yellow' ? 'text-gray-700' : 'text-white'} strokeWidth={3} />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider themed-text-muted mb-1.5">Medication Name *</label>
                            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. Metformin" required
                                className="w-full px-4 py-2.5 rounded-xl themed-input outline-none text-sm" />
                        </div>

                        {/* Dosage */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider themed-text-muted mb-1.5">Dosage *</label>
                            <input type="text" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                                placeholder="e.g. 500mg" required
                                className="w-full px-4 py-2.5 rounded-xl themed-input outline-none text-sm" />
                        </div>

                        {/* Frequency */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider themed-text-muted mb-1.5">Frequency</label>
                            <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl themed-input outline-none text-sm">
                                <option>Once daily</option><option>Twice daily</option><option>Three times</option><option>As needed</option>
                            </select>
                        </div>

                        {/* Schedule */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider themed-text-muted mb-1.5">Schedule</label>
                            <select value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl themed-input outline-none text-sm">
                                <option>Morning</option><option>Afternoon</option><option>Evening</option><option>Bedtime</option>
                            </select>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider themed-text-muted mb-1.5">Notes</label>
                            <div className="rounded-xl overflow-hidden border transition-colors focus-within:border-primary-500"
                                style={{ borderColor: 'var(--color-border-input)', background: 'var(--color-input-bg)' }}>
                                <textarea
                                    rows={3}
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    placeholder="Optional notes..."
                                    className="w-full px-4 py-2.5 outline-none text-sm min-h-[120px] resize-none leading-relaxed bg-transparent border-0 focus:ring-0"
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        overflowWrap: 'anywhere',
                                        overflowY: 'auto',
                                        overflowX: 'hidden',
                                        boxSizing: 'border-box',
                                        scrollbarGutter: 'stable',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sticky Footer */}
                    <div className="p-4 border-t flex gap-3 shrink-0" style={{ borderColor: 'var(--color-border)', background: 'var(--color-modal)' }}>
                        <motion.button type="button" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl font-semibold text-sm themed-text themed-pref-row transition-colors border border-gray-200/50">
                            Cancel
                        </motion.button>
                        <PrimaryButton type="submit" size="md" className="flex-1">
                            {isEditing ? 'Save Changes' : 'Add Medication'}
                        </PrimaryButton>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

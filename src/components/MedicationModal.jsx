import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Camera, Trash2, Check, FileText, File as FileIcon } from 'lucide-react';
import PrimaryButton from './ui/PrimaryButton';
import { useLanguage } from '../context/LanguageContext';

export default function MedicationModal({ isOpen, onClose, onSave, medication = null }) {
    const { t } = useLanguage();
    const isEditing = !!medication;

    const PILL_COLORS = [
        { name: 'white', key: 'colorWhite', hex: '#e5e7eb', ring: 'ring-gray-400' },
        { name: 'blue', key: 'colorBlue', hex: '#60a5fa', ring: 'ring-blue-400' },
        { name: 'red', key: 'colorRed', hex: '#f87171', ring: 'ring-red-400' },
        { name: 'yellow', key: 'colorYellow', hex: '#fbbf24', ring: 'ring-yellow-400' },
        { name: 'green', key: 'colorGreen', hex: '#4ade80', ring: 'ring-green-400' },
        { name: 'orange', key: 'colorOrange', hex: '#fb923c', ring: 'ring-orange-400' },
        { name: 'pink', key: 'colorPink', hex: '#f472b6', ring: 'ring-pink-400' },
        { name: 'purple', key: 'colorPurple', hex: '#a78bfa', ring: 'ring-purple-400' },
    ];

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
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
                className="relative w-full max-w-md rounded-2xl border max-h-[85dvh] sm:max-h-[90vh] flex flex-col themed-modal shadow-xl overflow-hidden"
            >
                {/* Header */}
                <div className="px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b shrink-0" style={{ borderColor: 'var(--color-border)' }}>
                    <h2 className="text-base font-bold themed-text">{isEditing ? t('editMedication') : t('addMedication')}</h2>
                    <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="w-10 h-10 rounded-lg themed-text-muted hover:themed-text transition-colors flex items-center justify-center min-w-[40px] shrink-0"
                        aria-label="Close modal">
                        <X size={18} />
                    </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1 overflow-hidden">
                    {/* Scrollable Form Body */}
                    <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1">
                        {/* File Upload */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider themed-text-muted mb-1.5">{t('photoOrDoc')}</label>
                            {form.image ? (
                                <div className="relative rounded-xl overflow-hidden border group" style={{ borderColor: 'var(--color-border)' }}>
                                    {isImage ? (
                                        <img src={form.image} alt="Medication" className="w-full h-32 sm:h-36 object-cover" />
                                    ) : (
                                        <div className="w-full h-32 sm:h-36 flex flex-col items-center justify-center gap-2 themed-text"
                                            style={{ background: 'var(--color-pref-row)' }}>
                                            <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600">
                                                {form.fileType?.includes('pdf') ? <FileText size={24} /> : <FileIcon size={24} />}
                                            </div>
                                            <p className="px-4 text-[13px] font-bold text-center truncate w-full">{form.fileName || 'Document'}</p>
                                            <p className="text-[10px] themed-text-muted uppercase tracking-wider font-bold">{(form.fileType?.split('/')[1] || 'File')}</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => fileInputRef.current?.click()}
                                            className="px-3 py-2 bg-white/95 rounded-xl hover:bg-white transition-colors flex items-center gap-2 text-xs font-bold text-primary-600 shadow-lg min-h-[40px]">
                                            <Camera size={14} />
                                            {t('changeFile')}
                                        </motion.button>
                                        <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={handleRemoveFile}
                                            className="p-2.5 bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-lg min-h-[40px] min-w-[40px] flex items-center justify-center" title={t('removePhoto')}>
                                            <Trash2 size={18} className="text-white" />
                                        </motion.button>
                                    </div>
                                </div>
                            ) : (
                                <motion.button type="button" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-24 sm:h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors themed-text-muted min-h-[44px]"
                                    style={{ borderColor: 'var(--color-border-input)', background: 'var(--color-input-bg)' }}>
                                    <Camera size={22} className="text-primary-500" />
                                    <span className="text-xs font-bold">{t('tapToUpload')}</span>
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
                            <label className="block text-xs font-semibold uppercase tracking-wider themed-text-muted mb-2">{t('pillColor')}</label>
                            <div className="flex flex-wrap gap-2.5">
                                {PILL_COLORS.map((c) => (
                                    <motion.button
                                        key={c.name}
                                        type="button"
                                        whileHover={{ scale: 1.12 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setForm({ ...form, color: c.name })}
                                        className={`w-9 h-9 sm:w-8 sm:h-8 rounded-full relative transition-all duration-200
                        ${form.color === c.name ? `ring-2 ring-offset-2 ${c.ring}` : 'ring-1 ring-black/10 hover:ring-2 hover:ring-primary-300'}`}
                                        style={{
                                            backgroundColor: c.hex,
                                            ringOffsetColor: 'var(--color-modal)',
                                        }}
                                        title={t(c.key)}
                                        aria-label={`Select ${t(c.key)} color`}
                                    >
                                        {form.color === c.name && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute inset-0 flex items-center justify-center"
                                            >
                                                <Check size={14} className={c.name === 'white' || c.name === 'yellow' ? 'text-gray-700' : 'text-white'} strokeWidth={3} />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider themed-text-muted mb-1.5">{t('medName')}</label>
                            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder={t('medNamePlaceholder')} required
                                className="w-full px-4 py-2.5 rounded-xl themed-input outline-none text-sm min-h-[44px]" />
                        </div>

                        {/* Dosage */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider themed-text-muted mb-1.5">{t('dosage')}</label>
                            <input type="text" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                                placeholder={t('dosagePlaceholder')} required
                                className="w-full px-4 py-2.5 rounded-xl themed-input outline-none text-sm min-h-[44px]" />
                        </div>

                        {/* Frequency */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider themed-text-muted mb-1.5">{t('frequency')}</label>
                            <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl themed-input outline-none text-sm min-h-[44px]">
                                <option value="Once daily">{t('freqOnce')}</option>
                                <option value="Twice daily">{t('freqTwice')}</option>
                                <option value="Three times">{t('freqThree')}</option>
                                <option value="As needed">{t('freqAsNeeded')}</option>
                            </select>
                        </div>

                        {/* Schedule */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider themed-text-muted mb-1.5">{t('schedule')}</label>
                            <select value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl themed-input outline-none text-sm min-h-[44px]">
                                <option value="Morning">{t('schedMorning')}</option>
                                <option value="Afternoon">{t('schedAfternoon')}</option>
                                <option value="Evening">{t('schedEvening')}</option>
                                <option value="Bedtime">{t('schedBedtime')}</option>
                            </select>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider themed-text-muted mb-1.5">{t('notes')}</label>
                            <div className="rounded-xl overflow-hidden border transition-colors focus-within:border-primary-500"
                                style={{ borderColor: 'var(--color-border-input)', background: 'var(--color-input-bg)' }}>
                                <textarea
                                    rows={3}
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    placeholder={t('notesPlaceholder')}
                                    className="w-full px-4 py-2.5 outline-none text-sm min-h-[100px] resize-none leading-relaxed bg-transparent border-0 focus:ring-0"
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
                    <div className="p-3.5 sm:p-4 border-t flex gap-3 shrink-0" style={{ borderColor: 'var(--color-border)', background: 'var(--color-modal)' }}>
                        <motion.button type="button" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="flex-1 py-3 sm:py-2.5 rounded-xl font-semibold text-sm themed-text themed-pref-row transition-colors border border-gray-200/50 min-h-[44px] flex items-center justify-center">
                            {t('cancel')}
                        </motion.button>
                        <PrimaryButton type="submit" size="md" className="flex-1 min-h-[44px] flex items-center justify-center">
                            {isEditing ? t('saveChanges') : t('addMedication')}
                        </PrimaryButton>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

/**
 * ConfirmModal — Reusable confirmation dialog. Theme-aware.
 */
export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
}) {
    if (!isOpen) return null;

    const confirmColors = {
        danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm hover:shadow-md',
        warning: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm hover:shadow-md',
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
                style={{ background: 'var(--color-modal-backdrop)' }}
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="relative w-full max-w-sm rounded-2xl border p-6 themed-modal text-center"
            >
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1.5 rounded-lg themed-text-muted"
                >
                    <X size={18} />
                </motion.button>

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${variant === 'danger' ? 'bg-red-50' : 'bg-amber-50'}`}>
                    <AlertTriangle size={28} className={variant === 'danger' ? 'text-medical-danger' : 'text-medical-warn'} />
                </div>

                <h3 className="text-elder-base font-bold themed-text mb-1.5">{title}</h3>
                <p className="text-sm themed-text-muted leading-relaxed mb-6">{message}</p>

                <div className="flex gap-3">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onClose}
                        className="flex-1 py-3 rounded-xl font-bold text-sm themed-text themed-pref-row transition-colors">
                        {cancelLabel}
                    </motion.button>
                    <motion.button whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={onConfirm}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-shadow ${confirmColors[variant]}`}>
                        {confirmLabel}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}

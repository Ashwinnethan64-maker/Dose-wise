import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
    success: <Check size={15} />,
    warning: <AlertTriangle size={15} />,
    error: <AlertTriangle size={15} />,
    info: <Info size={15} />,
};

const STYLES = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-primary-50 border-primary-200 text-primary-800',
};

/**
 * ToastProvider — Global toast notification system.
 */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now().toString(36);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            {/* Toast container */}
            <div className="fixed bottom-6 right-6 z-[200] space-y-3 max-w-sm">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 12, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 16, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border
                backdrop-blur-lg shadow-lg font-medium text-sm
                ${STYLES[toast.type]}
              `}
                        >
                            <span className="shrink-0">{ICONS[toast.type]}</span>
                            <p className="flex-1 leading-snug">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="shrink-0 opacity-40 hover:opacity-100 transition-opacity p-0.5 rounded"
                                aria-label="Dismiss notification"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

/**
 * useToast — Access toast notification from any component.
 */
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}

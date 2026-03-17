import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * InputField — Consistent text input with glow focus effect.
 */
export default function InputField({ label, type = 'text', value, onChange, placeholder, required, disabled, className = '', icon }) {
    const [focused, setFocused] = useState(false);

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-semibold text-medical-text mb-1.5">{label}</label>
            )}
            <motion.div animate={focused ? { scale: 1.005 } : { scale: 1 }}>
                <div className="relative">
                    {icon && (
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-medical-muted/60">{icon}</span>
                    )}
                    <input
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        disabled={disabled}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        className={`w-full py-3 rounded-xl border-2 border-primary-100 focus:border-primary-400 outline-none text-elder-sm transition-all duration-200 bg-white/60 disabled:opacity-50 disabled:cursor-not-allowed ${icon ? 'pl-10 pr-4' : 'px-4'
                            }`}
                        style={focused ? { boxShadow: '0 0 0 4px rgba(13,158,158,0.1)' } : {}}
                    />
                </div>
            </motion.div>
        </div>
    );
}

import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * InputField — Consistent text input with glow focus effect.
 */
export default function InputField({ label, type = 'text', value, onChange, placeholder, required, disabled, className = '', icon, ...props }) {
    const [focused, setFocused] = useState(false);

    return (
        <div className={className}>
            {label && (
                <label className="block text-xs font-semibold uppercase tracking-wider themed-text-muted mb-1.5">{label}</label>
            )}
            <motion.div animate={focused ? { scale: 1.002 } : { scale: 1 }}>
                <div className="relative">
                    {icon && (
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 themed-text-muted opacity-60 pointer-events-none">{icon}</span>
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
                        className={`w-full py-2.5 rounded-xl themed-input outline-none text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${icon ? 'pl-10 pr-4' : 'px-4'
                            }`}
                        style={focused ? { boxShadow: '0 0 0 4px rgba(13,158,158,0.14)', borderColor: 'var(--color-border-input-focus)' } : {}}
                        {...props}
                    />
                </div>
            </motion.div>
        </div>
    );
}

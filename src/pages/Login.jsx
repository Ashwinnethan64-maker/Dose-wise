import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import { useToast } from '../components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Heart, ArrowRight, X, Mail } from 'lucide-react';
import PrimaryButton from '../components/ui/PrimaryButton';

// Mock Google Icon for the button
export const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

/* ─── Forgot Password Modal ───────────────────────────────── */
// ... (omitted for brevity during replacement if possible, but I'll include it to be safe)
function ForgotPasswordModal({ isOpen, onClose }) {
    const [resetEmail, setResetEmail] = useState('');
    const [sent, setSent] = useState(false);
    const { addToast } = useToast();

    if (!isOpen) return null;

    const handleReset = (e) => {
        e.preventDefault();
        if (!resetEmail.trim()) return;
        setSent(true);
        addToast('Password reset link sent (Demo)', 'success');
        setTimeout(() => { onClose(); setSent(false); setResetEmail(''); }, 2000);
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
                className="relative w-full max-w-sm rounded-2xl border p-6 themed-modal"
            >
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-lg themed-text-muted"
                >
                    <X size={18} />
                </motion.button>

                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                    <Mail size={26} className="text-primary-500" />
                </div>

                <h3 className="text-elder-base font-bold themed-text text-center mb-1.5">Reset Password</h3>
                <p className="text-sm themed-text-muted text-center mb-5 leading-relaxed">
                    Enter your email and we'll send you a reset link.
                </p>

                {sent ? (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
                        <div className="text-3xl mb-2">📧</div>
                        <p className="text-sm text-primary-500 font-semibold">Check your inbox!</p>
                        <p className="text-xs themed-text-muted mt-1">Reset link sent to {resetEmail}</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
                        <input
                            type="email" value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="your@email.com" required
                            className="w-full px-4 py-3 rounded-xl themed-input outline-none text-elder-sm"
                        />
                        <PrimaryButton type="submit" size="md" className="w-full">
                            Send Reset Link
                        </PrimaryButton>
                    </form>
                )}
            </motion.div>
        </div>
    );
}

/* ─── Login Page ──────────────────────────────────────────── */
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [focused, setFocused] = useState(null);
    const [forgotOpen, setForgotOpen] = useState(false);
    const { login, loginWithGoogle } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleGoogleResponse = useCallback((response) => {
        const success = loginWithGoogle(response.credential);
        if (success) {
            addToast('Welcome back! 🎉', 'success');
            navigate('/');
        } else {
            addToast('Failed to sign in with Google', 'error');
        }
    }, [loginWithGoogle, navigate, addToast]);

    useEffect(() => {
        // Log origin for Google Cloud Console setup
        console.log("DoseWise Origin:", window.location.origin);

        const initGis = () => {
            if (window.google?.accounts?.id && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    callback: handleGoogleResponse,
                    auto_select: false,
                    cancel_on_tap_outside: true
                });
            }
        };

        // Try initialization immediately
        initGis();

        // Safety: check again in case script was still parsing
        const timer = setTimeout(initGis, 1500);
        return () => clearTimeout(timer);
    }, [handleGoogleResponse]);

    const handleGoogleSignIn = () => {
        if (window.google?.accounts?.id) {
            // Explicitly prompt the account chooser
            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMomentary()) {
                    console.log("Prompt not displayed:", notification.getNotDisplayedReason());
                }
            });
        } else {
            addToast('Google SDK loading... please wait.', 'info');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!email.trim() || !password.trim()) { setError('Please fill in all fields'); return; }
        const success = login(email, password);
        if (success) { addToast('Welcome back! 👋', 'success'); navigate('/'); }
        else setError('Invalid credentials');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--color-bg)' }}>
            {/* Background effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-[0.07]"
                style={{ background: 'radial-gradient(circle, rgba(13,158,158,0.8), transparent 60%)' }} />
            <div className="floating-shape w-[350px] h-[350px] -top-32 -right-20" style={{ animationDelay: '0s' }} />
            <div className="floating-shape w-[250px] h-[250px] bottom-10 -left-20" style={{ animationDelay: '3s' }} />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-8">
                    <motion.div
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-glow-lg mb-5"
                    >
                        <span className="text-4xl">💊</span>
                    </motion.div>
                    <h1 className="text-elder-3xl font-bold themed-text">
                        DoseWise <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">AI</span>
                    </h1>
                    <p className="text-sm themed-text-muted mt-1.5 font-medium">Your AI-Powered Medication Companion</p>
                </motion.div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="rounded-3xl p-8 border themed-modal"
                >
                    <h2 className="text-elder-xl font-bold themed-text mb-6 text-center">Welcome Back</h2>

                    {/* Google Sign-In — real GIS popup */}
                    <motion.button
                        onClick={handleGoogleSignIn}
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-3 border-2 font-semibold py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 mb-6 themed-text"
                        style={{ borderColor: 'var(--color-border-input)', background: 'var(--color-surface-solid)' }}
                    >
                        <GoogleIcon />
                        Continue with Google
                    </motion.button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px" style={{ background: 'var(--color-border-input)' }} />
                        <span className="text-xs themed-text-muted font-medium">or sign in with email</span>
                        <div className="flex-1 h-px" style={{ background: 'var(--color-border-input)' }} />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <label className="block text-sm font-semibold themed-text mb-1.5">Email</label>
                            <motion.div animate={focused === 'email' ? { scale: 1.005 } : { scale: 1 }}>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3.5 rounded-xl themed-input outline-none text-elder-sm"
                                    style={focused === 'email' ? { boxShadow: '0 0 0 4px rgba(13,158,158,0.1)' } : {}}
                                />
                            </motion.div>
                        </div>

                        <div className="relative">
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-semibold themed-text">Password</label>
                                <button type="button" onClick={() => setForgotOpen(true)}
                                    className="text-xs text-primary-500 hover:text-primary-700 font-semibold transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                            <motion.div animate={focused === 'password' ? { scale: 1.005 } : { scale: 1 }}>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3.5 rounded-xl themed-input outline-none text-elder-sm"
                                    style={focused === 'password' ? { boxShadow: '0 0 0 4px rgba(13,158,158,0.1)' } : {}}
                                />
                            </motion.div>
                        </div>

                        {error && (
                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                                className="text-medical-danger text-sm text-center font-medium">
                                ⚠️ {error}
                            </motion.p>
                        )}

                        <motion.button type="submit" whileHover={{ y: -2, scale: 1.02 }} whileTap={{ y: 0, scale: 0.97 }}
                            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-elder-base py-4 rounded-2xl shadow-btn hover:shadow-btn-hover transition-shadow duration-300 flex items-center justify-center gap-2">
                            Sign In <ArrowRight size={20} />
                        </motion.button>
                    </form>

                    <div className="flex items-center justify-center gap-2 mt-6 text-[11px] text-medical-safe font-semibold">
                        <ShieldCheck size={14} />
                        <span>Encrypted & Private — Your data stays on this device</span>
                    </div>
                </motion.div>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="text-center text-xs themed-text-muted mt-6 flex items-center justify-center gap-1">
                    Made with <Heart size={12} className="text-medical-danger" /> for better health
                </motion.p>
            </div>

            {/* Forgot Password Modal */}
            <AnimatePresence>
                {forgotOpen && <ForgotPasswordModal isOpen={forgotOpen} onClose={() => setForgotOpen(false)} />}
            </AnimatePresence>
        </div>
    );
}

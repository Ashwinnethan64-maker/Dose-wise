import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Trash2, Bell, BellOff, Moon, Sun, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../utils/theme';
import useProfile from '../hooks/useProfile';
import { useToast } from '../components/ui/Toast';
import AnimatedPage from '../components/ui/AnimatedPage';
import GlassCard from '../components/ui/GlassCard';
import PrimaryButton from '../components/ui/PrimaryButton';
import SectionHeader from '../components/ui/SectionHeader';

/* Google badge SVG */
function GoogleBadge() {
    return (
        <span className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-semibold px-3 py-1 rounded-full"
            style={{ background: 'var(--color-badge-bg)', color: 'var(--color-text)' }}>
            <svg width="14" height="14" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
            </svg>
            Google Account
        </span>
    );
}

export default function Profile() {
    const { user } = useAuth();
    const { theme, isDark, toggleTheme } = useTheme();
    const { profile, updateProfile, setAvatar, removeAvatar } = useProfile();
    const { addToast } = useToast();
    const fileInputRef = useRef(null);

    const [displayName, setDisplayName] = useState(profile.displayName || user?.name || '');
    const [notificationsEnabled, setNotificationsEnabled] = useState(profile.notificationsEnabled);

    const handleAvatarUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setAvatar(reader.result);
        reader.readAsDataURL(file);
    };

    const handleRemoveAvatar = () => {
        removeAvatar();
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSave = () => {
        updateProfile({ displayName, notificationsEnabled, theme });
        addToast('Profile saved successfully ✅', 'success');
    };

    return (
        <AnimatedPage className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
            <SectionHeader title="Profile Settings" subtitle="Manage your account preferences" icon={<User size={24} />} />

            {/* Avatar Card */}
            <GlassCard padding="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
                    <div className="relative shrink-0 group">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary-300 shadow-md flex items-center justify-center"
                            style={{ background: 'var(--color-badge-bg)' }}>
                            {(profile.avatar || user?.avatar) ? (
                                <img src={profile.avatar || user?.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User size={64} className="text-primary-500" />
                            )}
                        </div>
                        {/* Hover Overlay with clean badge buttons */}
                        <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-11 h-11 bg-white text-primary-600 rounded-xl hover:bg-primary-50 transition-transform active:scale-95 shadow-md flex items-center justify-center shrink-0"
                                title="Upload photo"
                                aria-label="Upload avatar"
                            >
                                <Camera size={22} />
                            </button>
                            {profile.avatar && (
                                <button
                                    onClick={handleRemoveAvatar}
                                    className="w-11 h-11 bg-white text-medical-danger rounded-xl hover:bg-red-50 transition-transform active:scale-95 shadow-md flex items-center justify-center shrink-0"
                                    title="Remove photo"
                                    aria-label="Remove avatar"
                                >
                                    <Trash2 size={22} />
                                </button>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg font-bold themed-text">{displayName || user?.name || 'User'}</h3>
                        <p className="text-sm themed-text-muted opacity-75 mt-0.5">{user?.email || 'user@example.com'}</p>
                        {user?.provider === 'google' && <GoogleBadge />}
                        {user?.provider === 'email' && (
                            <span className="inline-flex items-center gap-1 mt-2.5 text-[11px] font-semibold px-3 py-1 rounded-full"
                                style={{ background: 'var(--color-badge-bg)', color: 'var(--color-text)' }}>
                                ✉️ Email Account
                            </span>
                        )}
                    </div>
                </div>
            </GlassCard>

            {/* Personal Info */}
            <GlassCard padding="p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold themed-text mb-4 sm:mb-5 flex items-center gap-2">
                    Personal Information
                </h3>
                <div className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider themed-text-muted mb-1.5 sm:mb-2">Display Name</label>
                        <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Your name..."
                            className="w-full px-4 py-2.5 sm:py-3 rounded-xl themed-input outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider themed-text-muted mb-1.5 sm:mb-2">Email</label>
                        <input type="email" value={user?.email || ''} disabled
                            className="w-full px-4 py-2.5 sm:py-3 rounded-xl themed-input outline-none text-sm cursor-not-allowed opacity-60" />
                        <p className="text-xs themed-text-muted mt-1.5 opacity-60">Email cannot be changed</p>
                    </div>
                </div>
            </GlassCard>

            {/* Preferences */}
            <GlassCard padding="p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold themed-text mb-4 sm:mb-5">Preferences</h3>
                <div className="space-y-3 sm:space-y-4">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl themed-pref-row gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            {isDark ? <Moon size={20} className="text-primary-500 shrink-0" /> : <Sun size={20} className="text-primary-500 shrink-0" />}
                            <div className="min-w-0">
                                <p className="font-semibold themed-text text-sm sm:text-base truncate">Theme</p>
                                <p className="text-xs sm:text-sm themed-text-muted opacity-75 truncate">{isDark ? 'Dark mode active' : 'Light mode active'}</p>
                            </div>
                        </div>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={toggleTheme}
                            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 flex items-center shrink-0 cursor-pointer ${isDark ? 'bg-primary-500' : 'bg-gray-200'}`}
                            aria-label="Toggle theme">
                            <motion.div animate={{ x: isDark ? 20 : 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className="w-5 h-5 bg-white rounded-full shadow-sm shrink-0" />
                        </motion.button>
                    </div>

                    {/* Notifications Toggle */}
                    <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl themed-pref-row gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            {notificationsEnabled ? <Bell size={20} className="text-primary-500 shrink-0" /> : <BellOff size={20} className="themed-text-muted shrink-0" />}
                            <div className="min-w-0">
                                <p className="font-semibold themed-text text-sm sm:text-base truncate">Notifications</p>
                                <p className="text-xs sm:text-sm themed-text-muted opacity-75 truncate">{notificationsEnabled ? 'Medication reminders active' : 'Reminders disabled'}</p>
                            </div>
                        </div>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
                            const next = !notificationsEnabled;
                            setNotificationsEnabled(next);
                            addToast(next ? 'Reminders enabled 🔔' : 'Reminders disabled 🔕', next ? 'success' : 'info');
                        }}
                            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 flex items-center shrink-0 cursor-pointer ${notificationsEnabled ? 'bg-primary-500' : 'bg-gray-200'}`}
                            aria-label="Toggle notifications">
                            <motion.div animate={{ x: notificationsEnabled ? 20 : 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className="w-5 h-5 bg-white rounded-full shadow-sm shrink-0" />
                        </motion.button>
                    </div>
                </div>
            </GlassCard>

            {/* Save */}
            <div className="flex justify-end pt-2">
                <PrimaryButton onClick={handleSave} icon={<Save size={16} />} size="md">
                    Save Changes
                </PrimaryButton>
            </div>
        </AnimatedPage>
    );
}

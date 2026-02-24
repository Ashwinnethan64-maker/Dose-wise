import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Trash2, Bell, BellOff, Moon, Sun, Save } from 'lucide-react';
import { useAuth } from '../utils/auth';
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
        <AnimatedPage className="space-y-6 max-w-2xl mx-auto">
            <SectionHeader title="Profile Settings" subtitle="Manage your account preferences" icon={<User size={24} />} />

            {/* Avatar Card */}
            <GlassCard>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-2xl overflow-hidden border-3 border-primary-200 flex items-center justify-center"
                            style={{ background: 'var(--color-badge-bg)' }}>
                            {profile.avatar ? (
                                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User size={48} className="text-primary-400" />
                            )}
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => fileInputRef.current?.click()}
                                className="p-2 bg-white/90 rounded-xl hover:bg-white transition-colors" title="Upload photo">
                                <Camera size={18} className="text-primary-600" />
                            </motion.button>
                            {profile.avatar && (
                                <motion.button whileTap={{ scale: 0.9 }} onClick={handleRemoveAvatar}
                                    className="p-2 bg-white/90 rounded-xl hover:bg-white transition-colors" title="Remove photo">
                                    <Trash2 size={18} className="text-medical-danger" />
                                </motion.button>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-elder-lg font-bold themed-text">{displayName || user?.name || 'User'}</h3>
                        <p className="text-sm themed-text-muted">{user?.email || 'user@example.com'}</p>
                        {user?.provider === 'google' && <GoogleBadge />}
                        {user?.provider === 'email' && (
                            <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                                style={{ background: 'var(--color-badge-bg)', color: 'var(--color-text)' }}>
                                ✉️ Email Account
                            </span>
                        )}
                    </div>
                </div>
            </GlassCard>

            {/* Personal Info */}
            <GlassCard>
                <h3 className="text-elder-base font-bold themed-text mb-4">Personal Information</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold themed-text mb-1.5">Display Name</label>
                        <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Your name..."
                            className="w-full px-4 py-3 rounded-xl themed-input outline-none text-elder-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold themed-text mb-1.5">Email</label>
                        <input type="email" value={user?.email || ''} disabled
                            className="w-full px-4 py-3 rounded-xl themed-input outline-none text-elder-sm cursor-not-allowed opacity-60" />
                        <p className="text-[11px] themed-text-muted mt-1">Email cannot be changed</p>
                    </div>
                </div>
            </GlassCard>

            {/* Preferences */}
            <GlassCard>
                <h3 className="text-elder-base font-bold themed-text mb-4">Preferences</h3>
                <div className="space-y-4">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl themed-pref-row">
                        <div className="flex items-center gap-3">
                            {isDark ? <Moon size={20} className="text-primary-500" /> : <Sun size={20} className="text-primary-500" />}
                            <div>
                                <p className="font-semibold themed-text text-sm">Theme</p>
                                <p className="text-xs themed-text-muted">{isDark ? 'Dark mode' : 'Light mode'}</p>
                            </div>
                        </div>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTheme}
                            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${isDark ? 'bg-primary-500' : 'bg-gray-300'}`}>
                            <motion.div animate={{ x: isDark ? 24 : 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className="w-6 h-6 bg-white rounded-full shadow-sm" />
                        </motion.button>
                    </div>

                    {/* Notifications Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl themed-pref-row">
                        <div className="flex items-center gap-3">
                            {notificationsEnabled ? <Bell size={20} className="text-primary-500" /> : <BellOff size={20} className="themed-text-muted" />}
                            <div>
                                <p className="font-semibold themed-text text-sm">Notifications</p>
                                <p className="text-xs themed-text-muted">{notificationsEnabled ? 'Medication reminders active' : 'Reminders disabled'}</p>
                            </div>
                        </div>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => {
                            const next = !notificationsEnabled;
                            setNotificationsEnabled(next);
                            addToast(next ? 'Reminders enabled 🔔' : 'Reminders disabled 🔕', next ? 'success' : 'info');
                        }}
                            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${notificationsEnabled ? 'bg-primary-500' : 'bg-gray-300'}`}>
                            <motion.div animate={{ x: notificationsEnabled ? 24 : 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className="w-6 h-6 bg-white rounded-full shadow-sm" />
                        </motion.button>
                    </div>
                </div>
            </GlassCard>

            {/* Save */}
            <div className="flex justify-end">
                <PrimaryButton onClick={handleSave} icon={<Save size={18} />} size="md">
                    Save Changes
                </PrimaryButton>
            </div>
        </AnimatedPage>
    );
}

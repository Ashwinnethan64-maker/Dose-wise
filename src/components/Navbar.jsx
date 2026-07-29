import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../utils/theme';
import useProfile from '../hooks/useProfile';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, ScanLine, Pill, CalendarCheck,
    Users, Bot, LogOut, Menu, X, ShieldCheck, User, Settings, Moon, Sun
} from 'lucide-react';

import DoseWiseLogo from './DoseWiseLogo';

const NAV_ITEMS = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/scan', label: 'Scan Pill', icon: ScanLine },
    { to: '/medications', label: 'My Meds', icon: Pill },
    { to: '/adherence', label: 'Adherence', icon: CalendarCheck },
    { to: '/caregiver', label: 'Caregiver', icon: Users },
    { to: '/assistant', label: 'DoseWise Assistant', icon: Bot },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const { profile } = useProfile();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const handleLogout = () => { logout(); navigate('/login'); setProfileOpen(false); };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const linkClass = ({ isActive }) =>
        `relative flex items-center gap-2.5 px-3.5 py-2.5 sm:py-2 rounded-xl font-semibold text-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${isActive
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-btn'
            : 'themed-text-muted hover:bg-primary-50/30 hover:text-primary-500'
        }`;

    const displayName = profile.displayName || user?.name || 'User';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 themed-navbar border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <NavLink to="/dashboard" className="flex items-center shrink-0 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 rounded-xl py-1 pr-2 min-h-[44px]">
                        <DoseWiseLogo size="md" />
                    </NavLink>

                    {/* Desktop nav */}
                    <div className="hidden xl:flex items-center gap-1">
                        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                            <NavLink key={to} to={to} className={linkClass} end={to === '/dashboard'}>
                                <Icon size={20} strokeWidth={2.2} className="shrink-0" />
                                <span className="whitespace-nowrap">{label}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* Medium nav (lg to xl) - icons with tooltips / shorter text */}
                    <div className="hidden lg:flex xl:hidden items-center gap-1">
                        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={linkClass}
                                end={to === '/dashboard'}
                                title={label}
                            >
                                <Icon size={22} strokeWidth={2.2} className="shrink-0" />
                                <span className="text-xs whitespace-nowrap">{label.split(' ')[0]}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        <div className="hidden md:flex items-center gap-1.5 text-xs text-medical-safe font-semibold bg-green-50/80 px-2.5 py-1.5 rounded-full border border-green-200/60 backdrop-blur-sm shrink-0">
                            <ShieldCheck size={14} className="shrink-0" />
                            <span>Encrypted</span>
                        </div>

                        {/* Theme quick toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-11 h-11 rounded-xl themed-text-muted hover:text-primary-500 transition-colors flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 shrink-0"
                            style={{ background: 'var(--color-pref-row)' }}
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            aria-label="Toggle color theme"
                        >
                            {isDark ? <Sun size={22} className="w-5 h-5" /> : <Moon size={22} className="w-5 h-5" />}
                        </motion.button>

                        {/* Profile avatar + dropdown */}
                        {user && (
                            <div className="relative shrink-0" ref={dropdownRef}>
                                <motion.button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-11 h-11 rounded-xl overflow-hidden border-2 border-primary-300/60 hover:border-primary-500 transition-colors flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 shadow-sm"
                                    style={{ background: 'var(--color-badge-bg)' }}
                                    aria-label="User menu"
                                >
                                    {(profile.avatar || user?.avatar) ? (
                                        <img src={profile.avatar || user?.avatar} alt="Avatar text" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={22} className="text-primary-500 w-5 h-5" />
                                    )}
                                </motion.button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-full mt-2 w-56 rounded-2xl border overflow-hidden themed-dropdown z-50 shadow-xl"
                                        >
                                            <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                                <p className="font-bold text-sm themed-text truncate">{displayName}</p>
                                                <p className="text-xs themed-text-muted truncate">{user.email}</p>
                                            </div>
                                            <div className="py-1.5">
                                                <button onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium themed-text hover:bg-primary-50/20 transition-colors">
                                                    <Settings size={16} className="themed-text-muted" /> Profile Settings
                                                </button>
                                                <button onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-medical-danger hover:bg-red-50/20 transition-colors">
                                                    <LogOut size={16} /> Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Mobile hamburger */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden w-11 h-11 rounded-xl themed-text-muted hover:text-primary-500 transition-colors flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 shrink-0"
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        >
                            {mobileOpen ? <X size={22} className="w-5.5 h-5.5" /> : <Menu size={22} className="w-5.5 h-5.5" />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Full-Screen Mobile Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="fixed inset-0 z-[100] lg:hidden flex flex-col min-h-screen w-screen overflow-hidden"
                        style={{
                            background: 'var(--color-bg)',
                            color: 'var(--color-text)',
                        }}
                    >
                        {/* Safe Top Bar */}
                        <div className="px-4 py-4 flex items-center justify-between border-b shrink-0"
                            style={{
                                borderColor: 'var(--color-border)',
                                paddingTop: 'max(1rem, env(safe-area-inset-top))',
                                background: 'var(--color-surface-solid)',
                            }}
                        >
                            <NavLink to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center shrink-0">
                                <DoseWiseLogo size="md" />
                            </NavLink>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setMobileOpen(false)}
                                className="w-11 h-11 rounded-xl themed-text-muted hover:themed-text transition-colors flex items-center justify-center border shrink-0"
                                style={{ borderColor: 'var(--color-border)', background: 'var(--color-badge-bg)' }}
                                aria-label="Close navigation menu"
                            >
                                <X size={22} />
                            </motion.button>
                        </div>

                        {/* Navigation Body */}
                        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5" style={{ background: 'var(--color-bg)' }}>
                            <p className="text-[11px] font-bold uppercase tracking-wider themed-text-muted mb-3 px-2">Menu</p>
                            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                                <NavLink key={to} to={to} end={to === '/dashboard'} className={({ isActive }) =>
                                    `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-base transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-btn'
                                        : 'themed-text hover:bg-primary-50/20'
                                    }`} onClick={() => setMobileOpen(false)}>
                                    <Icon size={22} className="shrink-0" />
                                    <span>{label}</span>
                                </NavLink>
                            ))}
                        </div>

                        {/* Footer Settings & Logout */}
                        <div className="px-4 py-4 border-t space-y-2.5 shrink-0"
                            style={{
                                borderColor: 'var(--color-border)',
                                paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
                                background: 'var(--color-surface-solid)',
                            }}
                        >
                            <NavLink to="/profile" className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-semibold text-sm themed-text themed-pref-row" onClick={() => setMobileOpen(false)}>
                                <Settings size={20} className="shrink-0 text-primary-500" />
                                <span>Profile Settings</span>
                            </NavLink>

                            <button onClick={() => { toggleTheme(); setMobileOpen(false); }}
                                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-semibold text-sm themed-text themed-pref-row">
                                <div className="flex items-center gap-3.5">
                                    {isDark ? <Sun size={20} className="text-amber-400 shrink-0" /> : <Moon size={20} className="text-primary-500 shrink-0" />}
                                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                                </div>
                                <span className="text-xs themed-text-muted">Switch Theme</span>
                            </button>

                            {user && (
                                <button onClick={handleLogout}
                                    className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-semibold text-sm text-medical-danger hover:bg-red-50/20 transition-colors">
                                    <LogOut size={20} className="shrink-0" />
                                    <span>Logout</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

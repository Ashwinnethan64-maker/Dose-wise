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
        `relative flex items-center gap-2 px-2.5 xl:px-3.5 py-2 rounded-xl font-semibold text-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${isActive
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-btn'
            : 'themed-text-muted hover:bg-primary-50/30 hover:text-primary-500'
        }`;

    const displayName = profile.displayName || user?.name || 'User';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 themed-navbar border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <NavLink to="/dashboard" className="flex items-center shrink-0 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 rounded-xl py-1 pr-2">
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
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="hidden md:flex items-center gap-1.5 text-xs text-medical-safe font-semibold bg-green-50/80 px-2.5 py-1.5 rounded-full border border-green-200/60 backdrop-blur-sm shrink-0">
                            <ShieldCheck size={14} className="shrink-0" />
                            <span>Encrypted</span>
                        </div>

                        {/* Theme quick toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-xl themed-text-muted hover:text-primary-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 shrink-0"
                            style={{ background: 'var(--color-pref-row)' }}
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            aria-label="Toggle color theme"
                        >
                            {isDark ? <Sun size={22} /> : <Moon size={22} />}
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
                                        <User size={24} className="text-primary-500" />
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
                            className="lg:hidden p-2 rounded-xl themed-text-muted hover:text-primary-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 shrink-0"
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:hidden border-t overflow-hidden themed-navbar"
                        style={{ borderColor: 'var(--color-border)' }}
                    >
                        <div className="px-4 py-3 space-y-1">
                            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                                <NavLink key={to} to={to} end={to === '/dashboard'} className={linkClass} onClick={() => setMobileOpen(false)}>
                                    <Icon size={17} /><span className="text-sm">{label}</span>
                                </NavLink>
                            ))}
                            <NavLink to="/profile" className={linkClass} onClick={() => setMobileOpen(false)}>
                                <Settings size={17} /><span className="text-sm">Profile Settings</span>
                            </NavLink>
                            {/* Mobile theme toggle */}
                            <button onClick={toggleTheme}
                                className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold text-sm themed-text-muted hover:text-primary-500 hover:bg-primary-50/30 transition-all">
                                {isDark ? <Sun size={17} /> : <Moon size={17} />}
                                <span className="text-sm">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

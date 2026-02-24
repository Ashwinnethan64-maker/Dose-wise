import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import { useTheme } from '../utils/theme';
import useProfile from '../hooks/useProfile';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, ScanLine, Pill, CalendarCheck,
    Users, Bot, LogOut, Menu, X, ShieldCheck, User, Settings, Moon, Sun
} from 'lucide-react';

const NAV_ITEMS = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
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
        `relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-[0.9rem] transition-all duration-250 ${isActive
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-btn'
            : 'themed-text-muted hover:bg-primary-50/20 hover:text-primary-500'
        }`;

    const displayName = profile.displayName || user?.name || 'User';

    return (
        <nav className="sticky top-0 z-50 themed-navbar border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[4.25rem]">
                    {/* Logo */}
                    <NavLink to="/" className="flex items-center gap-2.5 shrink-0 group">
                        <motion.div whileHover={{ rotate: 8, scale: 1.08 }}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-btn">
                            <span className="text-white text-lg">💊</span>
                        </motion.div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold themed-text leading-none">DoseWise</span>
                            <span className="text-primary-500 text-xl font-bold"> AI</span>
                        </div>
                    </NavLink>

                    {/* Desktop nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                            <NavLink key={to} to={to} className={linkClass} end={to === '/'}>
                                <Icon size={17} strokeWidth={2.2} /><span>{label}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2.5">
                        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-medical-safe font-semibold bg-green-50/80 px-3 py-1.5 rounded-full border border-green-200/60 backdrop-blur-sm">
                            <ShieldCheck size={13} />Encrypted
                        </div>

                        {/* Theme quick toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="hidden sm:flex p-2 rounded-xl themed-text-muted transition-colors"
                            style={{ background: 'var(--color-pref-row)' }}
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </motion.button>

                        {/* Profile avatar + dropdown */}
                        {user && (
                            <div className="relative" ref={dropdownRef}>
                                <motion.button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-9 h-9 rounded-xl overflow-hidden border-2 border-primary-200 hover:border-primary-400 transition-colors flex items-center justify-center"
                                    style={{ background: 'var(--color-badge-bg)' }}
                                >
                                    {profile.avatar ? (
                                        <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={18} className="text-primary-500" />
                                    )}
                                </motion.button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-full mt-2 w-56 rounded-2xl border overflow-hidden themed-dropdown"
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
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden p-2 rounded-xl themed-text transition-colors">
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
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
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:hidden border-t overflow-hidden themed-navbar"
                        style={{ borderColor: 'var(--color-border)' }}
                    >
                        <div className="px-4 py-3 space-y-1">
                            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                                <NavLink key={to} to={to} end={to === '/'} className={linkClass} onClick={() => setMobileOpen(false)}>
                                    <Icon size={20} /><span className="text-elder-sm">{label}</span>
                                </NavLink>
                            ))}
                            <NavLink to="/profile" className={linkClass} onClick={() => setMobileOpen(false)}>
                                <Settings size={20} /><span className="text-elder-sm">Profile Settings</span>
                            </NavLink>
                            {/* Mobile theme toggle */}
                            <button onClick={toggleTheme}
                                className="w-full flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-[0.9rem] themed-text-muted transition-all">
                                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                                <span className="text-elder-sm">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

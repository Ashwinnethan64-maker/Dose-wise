import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../utils/theme';
import useProfile from '../hooks/useProfile';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import {
    LayoutDashboard, ScanLine, Pill, CalendarCheck,
    Users, Bot, LogOut, Menu, X, ShieldCheck, User, Settings, Moon, Sun, Check, ChevronDown
} from 'lucide-react';

import DoseWiseLogo from './DoseWiseLogo';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const { user, logout } = useAuth();
    const { profile } = useProfile();
    const { isDark, toggleTheme } = useTheme();
    const { language, setLanguage, t, TRANSLATIONS } = useLanguage();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const langRef = useRef(null);

    const navItems = [
        { to: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
        { to: '/scan', label: t('navScanPill'), icon: ScanLine },
        { to: '/medications', label: t('navMyMeds'), icon: Pill },
        { to: '/adherence', label: t('navAdherence'), icon: CalendarCheck },
        { to: '/caregiver', label: t('navCaregiver'), icon: Users },
        { to: '/assistant', label: t('navAssistant'), icon: Bot },
    ];

    const handleLogout = () => { logout(); navigate('/login'); setProfileOpen(false); };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileOpen(false);
            if (langRef.current && !langRef.current.contains(e.target)) setLangDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const linkClass = ({ isActive }) =>
        `relative flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3 py-2 rounded-xl font-semibold text-xs xl:text-sm transition-all duration-200 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${isActive
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-btn'
            : 'themed-text-muted hover:bg-primary-50/30 hover:text-primary-500'
        }`;

    const displayName = profile.displayName || user?.name || 'User';
    const currentLangObj = TRANSLATIONS[language] || TRANSLATIONS.en;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 themed-navbar border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                <div className="flex items-center justify-between h-16 gap-2">
                    {/* Logo */}
                    <NavLink to="/dashboard" className="flex items-center shrink-0 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 rounded-xl py-1 pr-1 sm:pr-2 min-h-[44px]">
                        <DoseWiseLogo size="md" />
                    </NavLink>

                    {/* Desktop nav (lg and above) - Flexible container with shrink-0 links */}
                    <div className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 min-w-0 overflow-x-auto scrollbar-none py-1">
                        {navItems.map(({ to, label, icon: Icon }) => (
                            <NavLink key={to} to={to} className={linkClass} end={to === '/dashboard'}>
                                <Icon size={18} strokeWidth={2.2} className="shrink-0" />
                                <span className="whitespace-nowrap truncate">{label}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* Right side controls - ALWAYS visible and NEVER clipped */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto lg:ml-0">
                        {/* Encrypted Badge — forced light green, immune to dark mode */}
                        <div className="hidden md:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border shadow-sm shrink-0 transition-all"
                            style={{ background: '#d1fae5', color: '#065f46', borderColor: '#6ee7b7' }}>
                            <ShieldCheck size={15} className="shrink-0" style={{ color: '#059669' }} />
                            <span className="whitespace-nowrap">{t('encrypted')}</span>
                        </div>

                        {/* Global Language Selector Dropdown */}
                        <div className="relative shrink-0" ref={langRef}>
                            <motion.button
                                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="h-10 sm:h-11 px-2.5 sm:px-3 rounded-xl themed-text-muted hover:text-primary-500 transition-colors flex items-center gap-1.5 text-xs font-bold border shrink-0 min-w-[40px] justify-center"
                                style={{ background: 'var(--color-pref-row)', borderColor: 'var(--color-border)' }}
                                title="Change Language / भाषा / ಭಾಷೆ"
                                aria-label="Select Language"
                            >
                                <span className="text-sm">{currentLangObj.flag}</span>
                                <span className="hidden sm:inline-block font-semibold max-w-[80px] truncate">{currentLangObj.languageName.split(' ')[0]}</span>
                                <ChevronDown size={14} className={`opacity-60 transition-transform shrink-0 ${langDropdownOpen ? 'rotate-180' : ''}`} />
                            </motion.button>

                            <AnimatePresence>
                                {langDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-2 w-48 sm:w-52 rounded-2xl border overflow-hidden themed-dropdown z-50 shadow-xl py-1"
                                    >
                                        <p className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider themed-text-muted border-b" style={{ borderColor: 'var(--color-border)' }}>
                                            {t('selectLanguage')}
                                        </p>
                                        {Object.keys(TRANSLATIONS).map((langKey) => {
                                            const item = TRANSLATIONS[langKey];
                                            const isSelected = language === langKey;
                                            return (
                                                <button
                                                    key={langKey}
                                                    onClick={() => {
                                                        setLanguage(langKey);
                                                        setLangDropdownOpen(false);
                                                    }}
                                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-left transition-colors ${
                                                        isSelected
                                                            ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold'
                                                            : 'themed-text hover:bg-primary-50/20'
                                                    }`}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <span>{item.flag}</span>
                                                        <span>{item.languageName}</span>
                                                    </span>
                                                    {isSelected && <Check size={14} className="text-primary-500 shrink-0" />}
                                                </button>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Theme Toggle Button */}
                        <motion.button
                            onClick={toggleTheme}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl themed-text-muted hover:text-primary-500 transition-colors flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 shrink-0"
                            style={{ background: 'var(--color-pref-row)' }}
                            title={isDark ? t('lightMode') : t('darkMode')}
                            aria-label={t('switchTheme')}
                        >
                            {isDark ? <Sun size={20} className="w-5 h-5 text-amber-400" /> : <Moon size={20} className="w-5 h-5 text-primary-500" />}
                        </motion.button>

                        {/* Profile avatar + dropdown */}
                        {user && (
                            <div className="relative shrink-0" ref={dropdownRef}>
                                <motion.button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border-2 border-primary-300/60 hover:border-primary-500 transition-colors flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 shadow-sm shrink-0"
                                    style={{ background: 'var(--color-badge-bg)' }}
                                    aria-label="User menu"
                                >
                                    {(profile.avatar || user?.avatar) ? (
                                        <img src={profile.avatar || user?.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={20} className="text-primary-500 w-5 h-5" />
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
                                                    <Settings size={16} className="themed-text-muted shrink-0" /> {t('profileSettings')}
                                                </button>
                                                <button onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-medical-danger hover:bg-red-50/20 transition-colors">
                                                    <LogOut size={16} className="shrink-0" /> {t('logout')}
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
                            className="lg:hidden w-10 h-10 sm:w-11 sm:h-11 rounded-xl themed-text-muted hover:text-primary-500 transition-colors flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 shrink-0"
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
                            <p className="text-[11px] font-bold uppercase tracking-wider themed-text-muted mb-3 px-2">{t('menu')}</p>
                            {navItems.map(({ to, label, icon: Icon }) => (
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
                                <span>{t('profileSettings')}</span>
                            </NavLink>

                            {/* Language switcher in mobile menu */}
                            <div className="px-1 pb-1">
                                <p className="text-[10px] font-bold uppercase tracking-wider themed-text-muted mb-2 px-3">{t('selectLanguage')}</p>
                                <div className="flex gap-2">
                                    {Object.keys(TRANSLATIONS).map((langKey) => {
                                        const item = TRANSLATIONS[langKey];
                                        const isSelected = language === langKey;
                                        return (
                                            <button
                                                key={langKey}
                                                onClick={() => { setLanguage(langKey); }}
                                                className={`flex-1 flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                                                    isSelected
                                                        ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400'
                                                        : 'border-transparent themed-text-muted hover:bg-primary-50/20'
                                                }`}
                                            >
                                                <span className="text-lg">{item.flag}</span>
                                                <span className="text-[10px]">{langKey.toUpperCase()}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button onClick={() => { toggleTheme(); setMobileOpen(false); }}
                                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-semibold text-sm themed-text themed-pref-row">
                                <div className="flex items-center gap-3.5">
                                    {isDark ? <Sun size={20} className="text-amber-400 shrink-0" /> : <Moon size={20} className="text-primary-500 shrink-0" />}
                                    <span>{isDark ? t('lightMode') : t('darkMode')}</span>
                                </div>
                                <span className="text-xs themed-text-muted">{t('switchTheme')}</span>
                            </button>

                            {user && (
                                <button onClick={handleLogout}
                                    className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-semibold text-sm text-medical-danger hover:bg-red-50/20 transition-colors">
                                    <LogOut size={20} className="shrink-0" />
                                    <span>{t('logout')}</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

import { createContext, useContext, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ThemeContext = createContext(null);

/**
 * ThemeProvider — Global light/dark theme system.
 * Sets data-theme attribute on <html> element.
 */
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useLocalStorage('dosewise_theme', 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, [setTheme]);

    const setThemeValue = useCallback((value) => {
        setTheme(value);
    }, [setTheme]);

    const isDark = theme === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme: setThemeValue }}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * useTheme — Access global theme state.
 */
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}

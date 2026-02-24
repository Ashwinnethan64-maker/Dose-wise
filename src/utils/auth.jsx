import { createContext, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = createContext(null);

/**
 * AuthProvider — Mock authentication context.
 * Stores auth state in localStorage. No real backend.
 * Supports email/password and Google auth (simulation).
 *
 * Structure ready for later integration:
 *   <GoogleAuthProvider client_id="REPLACE_WITH_CLIENT_ID" />
 */
/**
 * parseJwt — Helper to decode Google JWT without external libraries.
 */
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT:", e);
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useLocalStorage('authUser', null);

    const login = useCallback(
        (email, password) => {
            if (email && password) {
                setUser({ email, name: email.split('@')[0], loggedInAt: new Date().toISOString(), provider: 'email' });
                return true;
            }
            return false;
        },
        [setUser]
    );

    /**
     * loginWithGoogle — accepts GIS credential (JWT).
     */
    const loginWithGoogle = useCallback((credential) => {
        const payload = parseJwt(credential);
        if (!payload) return false;

        setUser({
            email: payload.email,
            name: payload.name,
            avatar: payload.picture,
            loggedInAt: new Date().toISOString(),
            provider: 'google',
        });
        return true;
    }, [setUser]);

    const logout = useCallback(() => {
        setUser(null);
        // Clear Google session if needed
        if (window.google?.accounts?.id) {
            window.google.accounts.id.disableAutoSelect();
        }
    }, [setUser]);

    const updateUser = useCallback((updates) => {
        setUser((prev) => prev ? { ...prev, ...updates } : prev);
    }, [setUser]);

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, updateUser, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

import { createContext, useState, useEffect, useCallback } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { getStoredSession, saveSession, clearSession, parseGoogleCredential } from '../services/authService';

export const AuthContext = createContext(null);

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '320692214347-2oli9tn3ginc0eseiucqunr90o76badt.apps.googleusercontent.com';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize session on mount
    useEffect(() => {
        try {
            const restoredUser = getStoredSession();
            if (restoredUser) {
                setUser(restoredUser);
            }
        } catch (err) {
            console.error('Failed to restore auth session:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Standard email/password login fallback
    const login = useCallback((email, password) => {
        if (email && password) {
            const newUser = {
                id: `user_${Date.now()}`,
                name: email.split('@')[0],
                email,
                avatar: '',
                provider: 'email',
                loggedInAt: new Date().toISOString(),
            };
            setUser(newUser);
            saveSession(newUser);
            return true;
        }
        return false;
    }, []);

    // Google Sign-in token/credential processing
    const loginWithGoogleToken = useCallback((credential) => {
        const parsedUser = parseGoogleCredential(credential);
        if (parsedUser) {
            setUser(parsedUser);
            saveSession(parsedUser);
            return parsedUser;
        }
        return null;
    }, []);

    // Legacy method signature compatibility
    const loginWithGoogle = useCallback((payload) => {
        if (!payload) return false;
        const formattedUser = {
            id: payload.id || payload.sub || `google_${Date.now()}`,
            name: payload.name || 'Google User',
            email: payload.email || '',
            avatar: payload.picture || payload.avatar || '',
            provider: 'google',
            loggedInAt: new Date().toISOString(),
        };
        setUser(formattedUser);
        saveSession(formattedUser);
        return true;
    }, []);

    // Logout action
    const logout = useCallback(() => {
        setUser(null);
        clearSession();
    }, []);

    // Update profile info locally
    const updateUser = useCallback((updates) => {
        setUser((prev) => {
            if (!prev) return prev;
            const updated = { ...prev, ...updates };
            saveSession(updated);
            return updated;
        });
    }, []);

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        loginWithGoogleToken,
        loginWithGoogle,
        logout,
        updateUser,
    };

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    );
}

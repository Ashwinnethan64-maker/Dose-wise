import { jwtDecode } from 'jwt-decode';

const STORAGE_KEY = 'dosewise_auth_session';

/**
 * Safely parse a Google JWT Credential string or payload object
 * @param {string|object} credential 
 * @returns {object|null} Standardized User Object
 */
export function parseGoogleCredential(credential) {
    if (!credential) return null;

    try {
        let decoded = {};
        if (typeof credential === 'string') {
            decoded = jwtDecode(credential);
        } else if (typeof credential === 'object') {
            decoded = credential;
        }

        const user = {
            id: decoded.sub || decoded.id || `google_${Date.now()}`,
            name: decoded.name || decoded.given_name || 'Google User',
            email: decoded.email || '',
            avatar: decoded.picture || decoded.avatar || '',
            provider: 'google',
            token: typeof credential === 'string' ? credential : null,
            expiresAt: decoded.exp ? decoded.exp * 1000 : Date.now() + 7 * 24 * 60 * 60 * 1000,
            loggedInAt: new Date().toISOString(),
        };

        return user;
    } catch (error) {
        console.error('Error decoding Google ID token:', error);
        return null;
    }
}

/**
 * Save user session to local storage
 */
export function saveSession(user) {
    if (!user) {
        clearSession();
        return;
    }
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        // Keep legacy key synced for compatibility with existing components
        localStorage.setItem('authUser', JSON.stringify(user));
        localStorage.setItem('dosewise_user', JSON.stringify(user));
    } catch (e) {
        console.error('Failed to save auth session to localStorage:', e);
    }
}

/**
 * Retrieve & validate stored user session
 */
export function getStoredSession() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('authUser') || localStorage.getItem('dosewise_user');
        if (!raw) return null;

        const user = JSON.parse(raw);
        if (!user) return null;

        // Check token expiration if expiresAt is present
        if (user.expiresAt && Date.now() > user.expiresAt) {
            console.warn('User session expired. Clearing session...');
            clearSession();
            return null;
        }

        return user;
    } catch (e) {
        console.error('Error reading auth session:', e);
        clearSession();
        return null;
    }
}

/**
 * Clear stored user session
 */
export function clearSession() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('authUser');
        localStorage.removeItem('dosewise_user');
    } catch (e) {
        console.error('Failed to clear auth session:', e);
    }

    // Disable Google auto-select / revoke if GSI script is loaded
    if (window.google?.accounts?.id) {
        try {
            window.google.accounts.id.disableAutoSelect();
        } catch (e) {
            // Ignore GSI cleanup errors
        }
    }
}

import useLocalStorage from './useLocalStorage';

/**
 * useProfile — Manages user profile (avatar, name, theme, notifications) in localStorage.
 */
export default function useProfile() {
    const [profile, setProfile] = useLocalStorage('dosewise_profile', {
        avatar: '',
        displayName: '',
        theme: 'light',
        notificationsEnabled: true,
    });

    const updateProfile = (updates) => {
        setProfile((prev) => ({ ...prev, ...updates }));
    };

    const setAvatar = (dataUrl) => {
        updateProfile({ avatar: dataUrl });
    };

    const removeAvatar = () => {
        updateProfile({ avatar: '' });
    };

    return { profile, updateProfile, setAvatar, removeAvatar };
}

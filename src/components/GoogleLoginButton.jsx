import { useState } from 'react';
import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ui/Toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

/**
 * Modern SVG Google Icon
 */
function GoogleIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
    );
}

export default function GoogleLoginButton({ onSuccessCallback, className = '' }) {
    const { t } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { loginWithGoogleToken } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        setIsSubmitting(true);
        try {
            let user = null;

            if (credentialResponse.credential) {
                user = loginWithGoogleToken(credentialResponse.credential);
            } else if (credentialResponse.access_token) {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${credentialResponse.access_token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch user profile from Google');
                const userInfo = await res.json();
                user = loginWithGoogleToken(userInfo);
            }

            if (user) {
                addToast(t('googleSignInSuccess'), 'success');
                if (onSuccessCallback) {
                    onSuccessCallback(user);
                } else {
                    navigate('/dashboard');
                }
            } else {
                throw new Error('Could not process authentication response');
            }
        } catch (error) {
            console.error('Google Auth Processing Error:', error);
            addToast(error.message || t('googleSignInFail'), 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleError = (error) => {
        console.error('Google Auth Error:', error);
        setIsSubmitting(false);
        if (error?.error === 'popup_closed_by_user') {
            addToast('Sign in cancelled', 'info');
        } else {
            addToast(t('googleSignInFail'), 'error');
        }
    };

    const customPopupLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => handleSuccess(tokenResponse),
        onError: (errorResponse) => handleError(errorResponse),
        flow: 'implicit',
    });

    return (
        <div className={`w-full flex flex-col items-center gap-3 ${className}`}>
            <motion.button
                type="button"
                onClick={() => {
                    setIsSubmitting(true);
                    customPopupLogin();
                }}
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className={`w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border font-semibold text-sm transition-all duration-200 shadow-sm ${
                    isSubmitting
                        ? 'opacity-70 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-300'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
                }`}
            >
                {isSubmitting ? (
                    <>
                        <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin shrink-0" />
                        <span>Signing you in...</span>
                    </>
                ) : (
                    <>
                        <GoogleIcon className="w-5 h-5 shrink-0" />
                        <span>Continue with Google</span>
                    </>
                )}
            </motion.button>

            <div className="hidden">
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => handleError({ error: 'gis_error' })}
                    useOneTap={false}
                />
            </div>
        </div>
    );
}

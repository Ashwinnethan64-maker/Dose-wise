import { useEffect, useRef } from 'react';

export default function GoogleAuth({ onSuccess }) {
    const buttonRef = useRef(null);

    useEffect(() => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

        if (!clientId) {
            console.error('Google Client ID is missing from environment variables.');
            return;
        }

        const initializeGoogleSignIn = () => {
            if (window.google?.accounts?.id) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                });

                window.google.accounts.id.renderButton(
                    buttonRef.current,
                    { theme: 'outline', size: 'large', type: 'standard', shape: 'pill', width: '320px' }
                );
            } else {
                console.error('Google script failed to load or initialize.');
            }
        };

        // If the script is already loaded
        if (window.google?.accounts?.id) {
            initializeGoogleSignIn();
        } else {
            // Wait for it to load
            const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
            if (script) {
                script.addEventListener('load', initializeGoogleSignIn);
            }
        }
        
    }, [onSuccess]);

    const handleCredentialResponse = (response) => {
        try {
            // JWT format: header.payload.signature
            const payload = response.credential.split('.')[1];
            const decodedPayload = JSON.parse(atob(payload));

            const userData = {
                id: decodedPayload.sub,
                name: decodedPayload.name,
                email: decodedPayload.email,
                avatar: decodedPayload.picture,
                provider: 'google',
            };
            
            console.log('Google Auth User:', userData);
            
            // Store minimal info locally if needed
            localStorage.setItem('dosewise_user', JSON.stringify(userData));

            if (onSuccess) {
                onSuccess(userData);
            }
        } catch (error) {
            console.error('Error decoding Google response:', error);
        }
    };

    return (
        <div className="flex justify-center w-full my-4">
            <div ref={buttonRef} id="googleBtn"></div>
        </div>
    );
}

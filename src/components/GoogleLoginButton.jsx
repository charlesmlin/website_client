import { useEffect } from 'react';
import scriptLoader from '../utils/ScriptLoader';

// GIS is used here for Google Authentication as only user identity is needed, and not needing to call Google API on behalf of user
const GoogleLoginButton = ({ clientId, onSuccess }) => {
  const setupGoogleAuth = async () => {
    await scriptLoader.loadScript('https://accounts.google.com/gsi/client');

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      auto_select: true,
    });

    window.google.accounts.id.renderButton(
      document.getElementById('google-login-button'),
      { theme: 'outline', size: 'medium', type: 'icon', shape: 'circle' }
    );

    // Enable one tap sign-in
    window.google.accounts.id.prompt();
  };

  useEffect(() => {
    setupGoogleAuth();
  }, [clientId]);

  const handleCredentialResponse = (response) => {
    if (response.error) {
      console.error('Authentication error:', response.error);
      return;
    }

    const credential = response.credential;
    onSuccess?.(credential);
  };

  return <div id='google-login-button'></div>;
};

export default GoogleLoginButton;

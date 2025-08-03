import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function PlaidOAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      if (window.parent.Plaid) {
        window.parent.Plaid.oauth({
          token: localStorage.getItem('plaidLinkToken'),
          receivedRedirectUri: window.location.href,
        });
      } else {
        throw new Error('Plaid not initialized');
      }
    } catch (err) {
      console.error('OAuth error:', err);
      navigate('/plaid', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing bank connection...</p>
      </div>
    </div>
  );
}

export default PlaidOAuthRedirect;
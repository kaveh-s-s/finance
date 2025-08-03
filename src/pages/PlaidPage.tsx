import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

function PlaidPage() {
  const [linkToken, setLinkToken] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [handler, setHandler] = useState<any>(null);
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  const isOAuthRedirect = window.location.href.includes('oauth_state_id');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
    script.async = true;
    script.onload = () => {
      if (window.Plaid && linkToken) {
        initializePlaid(linkToken);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (window.Plaid && linkToken) {
      initializePlaid(linkToken);
    }
  }, [linkToken]);

  const exchangePublicToken = async (publicToken: string) => {
    try {
      const response = await fetch('https://localhost:5000/exchange-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token: publicToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange token');
      }

      const data = await response.json();
      setAccessToken(data.access_token);
    } catch (err) {
      console.error('Error exchanging public token:', err);
      setError('Failed to exchange public token for access token');
    }
  };

  const initializePlaid = (token: string) => {
    try {
      // Clear any old handler
      if (handler) {
        handler.destroy();
      }

      const newHandler = window.Plaid.create({
        token: token,
        ...(isOAuthRedirect ? { receivedRedirectUri: window.location.href } : {}),
        onSuccess: async (public_token: string, metadata: any) => {
          console.log('Public Token:', public_token);
          console.log('Metadata:', metadata);
          setPublicToken(public_token);
          setMetadata(metadata);
          await exchangePublicToken(public_token);
        },
        onExit: (err: any, metadata: any) => {
          console.log('User exited', err, metadata);
          if (err) {
            setError(err.message || 'An error occurred while connecting to your bank');
          }
        },
        onEvent: (eventName: string, metadata: any) => {
          console.log('Event:', eventName, metadata);
        },
      });
      setHandler(newHandler);

      if (isOAuthRedirect) {
        console.log('OAuth detected: auto-opening Plaid Link...');
        newHandler.open();
      }
    } catch (e: any) {
      setError('Error initializing Plaid: ' + e.message);
    }
  };

  const handleConnect = () => {
    if (!linkToken) {
      setError('Please enter a link token first.');
      return;
    }

    if (handler) {
      handler.open();
    } else {
      initializePlaid(linkToken);
      handler?.open();
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Connect Your Bank Account
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plaid Link Token
              </label>
              <input
                type="text"
                value={linkToken}
                onChange={(e) => setLinkToken(e.target.value)}
                placeholder="Enter your Plaid link token"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleConnect}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              {isOAuthRedirect ? 'Resume Connection' : 'Connect your Bank'}
            </button>

            {publicToken && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="text-lg font-medium text-green-800 mb-2">Connection Successful!</h3>
                <div className="space-y-2">
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Public Token:</span> {publicToken}
                  </p>
                  {accessToken && (
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Access Token:</span> {accessToken}
                    </p>
                  )}
                  {metadata && (
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Institution:</span> {metadata.institution?.name}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

declare global {
  interface Window {
    Plaid: any;
  }
}

export default PlaidPage;
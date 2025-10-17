import { useEffect } from 'react';
import { Linking } from 'react-native';
import { supabase } from './supabase';

/**
 * Deep Linking Handler for OAuth Callbacks
 * Handles both custom scheme (parapluie://) and universal links (https://parapluie.app)
 */

export const useDeepLinkHandler = (
  onAuthSuccess: (userId: string) => void,
  onAuthError: (error: Error) => void
) => {
  useEffect(() => {
    // Handle deep link when app is already open
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event;
      console.log('Deep link received:', url);

      // Check if it's an auth callback
      if (url.includes('auth/callback')) {
        try {
          // Supabase automatically handles the OAuth callback
          // We just need to get the session after the redirect
          const { data: { session }, error } = await supabase.auth.getSession();

          if (error) throw error;

          if (session?.user) {
            console.log('Auth successful, user:', session.user.id);
            onAuthSuccess(session.user.id);
          } else {
            throw new Error('No session found after OAuth callback');
          }
        } catch (error) {
          console.error('Deep link auth error:', error);
          onAuthError(error as Error);
        }
      }
    };

    // Listen for deep links while app is open
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if app was opened via deep link (when app was closed)
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial URL:', url);
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [onAuthSuccess, onAuthError]);
};

/**
 * Set up Supabase auth state listener
 * This handles OAuth redirects automatically
 */
export const setupAuthListener = (
  onAuthChange: (userId: string | null) => void
) => {
  // Listen for auth state changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (event === 'SIGNED_IN' && session?.user) {
        onAuthChange(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        onAuthChange(null);
      }
    }
  );

  return subscription;
};

/**
 * Helper to open OAuth flow
 * Call this when user taps "Sign in with Google/Apple"
 */
export const initiateOAuthFlow = async (
  provider: 'google' | 'apple'
): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // Use custom scheme for mobile app
        redirectTo: 'parapluie://auth/callback',
        // Don't skip browser redirect - we need the OAuth flow
        skipBrowserRedirect: false,
      },
    });

    if (error) throw error;

    // The OAuth flow will open in browser/system UI
    // User will be redirected back to app via deep link
    console.log('OAuth flow initiated:', data);
  } catch (error) {
    console.error('OAuth flow error:', error);
    throw error;
  }
};

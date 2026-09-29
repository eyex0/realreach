import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setClerkTokenProvider } from '../lib/api';

/**
 * Connects Clerk's session token to the API client so every backend call
 * carries `Authorization: Bearer …` (Stage 9 hardening).
 */
export const TokenBridge: React.FC = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    setClerkTokenProvider(() => getToken());
    return () => setClerkTokenProvider(null);
  }, [getToken]);

  return null;
};

export default TokenBridge;

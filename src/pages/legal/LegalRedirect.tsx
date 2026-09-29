import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const LEGACY_TYPE_MAP: Record<string, string> = {
  terms: '/legal/terms',
  privacy: '/legal/privacy',
  'community-clients': '/legal/community-clients',
  'community-distributors': '/legal/community-distributors',
};

// Backwards compatibility for the old /legal/:type URLs.
export const LegalRedirect: React.FC = () => {
  const { type = 'terms' } = useParams<{ type: string }>();
  return <Navigate to={LEGACY_TYPE_MAP[type] ?? '/legal/terms'} replace />;
};

export default LegalRedirect;

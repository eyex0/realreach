import React from 'react';
import { LegalLayout } from './LegalLayout';
import { TermsContent } from '../../components/TermsContent';

export const TermsPage: React.FC = () => {
  return (
    <LegalLayout title="Terms and Conditions">
      <TermsContent variant="page" />
    </LegalLayout>
  );
};

export default TermsPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { LegalLayout } from './LegalLayout';

export const CommunityClientsPage: React.FC = () => {
  return (
    <LegalLayout title="Community Guidelines (Clients & Agencies)">
      <section>
        <h2 className="text-xl font-bold text-[#0a0a0b]">1. Post Accurate Runs</h2>
        <p>
          Publish only accurate, current and complete campaign information — distribution areas,
          deadlines, quantities and materials. Confirm your flyer content complies with applicable
          law and does not direct Distributors to breach access or distribution rules.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-[#0a0a0b]">2. Review Completions Promptly</h2>
        <p>
          Acknowledge a Distributor&apos;s completion notice or raise a dispute within the acceptance
          window. If you engage a Minor, comply with applicable minor-employment laws and safeguards
          — never request unsafe or prohibited activities.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-[#0a0a0b]">3. Keep It On-Platform</h2>
        <p>
          All payments and communications must stay on the Platform. Fraudulent, misleading or
          off-Platform circumvention breaches the{' '}
          <Link to="/legal/terms" className="font-semibold underline">
            Terms and Conditions
          </Link>{' '}
          and may lead to suspension.
        </p>
      </section>
    </LegalLayout>
  );
};

export default CommunityClientsPage;

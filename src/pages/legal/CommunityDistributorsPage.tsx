import React from 'react';
import { Link } from 'react-router-dom';
import { LegalLayout } from './LegalLayout';

export const CommunityDistributorsPage: React.FC = () => {
  return (
    <LegalLayout title="Community Guidelines (Distributors & Walkers)">
      <section>
        <h2 className="text-xl font-bold text-[#0a0a0b]">1. Deliver With Care</h2>
        <p>
          Perform every Run with due care and skill, following the agreed area and instructions.
          Respect all mailboxes marked &ldquo;No Pubblicit&agrave;&rdquo; or &ldquo;Niente
          Volantini&rdquo;, local access restrictions, and keep the GPS tracking app active for the
          full route so your work is verified.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-[#0a0a0b]">2. Be Reliable</h2>
        <p>
          Only accept Runs you can complete, confirm completion honestly via the Platform, and
          communicate promptly if conditions become unsafe. Hold all required licences, permits and
          insurance for your work.
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

export default CommunityDistributorsPage;

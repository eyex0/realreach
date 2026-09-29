import React from 'react';
import { LegalLayout } from './LegalLayout';

export const PrivacyPage: React.FC = () => {
  return (
    <LegalLayout title="Privacy Policy (GDPR Compliance)">
      <section>
        <h2 className="text-xl font-bold text-[#0a0a0b]">1. Data We Collect</h2>
        <p>
          Realreach processes client and distributor data in full compliance with the European Union
          General Data Protection Regulation (GDPR) 2016/679. This includes account details (name,
          email, phone, billing information), campaign data, and GPS tracking coordinates collected
          during delivery runs.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-[#0a0a0b]">2. How We Use Location Data</h2>
        <p>
          GPS tracking coordinates are retained solely for delivery auditing and proof-of-performance
          purposes, and are kept only as long as reasonably necessary before being de-identified or
          deleted. Users must not export or share GPS data outside the Platform except as permitted
          by the Terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-[#0a0a0b]">3. Your Rights</h2>
        <p>
          You may request access, rectification, erasure, restriction or portability of your personal
          data at any time by contacting us. For full details of retention periods, safeguards for
          minors, and data sharing, see clause 16 of the Terms and Conditions.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-[#0a0a0b]">4. Contact Information</h2>
        <p>
          For privacy inquiries, contact:
          <br />
          <strong>Realreach S.r.l. - Ufficio Legale</strong>
          <br />
          Via Monte Napoleone 8, 20121 Milano (MI), Italy
          <br />
          Email: legal@realreach.it
        </p>
      </section>
    </LegalLayout>
  );
};

export default PrivacyPage;

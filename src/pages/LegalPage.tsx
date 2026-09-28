import React from 'react';
import { useParams, Link } from 'react-router-dom';

export const LegalPage: React.FC = () => {
  const { type = 'terms' } = useParams<{ type: string }>();

  const titles: Record<string, string> = {
    terms: 'Terms and Conditions',
    privacy: 'Privacy Policy (GDPR Compliance)',
    'community-clients': 'Community Guidelines (Clients & Agencies)',
    'community-distributors': 'Community Guidelines (Distributors & Walkers)',
  };

  const title = titles[type] || 'Legal Information';

  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-5 sm:px-6">
        <div className="mb-8">
          <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-black">
            &larr; Back to REALREACH Home
          </Link>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#0a0a0b] tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Last revised: September 2026 &bull; REALREACH S.r.l., Milan, Italy
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm sm:text-base leading-relaxed border-t border-slate-200 pt-8">
          <section>
            <h2 className="text-xl font-bold text-[#0a0a0b]">1. Overview &amp; Acceptance</h2>
            <p>
              These terms govern the use of the REALREACH flyer distribution platform, operated by REALREACH S.r.l. (P.IVA IT 12849300965), registered in Milan, Italy. By creating a campaign or applying as a walker, you agree to these conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a0a0b]">2. GPS Verification &amp; Money-Back Guarantee</h2>
            <p>
              Every letterbox run booked through REALREACH is subject to automated GPS tracking. We guarantee that runners visit the designated streets within your selected zone. In the unlikely event that GPS telemetry reveals an incomplete run, REALREACH will re-deliver or issue a complete refund.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a0a0b]">3. Milan Regulations &amp; 'No Pubblicità' Respect</h2>
            <p>
              In compliance with local Italian regulations and municipal ordinances, distributors are strictly instructed to respect mailboxes marked with "No Pubblicità" or "Niente Volantini". Unaddressed promotional literature will only be placed in designated residential letterboxes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a0a0b]">4. Data Protection (GDPR)</h2>
            <p>
              REALREACH processes client and distributor data in full compliance with European Union General Data Protection Regulation (GDPR) 2016/679. GPS tracking coordinates are retained solely for delivery auditing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0a0a0b]">5. Contact Information</h2>
            <p>
              For legal inquiries, contact:
              <br />
              <strong>REALREACH S.r.l. - Ufficio Legale</strong>
              <br />
              Via Monte Napoleone 8, 20121 Milano (MI), Italy
              <br />
              Email: legal@realreach.it
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;

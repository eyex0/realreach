import React from 'react';

// NOTE: Legal text supplied by the business (adapted from the Realrun AU
// draft to the Realreach S.r.l. entity, Italian law, EUR and GDPR).
// This file is business-supplied content, not legal advice. Any future legal
// review should edit this single component — it renders in both the signup
// TermsModal and the /legal/terms page.

interface TermsContentProps {
  variant: 'modal' | 'page';
}

export const TermsContent: React.FC<TermsContentProps> = ({ variant }) => {
  const h = variant === 'modal' ? 'text-sm' : 'text-xl';
  const sub = variant === 'modal' ? 'text-xs' : 'text-sm';

  return (
    <div className="space-y-5 leading-relaxed">
      <p className="font-medium text-slate-900">
        Realreach operates an online platform to facilitate letterbox delivery
        service agreements between Clients and Distributors.
      </p>
      <p>
        These Terms and Conditions (Terms) constitute a legally binding
        agreement between Realreach S.r.l. (P.IVA IT 12849300965) (Realreach,
        we, our or us) and each person (User or you) who accesses or uses the
        Realreach website located at www.realreach.it, the Realreach mobile
        application or any associated services, tools or features
        (collectively, the Platform). By accessing or using the Platform you
        acknowledge that you have read, understood and agree to be bound by
        these Terms, our Privacy Policy and any other Policies we publish from
        time to time (Policies), which are incorporated by reference into
        these Terms. If you do not agree, you must immediately cease using the
        Platform.
      </p>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>1. Amendment of Terms</h4>
        <p>1.1 We reserve the right to amend these Terms or the Policies at any time in our discretion by publishing an updated version on the Platform. Except for changes required by law, we will endeavour to provide at least 30 days&apos; notice of material amendments via email or by notice through the Platform (Amendment Notice).</p>
        <p>1.2 Details of the amendments will be provided to you for review via the Amendment Notice. The next time you log in to the Platform you will be prompted to review and agree to the updated Terms.</p>
        <p>1.3 From the date an Amendment Notice is sent, you will be prompted to actively agree to the updated Terms (e.g. by clicking &ldquo;I Accept&rdquo;) each time you log in to or use the Platform. Your acceptance occurs when you actively agree or by continuing to use the Platform in any manner after the effective date of any Amendment Notice. Otherwise, amendments are automatically effective 30 days after the date of the relevant Amendment Notice.</p>
        <p>1.4 If you do not accept an amendment, you must stop using the Platform, notify us accordingly and terminate your account in accordance with clause 5.6.</p>
        <p>1.5 We reserve the right, without notice and at our sole discretion, to change, suspend, discontinue or impose limits on any aspect or content of this Platform or the products or services offered through it, acting reasonably and subject to applicable law.</p>
        <p>1.6 You may only vary these Terms by written agreement with us.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>2. Nature of the Platform and Realreach Services</h4>
        <p>2.1 Realreach operates an online marketplace (the Platform) that enables Clients to publish Runs and Distributors to accept Runs and perform the associated Flyer Distribution Services under the applicable Distribution Contract between a Client and the Distributor. We are not a party to any Distribution Contract.</p>
        <p>2.2 Realreach does not employ or engage Distributors, guarantee their performance or supervise the manner in which Flyer Distribution Services are performed. Users are responsible for compliance with all applicable laws, including workplace, safety and local distribution regulations. Users must comply with all applicable Policies (including the Community Guidelines) when using the Platform and in relation to any Run.</p>
        <p>2.3 We may provide certain Users with (and Users may accept) the Realreach Services in return for the Realreach Services Fee.</p>
        <p>2.4 While we may facilitate the posting and management of a Run (processing payments, providing dispute resolution tools), we do not endorse, guarantee or control any User or any Flyer Distribution Services.</p>
        <p>2.5 Nothing in these Terms creates any agency, partnership, joint venture, employment or similar relationship, except as expressly provided in clause 6.13 (limited payment collection agency). Administrative actions taken by a Linked Guardian are facilitative only and do not create any employment or similar relationship between Realreach and any parent, guardian or Authorised User. No User has authority to bind Realreach.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>3. Distribution Contract</h4>
        <p>3.1 An offer is created when a Client posts a Run. Distributors may (but are under no obligation to) accept a Run. A Client may cancel or modify a Run at any time before a Distributor accepts it. If the Distributor is a Minor, a Distribution Contract only forms if: (a) Realreach has recorded and verified the parent&apos;s or legal guardian&apos;s identity, relationship, consent and guarantees in the Minor&apos;s account (Guardian Consent); (b) that parent/guardian has electronically agreed via the Platform to provide the Client Guarantee and the Realreach Guarantee; and (c) Realreach is satisfied the Run complies with applicable laws on the employment of minors and any Under-18 Safeguards. Realreach may refuse, suspend or cancel any Run involving a Minor if these prerequisites are not met. When a Distributor accepts a Run, a contract (a Distribution Contract) separate from these Terms is formed exclusively between the Client and the Distributor.</p>
        <p>3.2 Upon creation of a Distribution Contract and subject to clause 6: the Client must pay the Run Price to the Distributor; the Distributor must perform the Flyer Distribution Services in accordance with the Community Guidelines and these Terms; and Realreach is deemed to have rendered the Realreach Services — to the Client when the Client publishes the Run (Platform Fee earned) and to the Distributor when the Distributor accepts the Run (Distributor Service Fee earned).</p>
        <p className={sub}>3.3 Once the Distributor confirms completion via the Platform, Realreach will verify completion acting reasonably (including by reviewing GPS tracking data) and make a completion determination. The Client will be prompted to acknowledge completion or raise a dispute under clause 15 within the acceptance window. For a Minor, the Linked Guardian may submit the completion notice or respond to queries or disputes on the Minor&apos;s behalf. Following the completion determination (subject to disputes or verification holds), Realreach will instruct the Payment Provider to release the Run Price to the Distributor&apos;s Payment Account. Where invoiced billing terms apply, release occurs after cleared funds are received from the Client unless Realreach elects to advance payment. If the Client does not act within the acceptance window, the Run is deemed accepted and the Run Price may be released. If neither party acts within 30 days and Realreach is not satisfied the Run was completed, the Run may be cancelled and the Run Price returned to the Client (subject to Fees and amounts due for work commenced).</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>4. Registration and Account Security</h4>
        <p>4.1 Only persons and entities capable of contracting under applicable law may hold an account. A Minor may register and use the Platform only as a Distributor where Guardian Consent has been provided and verified, the parent/guardian has electronically agreed to the Client Guarantee and the Realreach Guarantee, and the Minor and Client comply with applicable laws on the employment of minors and the Under-18 Safeguards. Clients must be over 18 or entities capable of contracting. By creating an account you represent you meet these requirements.</p>
        <p>4.2 A Client may establish an organisation-level account (Organisation Account) and permit natural persons to use it as authorised representatives (Authorised Users). The Organisation is responsible for ensuring only Authorised Users access the account, for all acts and omissions of its Authorised Users, and for all Fees incurred through the account. Realreach may rely on any instruction given by an Authorised User.</p>
        <p>4.3 Where a Distributor is a Minor, Realreach will capture and record the Linked Guardian&apos;s identity, relationship, consent and guarantees within the Minor&apos;s account. The Linked Guardian may, subject to Platform controls, view limited safety/administration information, submit or confirm completion, respond to disputes and manage payout nominations for the Minor&apos;s benefit. Realreach may suspend or limit the account where verification is unsatisfactory.</p>
        <p>4.4 You are responsible for maintaining the security of your credentials. We may assume any person using your credentials is you or your authorised representative (for Organisation Accounts, an Authorised User; for Minors, the recorded Linked Guardian acting via Platform controls). Notify us immediately of any suspected unauthorised use.</p>
        <p className={sub}>4.5 To register you must provide a valid email address, telephone number, accurate billing and contact details, and any other information requested — including, for Minors, Guardian Consent and information needed to assess compliance with minor-employment laws (age, residence, school status, permits), and for Organisation Accounts the legal name, VAT/fiscal identifiers, registered office and administrator/billing contact details. You must keep this information accurate and warrant it is true and not misleading.</p>
        <p>4.6 Other than as permitted under clauses 4.2 and 4.3, one person may not maintain more than one account; accounts opened by bots or automated methods are not permitted. You must maintain control of your account, must not transfer or sell it, and remain liable for all amounts incurred on it. Linked Guardians must act in the Minor&apos;s best interests.</p>
        <p>4.7 We reserve the right to accept or reject any registration application.</p>
        <p>4.8 Realreach may suspend, limit or cancel a Minor&apos;s account or any Run if Guardian Consent cannot be verified or is withdrawn, the Linked Guardian&apos;s identity or guarantees cannot be verified, there is non-compliance with minor-employment laws or safeguards, or a Client attempts to engage a Minor for an unsafe or unsuitable Run. Additional limits (hours, curfews, breaks, prohibited locations or methods) may be imposed.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>5. User Obligations</h4>
        <p>5.1 Each User must comply with these Terms, any applicable Distribution Contract, the Policies and all applicable laws; post only accurate, current and complete information; hold required licences, permits, insurances and authorisations; not engage in fraudulent, misleading, defamatory, offensive or illegal conduct; and not circumvent the Platform by soliciting or accepting off-Platform payment for transactions initiated via the Platform for 6 months after first contact, unless expressly permitted in writing. Organisations are responsible for their Users&apos; conduct; Linked Guardians supervise their Minor&apos;s use.</p>
        <p>5.2 Distributors must be qualified and legally entitled to work where the services are performed. For Minors, the parties must comply with minor-employment laws and safeguards; Clients must not require unsafe or prohibited activities (including driving, entering private property beyond an accessible letterbox, or delivering during prohibited hours) and must accommodate required supervision and breaks.</p>
        <p>5.3 Users must respect local distribution laws and signage (including &ldquo;No Pubblicità&rdquo; / &ldquo;No Junk Mail&rdquo;) and access restrictions, and comply with all tax and regulatory obligations.</p>
        <p>5.4 A Distributor may subcontract only with the Client&apos;s prior written consent, only to a subcontractor who is a User, and only under a separate Distribution Contract with that Client.</p>
        <p>5.5 If Realreach determines (acting reasonably) you breached this clause, it may suspend or terminate your access, remove Runs you submitted, or remove/block objectionable material.</p>
        <p>5.6 You may terminate your account at any time via account settings or written notice. Termination does not affect accrued rights; clauses 6, 8, 11, 12, 14, 15, 17 and 18 survive.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>6. Payments</h4>
        <p>6.1 Realreach will instruct the Payment Provider to transfer the Run Price from the Client&apos;s Payment Account (or the settlement account, where invoiced billing terms apply) to the Distributor&apos;s Payment Account, the Platform Fee to Realreach, and the Distributor Service Fee to Realreach. For Minors, the Run Price may be directed to the Minor&apos;s Payment Account or to an account nominated by the Linked Guardian for the Minor&apos;s benefit, and Fees owed by a Minor may be collected from such a nominated account.</p>
        <p>6.2 Payments may be made by credit/debit card, bank transfer, or invoice on invoiced billing terms offered by Realreach to eligible Clients. All payment obligations must be discharged through the Platform or the Payment Provider; off-Platform payments do not satisfy them.</p>
        <p>6.3 Where invoiced billing terms apply: Realreach accepts invoice payment from the Client; payment is due within the invoice timeframe; Realreach may suspend access or Runs, withhold fund releases or amend terms if amounts are overdue or risk thresholds are exceeded; reasonable fees or interest may be charged on overdue amounts to the extent permitted by law; invoices may be addressed to and consolidated at Organisation level, and the Organisation is liable for amounts incurred by its Authorised Users. An Organisation&apos;s nominated billing contact may give payment-method instructions Realreach may rely on.</p>
        <p>6.4 Realreach uses a third-party payment provider (Payment Provider, currently Stripe) for secure transactions. Payments via the provider are subject to the provider&apos;s own terms and privacy policy (see https://stripe.com/legal), which prevail over these Terms for payment processing in case of inconsistency. We do not see card data beyond what is needed under clause 4.5.</p>
        <p>6.5 Some non-domestic cards may not be accepted. Additional card transaction fees may apply.</p>
        <p className={sub}>6.6 For upfront bank transfer, Realreach will instruct the Payment Provider to provide payment instructions or proof of payment. For invoiced Clients, Realreach issues a tax invoice upon publishing a Run (or as soon as practicable). Invoice disputes must be notified in writing within 5 Business Days with reasonable particulars, failing which the invoice is accepted; undisputed amounts are due by the due date. Overdue amounts may bear interest at 5% per annum above the European Central Bank main refinancing rate, calculated monthly. Realreach need not release the Run Price until cleared funds are received, but may advance funds at its discretion.</p>
        <p>6.7 Except as required by mandatory law, amounts paid through the Platform are non-refundable.</p>
        <p>6.8 Payments are processed per the Distribution Contract, these Terms or applicable Policies (including payout cycles). Invoiced Runs are paid to Distributors as soon as reasonably practicable after cleared funds arrive, subject to disputes and verification holds; Realreach may advance payment following its completion determination.</p>
        <p>6.9 Outstanding amounts may be set off against payments due to a User (including at Organisation level, or against a Minor&apos;s or guardian-nominated account).</p>
        <p>6.10 Users whose information is misused by third parties bear that risk; Realreach may request identification for fraud/anti-money-laundering checks, and payments may be withheld or cancelled (with refund) if checks are not completed.</p>
        <p className={sub}>6.11 For each Distribution Contract entered into by a Minor, the Linked Guardian unconditionally and irrevocably guarantees as principal debtor the Minor&apos;s payment and performance obligations to the Client (Client Guarantee); and guarantees to Realreach all of the Minor&apos;s obligations under these Terms and Policies (Realreach Guarantee). On default, the Linked Guardian must pay without demand and bears reasonable recovery costs to the extent permitted by law. Each guarantee is continuing, unaffected by variation, waiver, release or the Minor turning 18, and covers obligations that would otherwise be void for incapacity. Electronic acceptance is effective; the Client and Realreach may each enforce their guarantee directly.</p>
        <p>6.12 All fees are in euros and VAT-inclusive unless expressly stated otherwise.</p>
        <p>6.13 Amounts paid to Realreach or the Payment Provider are not held on trust or in escrow unless required by law. Each Distributor appoints Realreach or the Payment Provider as its limited payment collection agent solely to accept the Run Price from the Client and instruct disbursement. No interest is paid on held amounts. The agency is limited to collection and disbursement and creates no fiduciary or custodial relationship; the Platform is not a financial product or remittance service.</p>
        <p>6.14–6.15 New services and Fee changes are notified per clause 1; Fees for a new service apply from launch.</p>
        <p>6.16–6.17 Realreach issues tax invoices for Fees and, for invoiced Clients, for the Run Price. The Client and Distributor are responsible for VAT on the Run Price. Where Realreach pays the Distributor it may issue self-billed (reverse-charge compliant) invoices under a written agreement meeting tax authority requirements; the Distributor must not invoice Realreach for covered supplies. Each party handles its own VAT compliance.</p>
        <p className={sub}>6.18 Realreach may, as limited payment collection agent and to the extent permitted or required by law, instruct the Payment Provider to deduct or withhold sums it reasonably determines are required (taxes or statutory amounts, chargebacks, refunds, reconciliation or fee adjustments). Payees must promptly provide exemption documentation before the payment date; valid documentation will be applied. Receipts or proof of withholding are provided as required by law. Amounts properly withheld are not owed to the payee.</p>
        <p className={sub}>6.19 Realreach may recover from a Distributor any regulatory cost amount actually incurred in connection with that Distributor&apos;s Runs (such as employer-style statutory imposts required by law), by deduction from payouts or invoice for any balance, after providing an itemised statement of basis and calculation. Recovery is lawful and proportionate only, and creates no employment relationship.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>7. Refunds and Variations</h4>
        <p>7.1 If a Distribution Contract is varied or cancelled: agreed variations (documented in writing, with guardian consent where a Minor is involved; sham variations to circumvent these Terms are void) authorise Realreach to increase the Run Price and Fees or to refund a pro-rata share; Realreach may charge an Administrative Fee. Cancellation within 24 hours of formation → pro-rata refund subject to completion status, plus possible Cancellation Fee; cancellation after 24 hours → pro-rata refund plus possible Administrative and Cancellation Fees. Where invoiced funds have not cleared, Realreach cancels or adjusts the invoice instead of refunding.</p>
        <p>7.2–7.3 Cancellation Fees and Administrative Fees are payable by the Distributor if attributable to the Distributor, or by the Client if attributable to the Client.</p>
        <p>7.4 Cancellation and Administrative Fees are VAT-exclusive unless stated otherwise and represent a genuine pre-estimate of Realreach&apos;s costs.</p>
        <p>7.5 Such fees are debts owed to Realreach and may be set off under clause 6.9.</p>
        <p className={sub}>7.6 Cancellation is attributable to the Distributor where the Client cancels after unsuccessful attempts to contact the Distributor, the Distributor cancels, or cancellation under clause 5.5 results from the Distributor&apos;s conduct. 7.7 Cancellation is attributable to the Client where the Client cancels (other than under 7.6), cancellation under clause 5.5 results from the Client&apos;s conduct, or a Run is automatically cancelled through the Client&apos;s inaction.</p>
        <p>7.8 Additional termination fees agreed between the parties must be claimed directly between them.</p>
        <p>7.9 Refunds (less applicable Fees) are returned within 7 days as cash or Realreach Credits at the User&apos;s election, subject to banking delays.</p>
        <p>7.10–7.11 If the Run Price cannot be transferred or claimed, it is retained up to three months (Retention Period) for received funds only; unclaimed retained funds are then credited to the Client as cash or Realreach Credits at the User&apos;s discretion.</p>
        <p>7.12 Where work was at least 80% complete or Community Guidelines were breached, Realreach may refund a fair apportionment by reference to verified delivery percentage and Policy evidence standards, and may waive its fees.</p>
        <p>7.13–7.14 Repeated cancellations may lead to suspension. Determinations under this clause are made in good faith and reasonably on available information.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>8. Realreach Credits</h4>
        <p>8.1 Realreach Credits may be used for eligible Realreach or Flyer Distribution Services; are not refundable or redeemable for cash without written consent; cannot be sold, transferred or reloaded without consent; expire 3 years after issue if purchased for value (or on the notified date for promotional credits) unless law requires otherwise; must not be reproduced or published; and are not legal tender, deposits or financial products and bear no interest.</p>
        <p>8.2 The credited User is responsible for their security; Realreach has no liability for loss and no replacement obligation, subject to mandatory law.</p>
        <p>8.3 Credits used in breach, forged, issued in error or involving suspected unlawful conduct may be refused or cancelled, and suspected fraud may be reported to law enforcement.</p>
        <p>8.4–8.6 Realreach is entitled to unredeemed expired or cancelled value subject to law; issue terms may be amended prospectively per clause 1; if the services are cancelled or materially changed, unexpired credits are dealt with as required by law (refund, replacement or alternative remedy).</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>9. Identity Verification</h4>
        <p>9.1–9.4 Realreach may use Identity Verification Services to verify User information. They depend on User-supplied and third-party data and may not be fully accurate or current; Users rely on them at their own risk and Realreach gives no warranty, subject to mandatory law. Issue terms may be modified per clause 1.</p>
        <p>9.5 The Platform may include User-initiated feedback to evaluate Users. Feedback is Users&apos; opinions, not Realreach verification or endorsement; Realreach may moderate or remove breaching feedback but is not obliged to.</p>
        <p>9.6–9.10 Realreach may issue Badges evidencing skills/capabilities for a Fee, conditional on information, documentation or third-party assessment. Badges are not endorsements or warranties, are valid only at issue, and Relying Users must make their own inquiries. Distributors must keep Badge information accurate and current. Issuance and display are discretionary; Badges are Platform-only and may be withheld or removed for breach, falsity, expiry, misuse or legal request.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>10. Insurance</h4>
        <p>10.1–10.2 Insurance offered via the Platform is a Third Party Service governed by the insurer&apos;s terms; the insurer is solely responsible. Each User must assess its own needs, obtain and maintain sufficient cover at its own cost, and is encouraged to seek advice.</p>
        <p>10.3–10.4 Users must supply copies of policies and premium evidence on request, comply with policy terms, and promptly notify Realreach of lapse, cancellation, non-renewal or material change.</p>
        <p>10.5–10.6 Realreach may hold its own insurance (Realreach Insurance) and change it at any time. Users are not covered under it and have no recourse to it.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>11. Disclaimers</h4>
        <p>11.1 Except for mandatory-law rights, Realreach and its representatives disclaim all express or implied conditions, representations and warranties for the Platform and anything obtained through it.</p>
        <p>11.2 The Platform is provided &ldquo;as is&rdquo;. Except for mandatory-law rights, no representation is made that use will be secure, timely, uninterrupted or error-free, will meet requirements, that content is reliable or current, that purchased quality will meet expectations, that defects will be corrected, or that the Platform is free of harmful components.</p>
        <p>11.3 We are not responsible for Users&apos; acts or omissions, including failure to perform Distribution Contracts or the truth of User information (Distributors&apos; ability, Clients&apos; honesty or ability to pay).</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>12. Limitation of Liability</h4>
        <p>12.1 Our liability (if any) is owed only to you, not to related parties or representatives.</p>
        <p>12.2 Nothing restricts mandatory-law rights. For breach of such a right, our liability is limited at our option to re-supply (or payment of re-supply cost) of services, or replacement/repair (or payment thereof) of products.</p>
        <p>12.3 To the maximum extent permitted by law, Realreach is not liable for indirect or consequential loss, or loss connected with use of the Platform, Distribution Contracts, Realreach Services, Third Party Services, unauthorised account access, or telecom/systems failures. Realreach acts reasonably when suspending, withholding or delaying payments.</p>
        <p>12.4 Subject to clause 12.1, aggregate liability for any Claim is limited to the greater of the Run Price of the relevant Run and EUR 100.</p>
        <p>12.5 Use of the Platform is at your discretion and risk. You release Realreach and its representatives, licensors, partners and affiliates from Claims arising from these Terms or Platform use, and indemnify them against Claims (including reasonable legal fees) caused by or connected with your breach or use, except to the extent caused by our negligence or wrongdoing.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>13. Force Majeure</h4>
        <p>We are not liable for delay or failure caused by circumstances beyond our reasonable control, including natural disasters, government acts, war, civil unrest, labour shortages or supply chain disruptions.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>14. Indemnity</h4>
        <p>You indemnify Realreach and our officers, employees, agents and contractors against liability, loss, damage, cost or expense (including reasonable legal fees) arising from your breach of these Terms, Policies or Distribution Contracts, your violation of law or third-party rights, your use of the Platform (including dispute resolution), your User Content, or Claims connected with your acts or omissions, except to the extent caused by our negligence or wrongdoing.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>15. Disputes</h4>
        <p>15.1 Parties to any dispute (including payment, refund or breach Claims) must first attempt good-faith direct negotiation, using best endeavours to agree within 14 days. Realreach has no obligation to involve itself but may do so.</p>
        <p>15.2 If unresolved, either party may refer the dispute to Realreach, which may investigate, request information, facilitate communications and make a determination acting reasonably; may instruct the Payment Provider to deduct, withhold, release or refund the Run Price pending resolution; and the parties must cooperate. For Minors, Realreach may liaise with the Linked Guardian.</p>
        <p>15.3 Realreach&apos;s determination is final for Platform administration (including Payment Account management) but does not limit court or mediation rights.</p>
        <p>15.4 Realreach may disclose reasonably necessary information to the other party; recipients must use it solely for the dispute, keep it confidential, and indemnify Realreach for misuse.</p>
        <p>15.5–15.6 If unresolved 7 days after Realreach&apos;s determination (or its decision not to determine), either party may refer the dispute to mediation in Milan under applicable Italian mediation rules (Legislative Decree No. 28/2010), by videoconference or where the mediator directs. Mediation costs are shared equally absent written direction otherwise; each party bears its own legal costs.</p>
        <p>15.7 Except for urgent injunctive relief, no court proceedings may commence until clauses 15.1–15.5 are complied with. Statutory rights to approach authorities are unaffected.</p>
        <p>15.8–15.9 Participation does not waive legal rights. This clause survives termination of these Terms and any Distribution Contract.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>16. Privacy and Data Protection</h4>
        <p>16.1 We collect, use and disclose Personal Information per Regulation (EU) 2016/679 (GDPR), applicable Italian law and our Privacy Policy. For Minors we seek and record verified guardian consent, collect only minimum necessary data, apply enhanced safeguards (stricter access controls, shorter retention of GPS and activity logs, restricted sharing), and cease/delete on consent withdrawal subject to legal obligations. Limited Personal Information may be shared within an Organisation Account for administration, billing and support, and between a Minor&apos;s account and the Linked Guardian contact for safety, verification, administration, disputes and payments.</p>
        <p>16.2 The Platform uses location/map functionality. GPS/location data and activity logs may be collected for proof of delivery, safety, fraud prevention and dispute resolution per the Privacy Policy, retained only as reasonably necessary and then de-identified or deleted. Users must not export or share GPS data outside the Platform except as permitted. For Minors, collection is limited to proof of delivery and safety, hidden from other Users except as needed to administer a Run, with shorter retention and extra access controls.</p>
        <p>16.3–16.6 Where you provide another individual&apos;s Personal Information you warrant authorisation and prior notice of our Privacy Policy. Use Platform-obtained Personal Information only to fulfil the Run or as permitted by law. Marketing requires consent as required by applicable e-privacy and anti-spam rules.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>17. Third Party Services</h4>
        <p>17.1–17.2 Third parties may advertise services and upload content via the Platform. We act as no agent, verify no third-party material, and assume no liability for objectionable content, third-party information, or resulting loss. Linked sites and ads are at your risk under their own terms.</p>
        <p>17.3–17.4 Realreach does not verify, control, endorse or warrant Third Party Services or suppliers, nor advise on their quality or suitability. The supplier (not Realreach) supplies the goods/services and is solely responsible for them.</p>
        <p>17.5 Orders form contracts solely between you and the supplier under the supplier&apos;s terms (including refunds/returns/cancellation). Review them before ordering; suppliers undertake to us to comply with applicable law but we hold no such undertaking on your behalf.</p>
        <p>17.6–17.7 Platform payments are non-refundable as between you and us; supplier refunds are the supplier&apos;s responsibility to be pursued directly. Interactions with suppliers are yours alone; we may take disciplinary action at our discretion but do not act for either side in disputes.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>18. Intellectual Property</h4>
        <p>18.1 We and our licensors own all Platform intellectual property, including look and feel, text, icons, scripts, graphics and logos. Nothing grants you any right other than the limited licence to access and use the Platform; no use without prior written consent.</p>
        <p>18.2 By uploading User Content you grant Realreach a non-exclusive, royalty-free, worldwide, sub-licensable licence to use, reproduce, modify and communicate it to operate, improve and promote the Platform. You warrant rights to grant this and that content is lawful and non-infringing, and consent to acts that might otherwise infringe your moral rights to the extent permitted by law.</p>
        <p>18.3 Copyright complaints should be sent in writing identifying the works and infringement. We notify the provider, who has 14 days to deny in writing; absent denial we remove or block the material. On denial we forward the response; absent court action by the complainant within a further 14 days we may restore the material, otherwise it stays removed pending resolution.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>19. General</h4>
        <p>19.1 Notices: we may notify by email to your account address or Platform posting; you may notify us at support@realreach.it or any published replacement. For Organisation Accounts, notice to the administrator/billing contact is notice to the Organisation; for Minors, notice to the Linked Guardian contact is notice to the Minor. Email notices are deemed received 12 hours after sending (absent bounce); post 3 Business Days after posting; Platform notices when published.</p>
        <p>19.2–19.4 Each party bears its own costs except as stated. Realreach may assign these Terms without notice or consent; you remain bound. These Terms are the entire agreement on their subject matter.</p>
        <p>19.5 Nothing restricts mandatory-law rights; in case of inconsistency these Terms are read subject to applicable law.</p>
        <p>19.6–19.7 Waivers must be signed writing and are limited to their terms; failure to act on a breach does not waive future action. Provisions are severable; illegal or unenforceable provisions are removed and the rest enforced.</p>
        <p>19.8 These Terms are governed by the laws of Italy. Each party submits to the exclusive jurisdiction of the courts of Milan, Italy and courts of appeal therefrom.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>20. Definitions and Interpretation</h4>
        <p className={sub}>Administrative Fee — portion of the Run Price determined by Realreach on cancellation. Amendment Notice — clause 1.1 notice. Authorised Users — clause 4.2 representatives. Badge — clause 9.6 badge. Business Day — day banks are open for general business where the User&apos;s account is used, excluding weekends and public holidays. Cancellation Fee — the Platform Fee (Client-attributable) or an equal amount (Distributor-attributable). Claim — any claim, demand or proceedings in contract, tort, statute or otherwise. Client — User engaging Distributors. Client Guarantee — clause 6.11 guardian guarantee. Consequential Loss — indirect loss including lost opportunity, goodwill, profits, data or equipment value. Distribution Contract — Client–Distributor services contract (model terms in Schedule 1). Distributor — User providing services. Distributor Service Fee — fee displayed pre-acceptance. Fees — Administrative, Cancellation and Realreach Services Fees. Flyer Distribution Services — delivery of flyers, brochures and similar materials to letterboxes or designated locations per a Run. Guardian Consent — verified parent/guardian consent recorded in a Minor&apos;s account. Linked Guardian — verified parent/guardian recorded in a Minor&apos;s account. Minor — User under 18. Organisation / Organisation Account — clause 4.2 Client account. Payment Account — User-nominated payment instrument or provider settlement account. Payment Provider — Stripe or any appointed authorised provider acting on Realreach&apos;s instructions. Platform Fee — Client fee displayed pre-contract. Policies / Privacy Policy / Community Guidelines — as published. Realreach Credits — clause 8 credits. Realreach Guarantee — clause 6.11 guarantee to Realreach. Realreach Services — providing the Platform (excluding Flyer Distribution Services). Run — published offer including deadline, area, Run Price and description. Run Price — agreed service fee (excluding Fees and reimbursed costs). Under-18 Safeguards — published protections for under-18 Users. User Content — clause 18.2 content.</p>
        <p className={sub}>Interpretation: headings are for convenience; singular includes plural; no provision is construed against Realreach merely for drafting; things due on non-Business Days fall to the preceding Business Day; time is local to the performing party; &ldquo;including&rdquo; is non-limiting; &ldquo;law&rdquo; covers legislation, common law and binding orders; monetary amounts are euros unless stated.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>Schedule 1 — Model Distribution Contract</h4>
        <p className={sub}>1. Incorporated terms: Platform Terms clauses 19 (notices etc.) and 20 (interpretation) apply as amended herein; in inconsistency the Distribution Contract prevails over incorporated definitions but the Platform Terms prevail over conflicting provisions. Read with the Terms and Policies; entire agreement between Client and Distributor.</p>
        <p className={sub}>2. Commencement: formed on acceptance; ends on completion and payment, cancellation, or termination. Realreach facilitates but is not a party. For Minors, formation is subject to clause 3.1 of the Terms and the Client Guarantee. Independent-contractor services only; no employment or agency.</p>
        <p className={sub}>3. Client Guarantee: for Minors, the consenting parent/guardian (Guarantor) unconditionally guarantees the Minor&apos;s obligations (payment as principal debtor), subject to 7 days&apos; written notice and opportunity to remedy. Continuing until completion/payment or termination; variations bind the Guarantor only with consent; enforceable directly; covers void-for-incapacity amounts; electronic acceptance effective.</p>
        <p className={sub}>4. Services: due care and skill, per the Run and applicable law (including &ldquo;No Pubblicità&rdquo; signage), qualified personnel; Minors subject to minor-employment law and safeguards. Client supplies suitable materials, instructions and lawful content.</p>
        <p className={sub}>5. Warranties: truthful information, authority and capacity; Organisations warrant Authorised User authority; Minors warrant current Guardian Consent and registered Guarantor; Distributors warrant licences/insurance; Clients warrant flyer content lawfulness.</p>
        <p className={sub}>6. Payment: Client pays the Run Price to its Payment Account (or per invoiced terms) on formation. On completion: Distributor (or Linked Guardian) notifies; Client acknowledges or disputes within 3 Business Days; Realreach determines completion (GPS verification) and instructs release — upfront from the Client&apos;s account, invoiced after cleared funds (advances discretionary). Inaction deems acceptance; 30-day inaction with unsatisfactory completion may cancel with refund. Minor payouts may go to guardian-nominated accounts; deductions, withholdings and regulatory recoveries per the Terms with itemised statements; no pre-funding obligation on invoiced Runs; Distributors bear their own taxes and costs.</p>
        <p className={sub}>7. Variation and refunds: per clause 7 of the Terms (automatic cancellation of long-inactive Runs, pro-rata refunds less Platform Fee, Administrative/Cancellation Fees). Variations must be written, guardian-consented for Minors, and never to circumvent the Terms.</p>
        <p className={sub}>8. Insurance: each party maintains adequate cover at its own cost (public liability and as required by law or reasonably requested), six years for claims-made policies, with evidence on request; no reliance on Realreach Insurance.</p>
        <p className={sub}>9. Liability: mandatory rights unaffected; no liability for consequential loss; aggregate cap equal to the Run Price.</p>
        <p className={sub}>10. Disputes: good-faith negotiation within 14 days, then referral to Realreach whose reasonable directions are followed, then mediation in Milan if unresolved 7 days after determination; no court action until then except urgent relief.</p>
        <p className={sub}>11.–15. Policies incorporated (Terms prevail on inconsistency). Subcontracting only with written Client consent, via verified Users (Minors need Guardian Consent, registered Guarantor, safeguards compliance) under separate Distribution Contracts; Distributors liable for subcontractors. Termination on completion/payment, account suspension, written agreement, Realreach notice, or uncured material breach/insolvency (7 days&apos; notice); accrued rights and clause 3 survive. GPS data may verify completion per the Privacy Policy; Minors&apos; extra data minimised; confidentiality and privacy laws apply. Governed by Italian law; non-exclusive jurisdiction of Milan courts.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>Schedule 2 — Guardian Consent and Guarantees</h4>
        <p className={sub}>1. Parties: Minor&apos;s name, date of birth, account email/ID; parent/guardian name, relationship, contact details, address, identity/relationship proof. By agreeing on the Platform the signatory confirms parent/guardian status and authority.</p>
        <p className={sub}>2. Consent: to recording/verifying identity, relationship, consent and guarantees in the Minor&apos;s account; to limited Personal Information sharing between accounts for safety, verification, administration, disputes and payments per the Privacy Policy; acknowledging Realreach may refuse, suspend or cancel Runs or access for failed verification or legal/safeguard non-compliance.</p>
        <p className={sub}>3. Guarantees: unconditional, irrevocable Client Guarantee (per Distribution Contract) and Realreach Guarantee (per Terms) as principal debtor; payment on demand on default plus reasonable recovery costs as permitted by law; continuing, unaffected by variation or the Minor turning 18, covering void-for-incapacity obligations; directly enforceable; electronic acceptance effective; further confirmations on request.</p>
        <p className={sub}>4. Payments: limited collection agency acknowledged (no financial product/custody); payouts after completion determination per the Terms and invoiced terms, net of lawful deductions/withholdings/regulatory recoveries with itemised statements; payouts to Minor or guardian-nominated accounts; Minor&apos;s Fees collectible likewise; exemption documentation may be required.</p>
        <p className={sub}>5.–8. Supervision: guardian ensures minor-law and safeguard compliance (hours, curfews, breaks, supervision, prohibited tasks), reviews Run suitability, stops unsafe Runs, reports incidents. Minors&apos; GPS/activity data processed per the Privacy Policy; no extra personal data beyond Platform permissions. Guardian may act via Platform tools (completion notices, correspondence, disputes, payout details) honestly and in the Minor&apos;s best interests. Consent may be withdrawn by notice (suspension may follow; accrued obligations unaffected; data handled per the Privacy Policy).</p>
        <p className={sub}>9.–10. Acknowledgements: Realreach is no party to Distribution Contracts and does not supervise performance beyond Terms/Policies; all payments and communications stay on-Platform; consent and administrative acts create no employment relationship; guardian has read the Terms, Community Guidelines and Privacy Policy. Agreement is by Platform click/accept.</p>
      </section>

      <section className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className={`font-bold text-[#0a0a0b] ${h}`}>Contact</h4>
        <p>
          Realreach S.r.l. — Ufficio Legale
          <br />
          Via Monte Napoleone 8, 20121 Milano (MI), Italy
          <br />
          Email: support@realreach.it
        </p>
      </section>
    </div>
  );
};

export default TermsContent;

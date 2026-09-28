import React, { useState } from 'react';
import { ArrowLeft, Clock, Calendar, User, BookOpen } from 'lucide-react';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  content: string[];
}

const ARTICLES: Article[] = [
  {
    slug: 'what-is-letterbox-distribution',
    title: 'What Is Letterbox Distribution? A Plain-English Guide for Milan Businesses',
    excerpt: 'How flyer distribution works in Italy, what it costs per letterbox, and how live GPS tracking ensures every leaflet actually reaches a mailbox.',
    date: 'September 15, 2026',
    readTime: '5 min read',
    author: 'REALREACH Editorial Team',
    content: [
      'Letterbox distribution is the delivery of printed promotional material — flyers, brochures, postcards, and catalogues — directly into residential and business mailboxes within a selected geographic zone.',
      'Unlike digital advertising, where impressions vanish into a feed within fractions of a second, physical direct mail sits on a kitchen table or entrance hallway for an average of 4.2 days before being acted upon.',
      'In high-density European cities like Milan, letterbox drops allow local restaurants, real estate agencies, fitness studios, and home service providers to reach 100% of a targeted neighborhood without paying inflated cost-per-click rates.',
      'With modern GPS tracking platforms like REALREACH, business owners can draw custom street polygons, view exact mailbox counts, and verify walker routes in real time.',
    ],
  },
  {
    slug: 'letterbox-drops-vs-digital-ads',
    title: 'Letterbox Drops vs Digital Ads: Where Each Wins in 2026',
    excerpt: 'An honest comparison of cost per acquisition, local saturation, and measurable return on investment for small and mid-sized enterprises in Milan.',
    date: 'August 28, 2026',
    readTime: '6 min read',
    author: 'REALREACH Operations Lead',
    content: [
      'Digital ad costs on Meta and Google have risen more than 38% over the past two years, making hyper-local targeting increasingly cost-prohibitive for neighborhood businesses.',
      'When an agency needs to announce a luxury apartment listing in Brera or Porta Nuova, digital geo-fencing often catches office commuters or tourists rather than permanent residents.',
      'Letterbox delivery guarantees that physical marketing enters the private residence of property owners. Combining physical print with a trackable QR code delivers the highest conversion rates observed in local marketing.',
      'The winning strategy is omni-channel: trigger physical letterbox campaigns first to build brand recognition, then retarget those same postal codes online.',
    ],
  },
  {
    slug: 'gps-tracking-solved-delivery-crisis',
    title: 'How Live GPS Tracking Solved the Flyer Dumping Crisis',
    excerpt: 'Why traditional distribution companies lost client trust, and how smartphone telemetry restored accountability to print marketing.',
    date: 'August 10, 2026',
    readTime: '4 min read',
    author: 'REALREACH Technology Team',
    content: [
      'For decades, direct mail suffered from an open secret: a significant percentage of flyers were discarded by disengaged walkers rather than delivered.',
      'REALREACH introduced real-time GPS telemetry with ping intervals under 10 seconds, algorithmically verifying walking pace, street coverage percentage, and dwell time at building entrances.',
      'If any route section is skipped, the platform flags the gap immediately, enabling dispatchers to coordinate a re-run before the campaign closes.',
      'Clients receive a comprehensive audit report with exact walked maps, time stamps, and delivery milestone photos.',
    ],
  },
];

export const BlogPage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (selectedArticle) {
    return (
      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-5 sm:px-6">
          <button
            type="button"
            onClick={() => setSelectedArticle(null)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a0a0b] hover:text-blue-600 transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all guides</span>
          </button>

          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Milan Marketing Guide
          </span>

          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0a0a0b] tracking-tight leading-tight">
            {selectedArticle.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#6b7280] pb-8 border-b border-slate-200">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{selectedArticle.author}</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{selectedArticle.date}</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{selectedArticle.readTime}</span>
            </span>
          </div>

          <div className="mt-8 space-y-6 text-base sm:text-lg text-slate-700 leading-relaxed">
            {selectedArticle.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <h3 className="font-bold text-lg text-[#0a0a0b]">Ready to launch a campaign in Milan?</h3>
            <p className="mt-1 text-sm text-[#4b5563]">Calculate costs for any Milan zone with zero commitment.</p>
            <a
              href="/#pricing"
              className="mt-4 inline-block rounded-xl bg-[#0a0a0b] text-white px-6 py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              Get Instant Pricing
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-16 pb-20 bg-slate-50 border-b border-slate-200 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Guides &amp; Strategy
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0a0a0b] tracking-tight">
            REALREACH Blog
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-[#4b5563] max-w-2xl mx-auto">
            Practical insights on flyer marketing, direct mail strategy, and GPS tracking across Milan and Italy.
          </p>
        </div>
      </section>

      {/* Article Grid */}
      <section className="py-20 max-w-5xl mx-auto px-5 sm:px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{article.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-[#0a0a0b] group-hover:text-blue-600 transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="mt-3 text-sm text-[#4b5563] line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{article.date}</span>
                <span className="font-semibold text-[#0a0a0b] group-hover:underline">Read article &rarr;</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;

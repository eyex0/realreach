import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, CalendarDays } from 'lucide-react';

interface Article {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  content: string[];
}

const ARTICLES: Article[] = [
  {
    slug: 'what-is-letterbox-distribution',
    category: 'Guides',
    title: 'What Is Letterbox Distribution? A Plain-English Guide',
    excerpt: 'How flyer distribution works in Milan, what it costs per letterbox, and how GPS tracking makes it measurable for any business.',
    date: 'August 12, 2026',
    readTime: '6 min read',
    author: 'Realreach Editorial Team',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
    content: [
      'Letterbox distribution is the delivery of printed promotional material — flyers, brochures, postcards, and catalogues — directly into residential and business mailboxes within a selected geographic zone.',
      'Unlike digital advertising, where impressions vanish into a feed within fractions of a second, physical direct mail sits on a kitchen table or entrance hallway for days before being acted upon.',
      'In high-density European cities like Milan, letterbox drops allow local restaurants, real estate agencies, fitness studios, and home service providers to reach 100% of a targeted neighborhood without paying inflated cost-per-click rates.',
      'With modern GPS tracking platforms like Realreach, business owners can draw custom street polygons, view exact mailbox counts, and verify walker routes in real time.',
    ],
  },
  {
    slug: 'how-much-does-flyer-distribution-cost',
    category: 'Pricing',
    title: 'How Much Does Flyer Distribution Cost in Milan?',
    excerpt: 'A breakdown of per-flyer pricing, printing costs and the factors that move the number up or down.',
    date: 'August 5, 2026',
    readTime: '5 min read',
    author: 'Realreach Operations Lead',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    content: [
      'Most Milan campaigns land between €0.11 and €0.18 per letterbox for distribution alone, with printing adding €0.03 to €0.09 per flyer depending on format and paper stock.',
      'Three factors move the number: density (central zones like Brera cost less per unit than spread-out suburbs), format (DL is cheapest, A4 folded costs more to print and handle), and solo vs. shared drops.',
      'A 10,000-flyer DL campaign on 250 GSM silk typically totals around €1,400 to €1,800 all-in — print, distribution and GPS verification included.',
      'Use our pricing calculator to get an instant per-zone estimate with zero commitment before you book anything.',
    ],
  },
  {
    slug: 'designing-a-flyer-that-gets-read',
    category: 'Design',
    title: 'Designing a Flyer That Actually Gets Read',
    excerpt: 'Layout, offer and call-to-action tips that turn a letterbox drop into phone calls and bookings.',
    date: 'July 28, 2026',
    readTime: '4 min read',
    author: 'Realreach Editorial Team',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
    content: [
      'You have about two seconds: a bold headline stating the offer, one hero image, and a single call to action. Everything else is decoration competing for attention.',
      'Put the offer above the fold — discounts, free appraisals, opening dates — in type large enough to read at arm’s length. A flyer is a poster that happens to fit in a mailbox.',
      'Always include a trackable response path: a QR code, a dedicated phone number, or a neighborhood-specific promo code, so each zone’s return is measurable.',
      'Our print store checks your PDF for resolution, bleed and CMYK conversion before anything goes to press.',
    ],
  },
  {
    slug: 'gps-tracking-and-proof-of-delivery',
    category: 'Technology',
    title: 'GPS Tracking and Proof of Delivery, Explained',
    excerpt: 'What tracking data actually shows you, and how to read a distribution report with confidence.',
    date: 'July 15, 2026',
    readTime: '5 min read',
    author: 'Realreach Technology Team',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    content: [
      'For decades, direct mail suffered from an open secret: a significant percentage of flyers were discarded by disengaged walkers rather than delivered.',
      'Realreach walkers carry a GPS app that logs route breadcrumbs, walking pace and milestone photos, so every street in your zone shows planned coverage versus verified coverage.',
      'If any route section is skipped, the platform flags the gap immediately, enabling dispatchers to coordinate a re-run before the campaign closes.',
      'After completion you receive an audit report with walked maps, timestamps and delivery milestone photos — never a claim of absolute proof, always verifiable evidence.',
    ],
  },
  {
    slug: 'letterbox-drops-vs-digital-ads',
    category: 'Strategy',
    title: 'Letterbox Drops vs Digital Ads: Where Each Wins',
    excerpt: 'An honest comparison of reach, cost and measurability for local businesses choosing between the two.',
    date: 'July 3, 2026',
    readTime: '6 min read',
    author: 'Realreach Operations Lead',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    content: [
      'Digital ad costs on Meta and Google have risen sharply over the past two years, making hyper-local targeting increasingly cost-prohibitive for neighborhood businesses.',
      'When an agency needs to announce a listing in Brera or Porta Nuova, digital geo-fencing often catches commuters or tourists rather than permanent residents.',
      'Letterbox delivery guarantees that physical marketing enters the private residence of property owners. Combining print with a trackable QR code delivers the highest conversion rates observed in local marketing.',
      'The winning strategy is omni-channel: trigger physical letterbox campaigns first to build brand recognition, then retarget those same postal codes online.',
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
            {selectedArticle.category}
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

          <img
            src={selectedArticle.image}
            alt={selectedArticle.title}
            className="mt-8 w-full h-auto rounded-2xl border border-slate-200 object-cover aspect-[16/9]"
            loading="lazy"
          />

          <div className="mt-8 space-y-6 text-base sm:text-lg text-slate-700 leading-relaxed">
            {selectedArticle.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <h3 className="font-bold text-lg text-[#0a0a0b]">Ready to launch a campaign in Milan?</h3>
            <p className="mt-1 text-sm text-[#4b5563]">Calculate costs for any Milan zone with zero commitment.</p>
            <Link
              to="/pricing"
              className="mt-4 inline-block rounded-xl bg-[#0a0a0b] text-white px-6 py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              Get Instant Pricing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Blog</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#0a0a0b] tracking-tight">
          Flyer distribution, explained
        </h1>
        <p className="mt-3 text-base sm:text-lg text-[#4b5563] max-w-2xl">
          Practical guides on letterbox drops, pamphlet delivery and getting more from every campaign.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map((article) => (
            <article
              key={article.slug}
              onClick={() => {
                setSelectedArticle(article);
                window.scrollTo({ top: 0 });
              }}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col group"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="self-start text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  {article.category}
                </span>
                <h2 className="mt-3 text-lg font-bold text-[#0a0a0b] leading-snug group-hover:underline">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm text-[#4b5563] leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-400 mt-auto">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {article.readTime}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;

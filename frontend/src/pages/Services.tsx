import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SearchIcon,
  ZapIcon,
  PhoneIcon,
  MapPinIcon,
  BookOpenIcon,
  BarChartIcon,
  ArrowRightIcon,
  MenuIcon,
  XIcon,
} from 'lucide-react';

const NAV_LINKS = ['About', 'Services', 'How it works', 'Help'];

const FOOTER_LINKS = {
  Company: ['About', 'Features', 'How it works', 'Search'],
  Support: ['Help center', 'Contact', 'Privacy and Terms'],
};

const SERVICES = [
  {
    icon: <SearchIcon className="w-6 h-6" />,
    tag: 'SEARCH',
    title: 'Surgical Kit Search',
    desc: 'Type any surgical kit name and instantly see which nearby pharmacies have it in stock. No phone calls, no guessing — just fast, accurate results.',
    points: ['Search by kit name', 'Results in seconds', 'No account needed'],
  },
  {
    icon: <ZapIcon className="w-6 h-6" />,
    tag: 'SYNC',
    title: 'Real-Time Stock Sync',
    desc: 'SurgiMap connects to local pharmacy inventory systems and syncs stock data automatically. You always see the latest availability status.',
    points: ['Live inventory updates', 'Available / Low Stock / Not Available', 'Last updated timestamp on every result'],
  },
  {
    icon: <PhoneIcon className="w-6 h-6" />,
    tag: 'CONTACT',
    title: 'Direct Pharmacy Contact',
    desc: 'Each pharmacy result includes a one-tap call and WhatsApp button so you can confirm stock before you travel. Save time, avoid wasted trips.',
    points: ['Call button on every card', 'WhatsApp button for quick messaging', 'Verify before you travel'],
  },
  {
    icon: <MapPinIcon className="w-6 h-6" />,
    tag: 'MAP',
    title: 'Map View & Directions',
    desc: 'Switch to map view to see all nearby pharmacies that have your kit pinned on an interactive map. Get directions with one tap.',
    points: ['Visual pharmacy map', 'Distance shown on every result', 'Google Maps directions link'],
  },
  {
    icon: <BookOpenIcon className="w-6 h-6" />,
    tag: 'CATALOG',
    title: 'Master Kit Catalog',
    desc: 'Different pharmacies may label the same kit with different names. SurgiMap\'s master catalog standardizes names so your search always finds the right match.',
    points: ['Standardized kit names', 'Handles naming variations', 'Consistent results across all pharmacies'],
  },
  {
    icon: <BarChartIcon className="w-6 h-6" />,
    tag: 'STATUS',
    title: 'Simple Availability Status',
    desc: 'Instead of showing confusing numbers, SurgiMap displays clear, easy-to-read stock statuses so anyone can understand results at a glance.',
    points: ['Available — 4 or more units', 'Low Stock — 1 to 3 units', 'Not Available — out of stock'],
  },
];

const STATS = [
  { value: '10+', label: 'Connected pharmacies' },
  { value: '52K+', label: 'Searches made' },
  { value: '2M+', label: 'Kits located' },
  { value: '< 3s', label: 'Average search time' },
];

export function Services() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-iceWhite text-obsidian font-sans selection:bg-arcticNavy/10 overflow-x-hidden">

      {/* Navbar */}
      <nav className="max-w-[1440px] mx-auto px-8 md:px-16 py-8 flex items-center justify-between">
        <a href="/" className="text-3xl font-black tracking-tighter text-arcticNavy">
          surgimap
        </a>
        <div className="hidden md:flex items-center gap-12">
          {NAV_LINKS.map((link) =>
            <a
              key={link}
              href={
                link === 'How it works' ? '/how-it-works' :
                link === 'About' ? '/about' :
                link === 'Help' ? '/help' :
                link === 'Services' ? '/services' :
                '#'
              }
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${link === 'Services' ? 'text-arcticNavy' : 'text-steelBlue hover:text-arcticNavy'}`}>
              {link}
            </a>
          )}
          <a
            href="/login"
            className="border border-arcticNavy rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest text-arcticNavy hover:bg-arcticNavy hover:text-iceWhite transition-all">
            Login
          </a>
          <button className="border border-arcticNavy rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest text-arcticNavy hover:bg-arcticNavy hover:text-iceWhite transition-all">
            Contact
          </button>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-arcticNavy">
          {isMenuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-[1440px] mx-auto px-8 md:px-16 pt-16 pb-24 text-center relative">
        <p className="text-arcticNavy font-bold tracking-[0.2em] uppercase text-sm mb-6">
          What we offer
        </p>
        <h1 className="text-5xl md:text-[72px] font-black leading-[0.95] tracking-tighter text-obsidian mb-8 max-w-4xl mx-auto">
          Everything you need to find surgical supplies
        </h1>
        <p className="text-steelBlue text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
          SurgiMap brings together search, real-time stock data, pharmacy contact, and map navigation — all in one simple platform.
        </p>
        <button
          onClick={() => navigate('/search')}
          className="bg-arcticNavy text-iceWhite px-10 py-4 rounded-xl text-base font-bold shadow-lg hover:bg-obsidian hover:-translate-y-1 hover:shadow-xl transition-all active:scale-95 inline-flex items-center gap-2 group">
          Start searching now
          <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="absolute top-[10%] right-[5%] w-[350px] h-[350px] bg-glacierBlue/10 rounded-full -z-10 blur-3xl" />
        <div className="absolute bottom-[5%] left-[10%] w-[250px] h-[250px] bg-silverMist/20 rounded-full -z-10 blur-2xl" />
      </section>

      {/* Stats bar */}
      <section className="bg-arcticNavy py-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s, i) =>
            <div key={i}>
              <p className="text-4xl md:text-5xl font-black text-iceWhite tracking-tighter mb-2">{s.value}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-iceWhite/60">{s.label}</p>
            </div>
          )}
        </div>
      </section>

      {/* Services grid */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-obsidian tracking-tighter mb-4">
              Our core services
            </h2>
            <p className="text-steelBlue text-lg max-w-xl mx-auto">
              Six features working together to get you the right kit, fast.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map((s, i) =>
              <div
                key={i}
                className={`border border-silverMist rounded-[2.5rem] p-10 hover:shadow-2xl hover:shadow-arcticNavy/5 hover:border-arcticNavy/20 transition-all group ${i === 0 ? 'bg-arcticNavy/5' : 'bg-iceWhite'}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-silverMist flex items-center justify-center text-arcticNavy group-hover:bg-arcticNavy group-hover:text-iceWhite group-hover:scale-110 transition-all">
                    {s.icon}
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-arcticNavy bg-arcticNavy/10 px-3 py-1.5 rounded-full">
                    {s.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-obsidian tracking-tight mb-4">{s.title}</h3>
                <p className="text-steelBlue text-base leading-relaxed mb-6">{s.desc}</p>
                <ul className="space-y-3">
                  {s.points.map((p, j) =>
                    <li key={j} className="flex items-center gap-3 text-sm text-steelBlue font-medium">
                      <div className="w-5 h-5 rounded-full bg-arcticNavy/10 flex items-center justify-center shrink-0">
                        <ArrowRightIcon className="w-3 h-3 text-arcticNavy" />
                      </div>
                      {p}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6 md:px-12 bg-iceWhite">
        <div className="max-w-7xl mx-auto">
          <div className="bg-arcticNavy rounded-[4rem] overflow-hidden relative shadow-2xl px-12 md:px-24 py-20">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-glacierBlue/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-steelBlue/30 rounded-full blur-3xl" />
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-6xl font-black text-iceWhite tracking-tighter leading-[0.9] mb-6">
                Ready to find a kit?
              </h2>
              <p className="text-glacierBlue text-xl max-w-md mx-auto leading-relaxed mb-10">
                Search across nearby pharmacies in seconds — no sign-up required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/search')}
                  className="bg-white text-arcticNavy px-12 py-5 rounded-2xl text-lg font-bold shadow-xl hover:bg-iceWhite hover:-translate-y-1 transition-all active:scale-95">
                  Start searching
                </button>
                <button
                  onClick={() => navigate('/how-it-works')}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-iceWhite px-12 py-5 rounded-2xl text-lg font-bold hover:bg-white/20 transition-all">
                  How it works
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-arcticNavy text-iceWhite pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
            <div className="lg:col-span-2">
              <span className="font-extrabold text-2xl tracking-tight">surgimap</span>
              <p className="text-iceWhite/70 text-base leading-relaxed max-w-xs mt-6">
                Find surgical kits near you, fast. The world's most reliable surgical supply locator.
              </p>
            </div>
            {Object.entries(FOOTER_LINKS).map(([group, links]) =>
              <div key={group}>
                <h4 className="text-iceWhite font-bold text-base uppercase tracking-widest mb-8">{group}</h4>
                <ul className="space-y-4">
                  {links.map((l) =>
                    <li key={l}>
                      <a
                        href={
                          l === 'Search' ? '/search' :
                          l === 'How it works' ? '/how-it-works' :
                          l === 'About' ? '/about' :
                          l === 'Help center' ? '/help' :
                          '#'
                        }
                        className="text-base text-iceWhite/70 hover:text-iceWhite transition-colors">
                        {l}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className="pt-12 border-t border-iceWhite/20 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-iceWhite/50">
            <p>© 2026 SurgiMap. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Menu */}
      {isMenuOpen &&
        <div className="fixed inset-0 bg-iceWhite z-[100] p-8 flex flex-col items-center justify-center gap-8">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-8 text-arcticNavy">
            <XIcon className="w-8 h-8" />
          </button>
          {NAV_LINKS.map((link) =>
            <a
              key={link}
              href={
                link === 'How it works' ? '/how-it-works' :
                link === 'About' ? '/about' :
                link === 'Help' ? '/help' :
                link === 'Services' ? '/services' :
                '#'
              }
              className="text-4xl font-black tracking-tighter text-arcticNavy">
              {link}
            </a>
          )}
          <a
            href="/login"
            className="text-4xl font-black tracking-tighter text-arcticNavy">
            Login
          </a>
          <button className="bg-arcticNavy text-iceWhite rounded-full px-12 py-4 text-sm font-bold uppercase tracking-widest">
            Contact
          </button>
        </div>
      }
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SearchIcon, XIcon, MenuIcon } from 'lucide-react';
import { getCatalog } from '../lib/api';

const NAV_LINKS = ['About', 'How it works', 'Help'];
const FOOTER_LINKS = {
  Company: ['About', 'Features', 'How it works', 'Search'],
  Support: ['Help center', 'Contact', 'Privacy and Terms']
};
const KIT_PRESENTATION = [
  {
    id: 1,
    name: 'Maternity & Cesarean Section (C-Section) Delivery Kit',
    category: 'Obstetrics',
    image: '/images/kits/maternity-c-section-kit.jpg'
  },
  {
    id: 2,
    name: 'Laparoscopic / Abdominal Surgery Kit',
    category: 'Laparoscopy',
    image: '/images/kits/laparoscopic-abdominal-kit.jpg'
  },
  {
    id: 3,
    name: 'Orthopedic & Major Joint Surgery Prep Kit',
    category: 'Orthopedics',
    image: '/images/kits/orthopedic-joint-prep-kit.jpg'
  },
  {
    id: 4,
    name: 'Minor Surgical & Suture Removal Kit',
    category: 'Minor Surgery',
    image: '/images/kits/minor-surgery-suture-removal-kit.jpg'
  },
  {
    id: 5,
    name: 'Cataract & Eye Surgery Kit',
    category: 'Ophthalmology',
    image: '/images/kits/cataract-eye-surgery-kit.jpg'
  },
  {
    id: 6,
    name: 'Wound Care & Post-Operative Dressing Kit',
    category: 'Wound Care',
    image: '/images/kits/wound-care-dressing-kit.jpg'
  }];

const KIT_PRESENTATION_BY_NAME = new Map(
  KIT_PRESENTATION.map((kit) => [kit.name, kit])
);

export function Search() {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quickKits, setQuickKits] = useState(KIT_PRESENTATION);
  const [catalogTotal, setCatalogTotal] = useState(59);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    getCatalog(controller.signal)
      .then((catalog) => {
        setCatalogTotal(catalog.total);
        setQuickKits(catalog.primary_kits.map((name, index) => {
          const presentation = KIT_PRESENTATION_BY_NAME.get(name)
            || KIT_PRESENTATION[index]
            || KIT_PRESENTATION[0];

          return {
            ...presentation,
            id: index + 1,
            name
          };
        }));
      })
      .catch(() => {
        // The built-in primary kit cards remain available while the API starts.
      });
    return () => controller.abort();
  }, []);
  function handleSearch(value: string) {
    const term = value.trim();
    if (!term) return;
    navigate(`/?q=${encodeURIComponent(term)}`);
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch(query);
  }
  function handleChipClick(name: string) {
    setQuery(name);
    handleSearch(name);
  }
  return (
    <div className="min-h-screen bg-iceWhite text-obsidian font-sans selection:bg-arcticNavy/10 overflow-x-hidden flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-iceWhite/80 backdrop-blur-md border-b border-silverMist/40">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-1">
            <span className="text-2xl font-black tracking-tighter text-arcticNavy">
              surgimap
            </span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) =>
              <a
                key={link}
                href={
                  link === 'How it works' ? '/how-it-works' :
                    link === 'About' ? '/about' :
                      link === 'Help' ? '/help' :
                        '#'
                }
                className="text-xs font-bold uppercase tracking-wider transition-colors text-steelBlue hover:text-arcticNavy">                      {link}
              </a>
            )}
            <div className="w-px h-4 bg-silverMist mx-1" />
            <a
              href="/#contact"
              className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${location.hash === '#contact' && location.pathname === '/' ? 'border-arcticNavy text-arcticNavy bg-arcticNavy/10' : 'border-silverMist text-steelBlue hover:border-arcticNavy hover:text-arcticNavy'}`}>
              Contact
            </a>
            <a
              href="/search"
              className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${location.pathname === '/search' ? 'bg-obsidian text-iceWhite' : 'bg-arcticNavy text-iceWhite hover:bg-obsidian'}`}>
              Search
            </a>
          </div >

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-arcticNavy">
            {isMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div >
      </nav >

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-iceWhite border-b border-silverMist/30 py-20 px-8 md:px-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <span className="inline-block bg-glacierBlue/20 text-arcticNavy text-xs font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full">
              Surgical Kit Directory
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-obsidian leading-[0.9]">
              Find the right
              <br />
              surgical kit, fast
            </h1>
            <p className="text-steelBlue text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              Enter a surgical kit name to check live stock synced from connected pharmacies.
            </p>

            {/* Search Box */}
            <div className="relative max-w-2xl mx-auto mt-12">
              <div className="flex items-center bg-white border-2 border-silverMist rounded-2xl p-2 shadow-xl shadow-arcticNavy/5 focus-within:border-arcticNavy transition-all">
                <div className="pl-4 pr-2 text-steelBlue">
                  <SearchIcon className="w-6 h-6" />
                </div>
                <input
                  className="flex-1 bg-transparent border-none outline-none py-4 text-lg font-medium text-obsidian placeholder:text-silverMist"
                  type="text"
                  placeholder="e.g. maternity kit, trocar, eye shield, dressing kit..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus />

                {query &&
                  <button
                    className="p-2 text-silverMist hover:text-arcticNavy transition-colors"
                    onClick={() => setQuery('')}>

                    <XIcon className="w-5 h-5" />
                  </button>
                }
                <button
                  className="bg-arcticNavy text-iceWhite px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-obsidian transition-all ml-2"
                  onClick={() => handleSearch(query)}>

                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Kits Section */}
        <section className="py-20">
          <div className="max-w-[1440px] mx-auto px-8 md:px-16">
            <div className="flex items-baseline justify-between mb-12">
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-obsidian">
                Commonly Searched Kits
              </h2>
              <span className="text-xs font-bold uppercase tracking-widest text-silverMist">
                {catalogTotal} searchable catalog items
              </span>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
              {quickKits.map((kit) =>
                <button
                  key={kit.id}
                  className="flex-shrink-0 snap-start w-80 min-h-[400px] bg-white border border-silverMist rounded-[2.5rem] text-left group hover:border-arcticNavy hover:shadow-2xl hover:shadow-arcticNavy/5 transition-all flex flex-col relative overflow-hidden"
                  onClick={() => handleChipClick(kit.name)}>

                  {/* Background Image with Overlay */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={kit.image}
                      alt={kit.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-10 flex flex-col h-full flex-1">
                    <span className="inline-block bg-white/20 backdrop-blur-md text-iceWhite text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-6 self-start border border-white/10">
                      {kit.category}
                    </span>
                    <h3 className="text-2xl font-black text-white mb-4 leading-tight tracking-tighter">
                      {kit.name}
                    </h3>
                    <div className="flex items-center gap-3 text-iceWhite/80 text-sm font-bold mt-auto">
                      <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round">

                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </div>
                      Check live availability
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-arcticNavy text-iceWhite pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <span className="font-extrabold text-2xl tracking-tight">
                  surgimap
                </span>
              </div>
              <p className="text-iceWhite/70 text-base leading-relaxed max-w-xs mb-8">
                Find surgical kits near you, fast. The world's most reliable
                surgical supply locator.
              </p>
            </div>

            {Object.entries(FOOTER_LINKS).map(([group, links]) =>
              <div key={group}>
                <h4 className="text-iceWhite font-bold text-base uppercase tracking-widest mb-8">
                  {group}
                </h4>
                <ul className="space-y-4">
                  {links.map((l) =>
                    <li key={l}>
                      <a
                        href={
                          l === 'Search' ?
                            '/search' :
                            l === 'How it works' ?
                              '/how-it-works' :
                              l === 'About' ?
                                '/about' :
                                l === 'Help center' ?
                                  '/help' :
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
        <div className="fixed inset-0 bg-iceWhite z-[200] p-8 flex flex-col items-center justify-center gap-12">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-8 text-arcticNavy">

            <XIcon className="w-10 h-10" />
          </button>
          {NAV_LINKS.map((link) =>
            <a
              key={link}
              href={
                link === 'How it works' ?
                  '/how-it-works' :
                  link === 'About' ?
                    '/about' :
                    link === 'Help' ?
                      '/help' :
                      link === 'Services' ?
                        '/services' :
                        '#'
              }
              className="text-5xl font-black tracking-tighter text-arcticNavy hover:text-glacierBlue transition-colors">

              {link}
            </a>
          )}
          <button className="bg-arcticNavy text-iceWhite rounded-full px-16 py-5 text-lg font-bold uppercase tracking-widest shadow-2xl">
            Contact
          </button>
        </div>
      }
    </div>);

}

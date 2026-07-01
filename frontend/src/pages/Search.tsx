import React, { useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, XIcon, MenuIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const NAV_LINKS = ['About', 'Services', 'How it works', 'Help'];
const FOOTER_LINKS = {
  Company: ['About', 'Features', 'How it works', 'Search'],
  Support: ['Help center', 'Contact', 'Privacy and Terms']
};
const QUICK_KITS = [
{
  id: 1,
  name: 'Laparoscopic Basic Set',
  category: 'Minimally Invasive',
  pharmacies: '12 pharmacies',
  image:
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800'
},
{
  id: 2,
  name: 'Orthopedic Trauma Kit',
  category: 'Orthopedics',
  pharmacies: '24 pharmacies',
  image:
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800'
},
{
  id: 3,
  name: 'Cardiovascular Set',
  category: 'Cardiac',
  pharmacies: '18 pharmacies',
  image:
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
},
{
  id: 4,
  name: 'General Surgery Pack',
  category: 'General',
  pharmacies: '15 pharmacies',
  image:
  'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=800'
},
{
  id: 5,
  name: 'Neurosurgery Cranial Kit',
  category: 'Neurosurgery',
  pharmacies: '20 pharmacies',
  image:
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800'
},
{
  id: 6,
  name: 'Ophthalmology Micro Set',
  category: 'Ophthalmology',
  pharmacies: '10 pharmacies',
  image:
  'https://images.unsplash.com/photo-1579154235828-4519f39f93cb?auto=format&fit=crop&q=80&w=800'
},
{
  id: 7,
  name: 'Arthroscopy Instrument Set',
  category: 'Orthopedics',
  pharmacies: '16 pharmacies',
  image:
  'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800'
},
{
  id: 8,
  name: 'Cesarean Section Kit',
  category: 'OB/GYN',
  pharmacies: '14 pharmacies',
  image:
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800'
},
{
  id: 9,
  name: 'Endoscopy Flexible Set',
  category: 'Gastroenterology',
  pharmacies: '8 pharmacies',
  image:
  'https://images.unsplash.com/photo-1581595221475-19906ca447fd?auto=format&fit=crop&q=80&w=800'
},
{
  id: 10,
  name: 'Thoracic Surgery Pack',
  category: 'Thoracic',
  pharmacies: '22 pharmacies',
  image:
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
}];

export function Search() {
  const [query, setQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  function handleSearch(value: string) {
    const term = value.trim();
    if (!term) return;
    setIsLoading(true);
    // Simulate searching delay
    setTimeout(() => {
      navigate(`/?q=${encodeURIComponent(term)}`);
    }, 2500);
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
      <AnimatePresence>
        {isLoading &&
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          className="fixed inset-0 z-[300] bg-iceWhite flex flex-col items-center justify-center p-8">
          
            <div className="max-w-md w-full text-center space-y-12">
              {/* Branding */}
              <motion.div
              initial={{
                y: 20,
                opacity: 0
              }}
              animate={{
                y: 0,
                opacity: 1
              }}
              transition={{
                delay: 0.2
              }}
              className="flex flex-col items-center gap-4">
              
                <span className="text-4xl font-black tracking-tighter text-arcticNavy">
                  surgimap
                </span>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((i) =>
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-2 h-2 rounded-full bg-arcticNavy" />

                )}
                </div>
              </motion.div>

              {/* Loader & Message */}
              <div className="space-y-6">
                <div className="relative flex justify-center">
                  <motion.div
                  animate={{
                    rotate: 360
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className="text-arcticNavy">
                  
                    <Loader2 className="w-16 h-16 stroke-[1.5]" />
                  </motion.div>
                  <motion.div
                  initial={{
                    scale: 0.8,
                    opacity: 0
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                  className="absolute inset-0 flex items-center justify-center">
                  
                    <div className="w-8 h-8 bg-glacierBlue/20 rounded-full blur-xl" />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <motion.h2
                  animate={{
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                  className="text-2xl font-black tracking-tight text-obsidian">
                  
                    Searching nearby pharmacies…
                  </motion.h2>
                  <p className="text-steelBlue font-medium">
                    Checking real-time stock for "{query}"
                  </p>
                </div>
              </div>

              {/* Skeleton Loader Simulation */}
              <div className="space-y-4 pt-8 border-t border-silverMist/30">
                {[0, 1].map((i) =>
              <div key={i} className="flex gap-4 items-center opacity-40">
                    <div className="w-12 h-12 rounded-xl bg-silverMist/30 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-silverMist/30 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-silverMist/20 rounded animate-pulse" />
                    </div>
                  </div>
              )}
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Navbar */}
      <nav className="max-w-[1440px] mx-auto px-8 md:px-16 py-8 flex items-center justify-between w-full">
        <a href="/" className="flex items-center gap-1">
          <span className="text-3xl font-black tracking-tighter text-arcticNavy">
            surgimap
          </span>
        </a>
        <div className="hidden md:flex items-center gap-12">
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
            className="text-sm font-bold uppercase tracking-widest text-steelBlue hover:text-arcticNavy transition-colors">
            
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
              Search our comprehensive database of surgical instrument kits by
              name, specialty, or procedure.
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
                  placeholder="e.g. Laparoscopic Basic Set, Orthopedic Trauma..."
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
                Scroll to explore
              </span>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
              {QUICK_KITS.map((kit) =>
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
                      {kit.pharmacies}
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
          <a
            href="/login"
            className="text-5xl font-black tracking-tighter text-arcticNavy hover:text-glacierBlue transition-colors">
            Login
          </a>
          <button className="bg-arcticNavy text-iceWhite rounded-full px-16 py-5 text-lg font-bold uppercase tracking-widest shadow-2xl">
            Contact
          </button>
        </div>
      }
    </div>);

}
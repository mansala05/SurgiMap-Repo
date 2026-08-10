import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MenuIcon,
  XIcon,
  HeartPulseIcon,
  ClockIcon,
  ShieldCheckIcon,
  UsersIcon,
  TargetIcon,
  SparklesIcon,
  SearchIcon,
  ZapIcon,
  PhoneIcon,
  MapPinIcon,
  BookOpenIcon,
  BarChartIcon,
  ArrowRightIcon
} from
  'lucide-react';
const NAV_LINKS = ['About', 'How it works', 'Help'];
const FOOTER_LINKS = {
  Company: ['About', 'Features', 'How it works', 'Search'],
  Support: ['Help center', 'Contact', 'Privacy and Terms']
};
const VALUES = [
  {
    title: 'Speed saves lives',
    desc: 'Every minute spent searching for a surgical kit is a minute taken from patient care. We design for seconds, not hours.',
    icon: <ClockIcon className="w-6 h-6" />
  },
  {
    title: 'Privacy by design',
    desc: 'Our sync agents are read-only by architecture. Patient records never touch our platform — only stock counts do.',
    icon: <ShieldCheckIcon className="w-6 h-6" />
  },
  {
    title: 'Built for everyone',
    desc: 'Families, pharmacists, and healthcare workers all need clear, honest information when it matters most.',
    icon: <UsersIcon className="w-6 h-6" />
  }];

const STATS = [
  {
    value: '2 - 4 hrs',
    label: 'Time families used to lose searching'
  },
  {
    value: '< 10 sec',
    label: 'Time to find a stocked pharmacy'
  },
  {
    value: '90%+',
    label: 'Reduction in routing costs'
  }];

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
    points: ['OpenStreetMap pharmacy map', 'Distance shown on every result', 'OpenStreetMap route link'],
  },
  {
    icon: <BookOpenIcon className="w-6 h-6" />,
    tag: 'CATALOG',
    title: 'Master Kit Catalog',
    desc: "Different pharmacies may label the same kit with different names. SurgiMap's master catalog standardizes names so your search always finds the right match.",
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

export function About() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-iceWhite text-obsidian font-sans selection:bg-arcticNavy/10 overflow-x-hidden">
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
                className={`text-xs font-bold uppercase tracking-wider transition-colors ${link === 'About' ? 'text-arcticNavy' : 'text-steelBlue hover:text-arcticNavy'}`}>
                {link}
              </a>
            )}
            <div className="w-px h-4 bg-silverMist mx-1" />
            <a
            href="/#contact"
              className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${location.hash === '#contact' && location.pathname === '/' ? 'border-arcticNavy text-arcticNavy bg-arcticNavy/10' : 'border-silverMist text-steelBlue hover:border-arcticNavy hover:text-arcticNavy'}`}>
              Contact
            </a>
            <a
              href="/login"
              className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${location.pathname === '/login' ? 'border-arcticNavy text-arcticNavy bg-arcticNavy/10' : 'border-silverMist text-steelBlue hover:border-arcticNavy hover:text-arcticNavy'}`}>
              Login
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

      {/* Hero */}
      <section className="max-w-[1440px] mx-auto px-8 md:px-16 pt-12 pb-20 relative flex flex-col md:flex-row items-center gap-16">
        <motion.div
          initial={{
            opacity: 0,
            x: -30
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          transition={{
            duration: 0.8,
            ease: 'easeOut'
          }}
          className="flex-1 relative z-10">

          <p className="text-arcticNavy font-bold tracking-[0.2em] uppercase text-sm mb-6">
            Our story
          </p>
          <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter text-obsidian mb-8">
            We built surgimap
            <br />
            because waiting
            <br />
            <span className="text-arcticNavy">shouldn't cost lives.</span>
          </h1>
          <p className="text-steelBlue text-lg md:text-xl leading-relaxed max-w-2xl">
            Surgimap began with a simple, painful observation: in a medical
            emergency, families spend hours physically driving between
            pharmacies just to find a single surgical kit. We thought that gap
            shouldn't exist anymore.
          </p>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            rotate: -2
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0
          }}
          transition={{
            duration: 1,
            delay: 0.2,
            ease: 'easeOut'
          }}
          className="flex-1 w-full max-w-xl">

          <div className="relative group">
            <div className="absolute -inset-4 bg-glacierBlue/20 rounded-[3rem] blur-2xl group-hover:bg-glacierBlue/30 transition-colors duration-500" />
            <div className="relative bg-white border border-silverMist rounded-[2.5rem] p-4 shadow-2xl overflow-hidden">
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000"
                  alt="Medical team working"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />

              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-steelBlue">
                    Live Network Status
                  </span>
                </div>
                <p className="text-sm font-bold text-obsidian">
                  Connecting 500+ pharmacies across Sri Lanka
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute top-[5%] right-[5%] w-[350px] h-[350px] bg-glacierBlue/10 rounded-full -z-10 blur-3xl" />
        <div className="absolute bottom-[10%] left-[30%] w-[250px] h-[250px] bg-silverMist/20 rounded-full -z-10 blur-2xl" />
      </section>

      {/* Mission */}
      <section className="bg-white py-24 px-6 md:px-12 border-t border-silverMist/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-arcticNavy text-iceWhite flex items-center justify-center mb-8">
              <TargetIcon className="w-7 h-7" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-obsidian tracking-tighter leading-tight mb-6">
              Our mission
            </h2>
            <p className="text-steelBlue text-lg leading-relaxed">
              To close the information gap between pharmacies and the people who
              need them most — connecting real-time stock data to real-life
              emergencies, without compromising anyone's privacy along the way.
            </p>
          </div>
          <div>
            <div className="w-14 h-14 rounded-2xl bg-white border border-silverMist text-arcticNavy flex items-center justify-center mb-8">
              <SparklesIcon className="w-7 h-7" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-obsidian tracking-tighter leading-tight mb-6">
              How we got here
            </h2>
            <p className="text-steelBlue text-lg leading-relaxed">
              What started as a hackathon idea grew into a working pipeline — a
              lightweight sync agent, a live geospatial database, and a search
              experience built around one goal: showing families the nearest
              stocked pharmacy in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-arcticNavy py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-glacierBlue/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-steelBlue/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
          {STATS.map((s, i) =>
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.2
              }}
              className="px-8 py-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-colors duration-500 group">

              <motion.p
                initial={{
                  scale: 0.9
                }}
                whileInView={{
                  scale: 1
                }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  delay: i * 0.2 + 0.3
                }}
                className="text-5xl md:text-6xl font-black text-iceWhite tracking-tighter mb-4 group-hover:text-glacierBlue transition-colors">

                {s.value}
              </motion.p>
              <p className="text-iceWhite/70 text-sm md:text-base font-bold uppercase tracking-widest leading-relaxed max-w-[200px] mx-auto">
                {s.label}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 md:px-12 bg-iceWhite">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-arcticNavy font-bold tracking-[0.2em] uppercase text-sm mb-4">
              What we stand for
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-obsidian tracking-tighter leading-none">
              Principles behind
              <br />
              every decision
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((v, i) =>
              <div
                key={i}
                className="bg-white border border-silverMist rounded-[2rem] p-10 hover:shadow-2xl hover:shadow-arcticNavy/5 hover:border-arcticNavy/20 transition-all group">

                <div className="w-14 h-14 rounded-2xl bg-iceWhite border border-silverMist flex items-center justify-center mb-8 text-arcticNavy group-hover:bg-arcticNavy group-hover:text-iceWhite group-hover:scale-110 transition-all">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold text-obsidian mb-3">
                  {v.title}
                </h3>
                <p className="text-steelBlue text-sm leading-relaxed opacity-80">
                  {v.desc}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Our core services */}
      <section className="py-24 px-6 md:px-12 bg-white border-t border-silverMist/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-arcticNavy font-bold tracking-[0.2em] uppercase text-sm mb-4">
              What we offer
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-obsidian tracking-tighter mb-4">
              Our core services
            </h2>
            <p className="text-steelBlue text-lg max-w-xl mx-auto">
              Six features working together to get you the right kit, fast.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map((s, i) => (
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
                  {s.points.map((p, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-steelBlue font-medium">
                      <div className="w-5 h-5 rounded-full bg-arcticNavy/10 flex items-center justify-center shrink-0">
                        <ArrowRightIcon className="w-3 h-3 text-arcticNavy" />
                      </div>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing statement */}
      <section className="py-24 px-6 md:px-12 bg-white border-t border-silverMist/40">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-arcticNavy text-iceWhite flex items-center justify-center mx-auto mb-8">
            <HeartPulseIcon className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-obsidian tracking-tighter leading-tight mb-6">
            Built by students,
            <br />
            for real emergencies.
          </h2>
          <p className="text-steelBlue text-lg leading-relaxed">
            Surgimap is a student-built platform aimed at solving a genuine
            problem in Sri Lanka's healthcare ecosystem — one search, one
            pharmacy, one saved hour at a time.
          </p>
        </div>
      </section>

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
                          l === 'How it works' ?
                            '/how-it-works' :
                            l === 'About' ?
                              '/about' :
                              l === 'Search' ?
                                '/search' :
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

      {/* Mobile Menu Overlay */}
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
              className="text-4xl font-black tracking-tighter text-arcticNavy">

              {link}
            </a>
          )}
          <a
            href="/search"
            className="border border-arcticNavy rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest text-arcticNavy hover:bg-arcticNavy hover:text-iceWhite transition-all">
            Search
          </a>

          <a
            href="/login"
            className="border border-arcticNavy rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest text-arcticNavy hover:bg-arcticNavy hover:text-iceWhite transition-all">
            Login
          </a>

          <a
            href="/#contact"
            className="border border-arcticNavy rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest text-arcticNavy hover:bg-arcticNavy hover:text-iceWhite transition-all">
            Contact
          </a>
        </div>
      }
    </div>);

}

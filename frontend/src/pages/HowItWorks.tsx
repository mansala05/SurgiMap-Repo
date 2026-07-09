import React, { useState } from 'react';
import {
  SearchIcon,
  MapPinIcon,
  PhoneIcon,
  RefreshCwIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  MenuIcon,
  XIcon
} from
  'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = ['About', 'How it works', 'Help'];
const STEPS = [
  {
    tag: 'STEP 1',
    title: 'Search your kit',
    desc: 'Enter the name of the surgical kit your doctor or hospital has requested. Our system searches across all connected pharmacies instantly.',
    cta: 'Search',
    icon: <SearchIcon className="w-7 h-7 text-arcticNavy" />,
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800'
  },
  {
    tag: 'STEP 2',
    title: "See what's in stock",
    desc: 'View a list of nearby pharmacies showing real-time availability — Available, Low Stock, or Out of Stock — so you know exactly where to go.',
    cta: 'View results',
    icon: <MapPinIcon className="w-7 h-7 text-arcticNavy" />,
    image:
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800'
  },
  {
    tag: 'STEP 3',
    title: 'Connect easily',
    desc: 'Use the call or WhatsApp button on each pharmacy card to confirm stock before you travel. No app needed, no sign-up required.',
    cta: 'Connect',
    icon: <PhoneIcon className="w-7 h-7 text-arcticNavy" />,
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
  },
  {
    tag: 'STEP 4',
    title: 'Find Nearby Pharmacies',
    desc: 'Search any location to discover nearby pharmacies, view directions, and explore available healthcare services on Google Maps.',
    cta: 'View on Map',
    href: 'https://www.google.com/maps/dir/?api=1&destination=pharmacy+near+me',
    icon: <RefreshCwIcon className="w-7 h-7 text-arcticNavy" />,
    image:
      'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=800'
  }];

const TESTIMONIALS = [
  {
    quote:
      'SurgiMap found exactly what I needed. The search was quick and the pharmacy had the kit ready.',
    name: 'Amara S.',
    role: 'Patient relative',
    avatar: 'AS',
    logo: 'Colombo General'
  },
  {
    quote:
      'Quick, clear, and reliable — documented exactly which pharmacies had my kit in stock.',
    name: 'Dr. Nimal P.',
    role: 'Surgeon',
    avatar: 'NP',
    logo: 'Lanka Medical'
  }];

const FAQS = [
  {
    q: 'How do I find the right kit?',
    a: "Simply type the name of the surgical kit or the specific items requested by your doctor into our search bar. We'll match it with available inventory."
  },
  {
    q: 'Is the stock information accurate?',
    a: 'Yes, our connected pharmacies update their inventory in real-time to ensure you get the most accurate availability status.'
  },
  {
    q: 'Can I search without signing up?',
    a: 'Absolutely. SurgiMap is designed to be fast and accessible. No account creation is required to search for kits.'
  },
  {
    q: 'How frequently is stock updated?',
    a: 'Stock is updated continuously throughout the day as pharmacies process sales and receive new shipments.'
  }];

const FOOTER_LINKS = {
  Company: ['About', 'Features', 'How it works', 'Search'],
  Support: ['Help center', 'Contact', 'Privacy and Terms']
};
function FaqItem({ question, answer }: { question: string; answer: string; }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-silverMist/40 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left focus:outline-none group gap-6">

        <span className="text-xl md:text-2xl font-bold text-obsidian group-hover:text-arcticNavy transition-colors tracking-tight">
          {question}
        </span>
        <div className="w-10 h-10 shrink-0 rounded-full border border-silverMist flex items-center justify-center group-hover:border-arcticNavy group-hover:bg-arcticNavy group-hover:text-iceWhite transition-all">
          <motion.div
            animate={{
              rotate: isOpen ? 180 : 0
            }}
            transition={{
              duration: 0.2
            }}>

            <ChevronDownIcon className="w-5 h-5" />
          </motion.div>
        </div>
      </button>
      <AnimatePresence>
        {isOpen &&
          <motion.div
            initial={{
              height: 0,
              opacity: 0
            }}
            animate={{
              height: 'auto',
              opacity: 1
            }}
            exit={{
              height: 0,
              opacity: 0
            }}
            transition={{
              duration: 0.2
            }}
            className="overflow-hidden">

            <p className="pt-4 text-base md:text-lg text-steelBlue leading-relaxed max-w-2xl">
              {answer}
            </p>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
export function HowItWorks() {
  const location = useLocation();
  const navigate = useNavigate();
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
                className={`text-xs font-bold uppercase tracking-wider transition-colors ${link === 'How it works' ? 'text-arcticNavy' : 'text-steelBlue hover:text-arcticNavy'}`}>
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
      <section className="max-w-[1440px] mx-auto px-8 md:px-16 py-20 md:py-28 flex flex-col md:flex-row items-center gap-16 relative">
        <div className="flex-1 space-y-8 relative z-10">
          <p className="text-arcticNavy font-bold tracking-[0.2em] uppercase text-sm">
            How it works / Guide
          </p>
          <h1 className="text-6xl md:text-[84px] font-black leading-[0.9] tracking-tighter text-obsidian">
            Find kits
            <br />
            near you fast
          </h1>
          <p className="text-lg md:text-xl text-steelBlue max-w-md leading-relaxed font-medium">
            Locate essential surgical kits across connected pharmacies in
            real-time. No more calling around or driving from store to store.
          </p>
          <div className="flex gap-3 pt-2">
            {[
              'bg-arcticNavy',
              'bg-glacierBlue',
              'bg-steelBlue',
              'bg-silverMist'].
              map((c, i) =>
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1
                  }}
                  transition={{
                    delay: i * 0.1
                  }}
                  className={`w-3 h-3 rounded-full ${c}`} />

              )}
          </div>
        </div>
        <div className="flex-1 w-full relative z-10">
          <div className="aspect-[4/3] bg-silverMist/20 rounded-[3rem] border border-silverMist shadow-2xl flex flex-col items-center justify-center text-steelBlue overflow-hidden">
            <MapPinIcon className="w-16 h-16 text-glacierBlue mb-4" />
            <span className="text-sm font-bold uppercase tracking-widest">
              Interactive Map Preview
            </span>
          </div>
        </div>
      </section>

      {/* Find kits in seconds heading */}
      <section className="max-w-[1440px] mx-auto px-8 md:px-16 pt-8 pb-16 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-obsidian tracking-tighter">
          Find kits in seconds
        </h2>
        <p className="text-steelBlue text-lg mt-6 max-w-2xl mx-auto">
          Follow these simple steps to locate exactly what you need, when you
          need it most.
        </p>
      </section>

      {/* Steps */}
      <section className="max-w-[1440px] mx-auto px-8 md:px-16 pb-32">
        <div className="max-w-6xl mx-auto space-y-24">
          {STEPS.map((step, i) =>
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true,
                margin: '-100px'
              }}
              transition={{
                duration: 0.5
              }}
              key={i}
              className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>

              <div className="flex-1 space-y-6">
                <p className="text-arcticNavy font-bold tracking-[0.2em] uppercase text-sm">
                  {step.tag}
                </p>
                <h3 className="text-3xl md:text-5xl font-black text-obsidian tracking-tight">
                  {step.title}
                </h3>
                <p className="text-steelBlue text-lg md:text-xl leading-relaxed font-medium max-w-md">
                  {step.desc}
                </p>
                {step.href ?
                  <a
                    href={step.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-arcticNavy text-iceWhite px-10 py-4 rounded-2xl text-base font-bold shadow-lg hover:bg-obsidian hover:-translate-y-1 transition-all active:scale-95 group">

                    <MapPinIcon className="w-5 h-5" />
                    {step.cta}
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a> :

                  <button className="inline-flex items-center gap-2 bg-arcticNavy text-iceWhite px-10 py-4 rounded-2xl text-base font-bold shadow-lg hover:bg-obsidian hover:-translate-y-1 transition-all active:scale-95 group">
                    {step.cta}
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                }
              </div>
              <div className="flex-1 w-full">
                <div className="aspect-video bg-white rounded-[2.5rem] border border-silverMist shadow-xl relative overflow-hidden group">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />

                  <div className="absolute inset-0 bg-arcticNavy/5 group-hover:bg-transparent transition-colors" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>



      {/* Answers for every search — FAQ */}
      <section className="bg-white py-32 px-8 md:px-16 border-y border-silverMist/40">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 max-w-6xl mx-auto items-start">
          <div className="flex-1 lg:sticky lg:top-32 space-y-8">
            <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter text-obsidian">
              Answers for
              <br />
              <span className="text-arcticNavy">every search</span>
            </h2>
            <p className="text-steelBlue text-lg max-w-sm leading-relaxed">
              Have questions about how SurgiMap works? We've compiled the most
              common inquiries to help you navigate our platform.
            </p>
            <a href="/help#faq"
              className="bg-arcticNavy text-iceWhite px-10 py-4 rounded-2xl text-base font-bold hover:bg-obsidian transition-all inline-block">
              View all FAQs
            </a>
          </div>
          <div className="flex-[1.5] w-full flex flex-col">
            {FAQS.map((f, i) =>
              <FaqItem key={i} question={f.q} answer={f.a} />
            )}
          </div>
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
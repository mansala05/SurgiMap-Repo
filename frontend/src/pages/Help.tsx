import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HelpCircleIcon,
  SearchIcon,
  MessageSquareIcon,
  PhoneIcon,
  MailIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  MenuIcon,
  XIcon
} from
  'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = ['About', 'How it works', 'Help'];
const FOOTER_LINKS = {
  Company: ['About', 'Features', 'How it works', 'Search'],
  Support: ['Help center', 'Contact', 'Privacy and Terms']
};
const HELP_CATEGORIES = [
  {
    title: 'Getting Started',
    icon: <SearchIcon className="w-6 h-6" />,
    articles: [
      'How to search for a kit',
      'Understanding stock levels',
      'Finding nearby pharmacies']

  },
  {
    title: 'Pharmacy Network',
    icon: <HelpCircleIcon className="w-6 h-6" />,
    articles: [
      'How pharmacies update stock',
      'Joining the SurgiMap network',
      'Reporting incorrect information']

  },
  {
    title: 'Account & Privacy',
    icon: <MessageSquareIcon className="w-6 h-6" />,
    articles: [
      'Do I need an account?',
      'How we protect your data',
      'Terms of service']

  }];

const FAQS = [
  {
    q: 'How accurate is the real-time stock?',
    a: 'Our connected pharmacies update their inventory systems continuously. While we strive for 100% accuracy, we always recommend using the "Connect" button to confirm via WhatsApp or call before traveling for urgent kits.'
  },
  {
    q: 'Is there a cost to use SurgiMap?',
    a: 'No, SurgiMap is completely free for patients and healthcare relatives to search and locate surgical kits.'
  },
  {
    q: 'What if my kit is not listed?',
    a: 'If you cannot find a specific kit, please use our "Contact Support" feature. We can manually check with our extended network of pharmacies for you.'
  },
  {
    q: 'Can I reserve a kit through the app?',
    a: 'Currently, SurgiMap is a locator service. To reserve a kit, please use the direct contact buttons on the pharmacy card to speak with the pharmacist.'
  }];

export function Help() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (window.location.hash === '#faq') {
      const el = document.getElementById('faq');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
                className={`text-xs font-bold uppercase tracking-wider transition-colors ${link === 'Help' ? 'text-arcticNavy' : 'text-steelBlue hover:text-arcticNavy'}`}>
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-iceWhite border-b border-silverMist/30 py-20 px-8 md:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <span className="inline-block bg-glacierBlue/20 text-arcticNavy text-xs font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full">
              Help Center
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-obsidian leading-[0.9]">
              How can we
              <br />
              help you today?
            </h1>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mt-12">
              <div className="flex items-center bg-white border-2 border-silverMist rounded-2xl p-2 shadow-xl shadow-arcticNavy/5 focus-within:border-arcticNavy transition-all">
                <div className="pl-4 pr-2 text-steelBlue">
                  <SearchIcon className="w-6 h-6" />
                </div>
                <input
                  className="flex-1 bg-transparent border-none outline-none py-4 text-lg font-medium text-obsidian placeholder:text-silverMist"
                  type="text"
                  placeholder="Search for articles, guides..." />

              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-24 px-8 md:px-16 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HELP_CATEGORIES.map((cat, i) =>
              <div
                key={i}
                className="bg-white border border-silverMist rounded-[2.5rem] p-10 hover:shadow-2xl hover:shadow-arcticNavy/5 transition-all group">

                <div className="w-14 h-14 rounded-2xl bg-iceWhite border border-silverMist flex items-center justify-center mb-8 group-hover:bg-arcticNavy group-hover:text-iceWhite transition-all text-arcticNavy">
                  {cat.icon}
                </div>
                <h3 className="text-2xl font-black text-obsidian mb-6 tracking-tighter">
                  {cat.title}
                </h3>
                <ul className="space-y-4">
                  {cat.articles.map((art, j) =>
                    <li key={j}>
                      <a
                        href="#"
                        className="flex items-center justify-between text-steelBlue hover:text-arcticNavy font-bold text-sm uppercase tracking-wider group/link">

                        {art}
                        <ChevronRightIcon className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="bg-arcticNavy text-iceWhite py-24 px-8 md:px-16 relative overflow-hidden">          <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-16 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) =>
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">

                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-8 text-left hover:bg-white/10 transition-colors">

                  <span className="text-xl font-bold tracking-tight">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{
                      rotate: openFaq === i ? 180 : 0
                    }}
                    className="text-glacierBlue">

                    <ChevronRightIcon className="w-6 h-6 rotate-90" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i &&
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
                      className="overflow-hidden">

                      <div className="p-8 pt-0 text-glacierBlue text-lg leading-relaxed border-t border-white/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  }
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-glacierBlue/5 blur-[120px] rounded-full -z-0" />
        </section>

        {/* Contact Support Section */}
        <section className="py-24 px-8 md:px-16 max-w-[1440px] mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-6xl font-black text-obsidian tracking-tighter">
              Still need help?
            </h2>
            <p className="text-steelBlue text-xl font-medium">
              Our support team is available 24/7 to help you find the surgical
              supplies you need.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a
                href="mailto:support@surgimap.lk"
                className="flex items-center gap-6 p-8 bg-iceWhite border border-silverMist rounded-[2rem] hover:shadow-xl transition-all group">

                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-arcticNavy shadow-sm group-hover:bg-arcticNavy group-hover:text-iceWhite transition-all">
                  <MailIcon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black uppercase tracking-widest text-steelBlue mb-1">
                    Email us
                  </p>
                  <p className="text-lg font-bold text-obsidian">
                    support@surgimap.lk
                  </p>
                </div>
              </a>
              <a
                href="tel:+94702426077"
                className="flex items-center gap-6 p-8 bg-iceWhite border border-silverMist rounded-[2rem] hover:shadow-xl transition-all group">

                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-arcticNavy shadow-sm group-hover:bg-arcticNavy group-hover:text-iceWhite transition-all">
                  <PhoneIcon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black uppercase tracking-widest text-steelBlue mb-1">
                    Call us
                  </p>
                  <p className="text-lg font-bold text-obsidian">
                    +94 70 242 6077
                  </p>
                </div>
              </a>
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
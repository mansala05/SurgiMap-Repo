import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MenuIcon,
  XIcon,
  HeartPulseIcon,
  ClockIcon,
  ShieldCheckIcon,
  UsersIcon,
  TargetIcon,
  SparklesIcon } from
'lucide-react';
const NAV_LINKS = ['About', 'Services', 'How it works', 'Help'];
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

export function About() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-iceWhite text-obsidian font-sans selection:bg-arcticNavy/10 overflow-x-hidden">
      {/* Navigation */}
      <nav className="max-w-[1440px] mx-auto px-8 md:px-16 py-8 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <a
            href="/"
            className="text-3xl font-black tracking-tighter text-arcticNavy">
            
            surgimap
          </a>
        </div>
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
          <a
            href="/#contact"
            className="border border-arcticNavy rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest text-arcticNavy hover:bg-arcticNavy hover:text-iceWhite transition-all">
            Contact
          </a>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-arcticNavy">
          
          {isMenuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </nav>

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
            href="/login"
            className="text-4xl font-black tracking-tighter text-arcticNavy">
            Login
          </a>
          <a
            href="/#contact"
            className="bg-arcticNavy text-iceWhite rounded-full px-12 py-4 text-sm font-bold uppercase tracking-widest">
            Contact
          </a>
        </div>
      }
    </div>);

}
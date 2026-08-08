import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  PhoneIcon,
  MessageCircleIcon,
  NavigationIcon,
  XIcon,
  MapPinIcon,
  ClockIcon,
  MenuIcon
} from
  'lucide-react';

const NAV_LINKS = ['About', 'How it works', 'Help'];
const PHARMACIES = [
  {
    id: 1,
    name: 'Lanka Care Pharmacy',
    status: 'Available',
    distance: '0.8 km',
    lastUpdated: '10 min ago',
    phone: '+94 70 111 2222',
    x: 18,
    y: 28
  },
  {
    id: 2,
    name: 'Colombo Med Hub',
    status: 'Low Stock',
    distance: '1.2 km',
    lastUpdated: '25 min ago',
    phone: '+94 70 222 3333',
    x: 40,
    y: 16
  },
  {
    id: 3,
    name: 'Healthline Pharmacy',
    status: 'Available',
    distance: '1.5 km',
    lastUpdated: '5 min ago',
    phone: '+94 70 333 4444',
    x: 58,
    y: 42
  },
  {
    id: 4,
    name: 'City Surgical Supplies',
    status: 'Available',
    distance: '2.1 km',
    lastUpdated: '1 hr ago',
    phone: '+94 70 444 5555',
    x: 76,
    y: 26
  },
  {
    id: 5,
    name: 'Wellcare Pharmacy',
    status: 'Low Stock',
    distance: '2.4 km',
    lastUpdated: '40 min ago',
    phone: '+94 70 555 6666',
    x: 30,
    y: 68
  },
  {
    id: 6,
    name: 'Metro Pharmacy',
    status: 'Available',
    distance: '3.0 km',
    lastUpdated: '15 min ago',
    phone: '+94 70 666 7777',
    x: 65,
    y: 75
  }];

const getStatusColors = (status: string) => {
  switch (status) {
    case 'Available':
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
        dot: 'bg-green-500',
        pin: '#16a34a'
      };
    case 'Low Stock':
      return {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        dot: 'bg-amber-500',
        pin: '#d97706'
      };
    default:
      return {
        bg: 'bg-red-100',
        text: 'text-red-700',
        dot: 'bg-red-500',
        pin: '#dc2626'
      };
  }
};
export function MapView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const active = PHARMACIES.find((p) => p.id === activeId);
  const handleBack = () => {
    navigate('/?q=Sterile+Dressing+Kit');
  };
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

      {/* Header / Back Row */}
      <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-silverMist/20">
        <button
          onClick={handleBack}
          className="group inline-flex items-center gap-2 text-arcticNavy font-bold uppercase tracking-widest text-xs hover:text-glacierBlue transition-colors">

          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to list view
        </button>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue opacity-60">
            Showing results for
          </p>
          <p className="text-lg font-black tracking-tight text-obsidian">
            "Sterile Dressing Kit"{' '}
            <span className="text-arcticNavy/40 mx-2">—</span> 6 pharmacies
            nearby
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-12">
        <div className="flex flex-col lg:flex-row gap-8 h-[600px]">
          {/* Map Area */}
          <div className="flex-[1.8] relative group">
            <div className="absolute -inset-4 bg-glacierBlue/5 rounded-[3rem] blur-2xl group-hover:bg-glacierBlue/10 transition-colors duration-500" />
            <div className="relative h-full bg-white border border-silverMist rounded-[2.5rem] shadow-2xl overflow-hidden">
              {/* Fake Map Background */}
              <div className="absolute inset-0 bg-[#eef2f7]">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none">

                  <g stroke="#d4dce6" strokeWidth="0.4" fill="none">
                    <path d="M0,20 C30,15 60,28 100,18" />
                    <path d="M0,45 C35,50 65,38 100,48" />
                    <path d="M0,72 C30,68 70,80 100,70" />
                    <path d="M15,0 C18,40 12,70 16,100" />
                    <path d="M50,0 C46,35 54,70 48,100" />
                    <path d="M80,0 C77,40 84,70 78,100" />
                  </g>
                </svg>
              </div>

              {/* Pins */}
              {PHARMACIES.map((p) => {
                const isActive = activeId === p.id;
                const colors = getStatusColors(p.status);
                return (
                  <motion.button
                    key={p.id}
                    onClick={() => setActiveId(isActive ? null : p.id)}
                    initial={false}
                    animate={{
                      scale: isActive ? 1.2 : 1,
                      zIndex: isActive ? 50 : 10
                    }}
                    className="absolute cursor-pointer focus:outline-none"
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      transform: 'translate(-50%, -100%)'
                    }}>

                    <div className="relative">
                      <svg
                        width="32"
                        height="40"
                        viewBox="0 0 28 34"
                        className="drop-shadow-lg">

                        <path
                          d="M14 0C6.3 0 0 6.3 0 14c0 9.8 14 20 14 20s14-10.2 14-20C28 6.3 21.7 0 14 0z"
                          fill={colors.pin}
                          stroke={isActive ? '#0F172A' : 'white'}
                          strokeWidth={isActive ? 2.5 : 1.5} />

                        <circle cx="14" cy="14" r="5" fill="white" />
                      </svg>
                      {isActive &&
                        <motion.div
                          layoutId="pin-ring"
                          className="absolute -inset-2 border-2 border-arcticNavy rounded-full animate-ping opacity-20" />

                      }
                    </div>
                  </motion.button>);

              })}

              {/* Active Info Card */}
              <AnimatePresence>
                {active &&
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 20,
                      scale: 0.95
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1
                    }}
                    exit={{
                      opacity: 0,
                      y: 20,
                      scale: 0.95
                    }}
                    className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl border border-silverMist rounded-[2rem] p-6 shadow-2xl z-[60]">

                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-black tracking-tight text-obsidian mb-2">
                          {active.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColors(active.status).bg} ${getStatusColors(active.status).text}`}>

                            {active.status}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-steelBlue">
                            <MapPinIcon className="w-3 h-3" />
                            {active.distance} away
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-steelBlue/60">
                            <ClockIcon className="w-3 h-3" />
                            Updated {active.lastUpdated}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveId(null)}
                        className="p-2 hover:bg-silverMist/20 rounded-full transition-colors">

                        <XIcon className="w-5 h-5 text-steelBlue" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button className="flex items-center justify-center gap-2 bg-arcticNavy text-iceWhite py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-obsidian transition-all shadow-lg shadow-arcticNavy/10">
                        <PhoneIcon className="w-4 h-4" />
                        Call
                      </button>
                      <button className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-green-500/10">
                        <MessageCircleIcon className="w-4 h-4" />
                        WhatsApp
                      </button>
                      <button className="flex items-center justify-center gap-2 bg-white border border-silverMist text-obsidian py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-iceWhite transition-all">
                        <NavigationIcon className="w-4 h-4" />
                        Directions
                      </button>
                    </div>
                  </motion.div>
                }
              </AnimatePresence>
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-6 px-4">
              {['Available', 'Low Stock'].map((status) =>
                <div key={status} className="flex items-center gap-2.5">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${getStatusColors(status).dot} shadow-sm`} />

                  <span className="text-[10px] font-black uppercase tracking-widest text-steelBlue">
                    {status}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar List */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {PHARMACIES.map((p) => {
              const isActive = activeId === p.id;
              const colors = getStatusColors(p.status);
              return (
                <motion.div
                  key={p.id}
                  onClick={() => setActiveId(p.id)}
                  whileHover={{
                    x: 4
                  }}
                  className={`p-6 rounded-[2rem] border cursor-pointer transition-all duration-300 ${isActive ? 'bg-arcticNavy border-arcticNavy shadow-xl shadow-arcticNavy/20' : 'bg-white border-silverMist hover:border-arcticNavy/30 hover:shadow-lg'}`}>

                  <div className="flex justify-between items-start mb-4">
                    <h4
                      className={`font-black tracking-tight text-sm ${isActive ? 'text-iceWhite' : 'text-obsidian'}`}>

                      {p.name}
                    </h4>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isActive ? 'bg-white/20 text-iceWhite' : `${colors.bg} ${colors.text}`}`}>

                      {p.status}
                    </span>
                  </div>
                  <div
                    className={`flex flex-col gap-1.5 ${isActive ? 'text-iceWhite/70' : 'text-steelBlue/60'}`}>

                    <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <MapPinIcon className="w-3 h-3" />
                      {p.distance} away
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <ClockIcon className="w-3 h-3" />
                      Updated {p.lastUpdated}
                    </p>
                  </div>
                </motion.div>);

            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-arcticNavy text-iceWhite pt-24 pb-12 px-8 md:px-16 mt-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
            <div className="lg:col-span-2">
              <span className="font-black text-2xl tracking-tighter">
                surgimap
              </span>
              <p className="text-iceWhite/60 text-sm leading-relaxed max-w-xs mt-6">
                Find surgical kits near you, fast. The world's most reliable
                surgical supply locator.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-iceWhite/40 mb-8">
                Company
              </h4>
              <ul className="space-y-4">
                {['About', 'Features', 'How it works', 'Search'].map((l) =>
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm font-bold text-iceWhite/70 hover:text-iceWhite transition-colors">

                      {l}
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-iceWhite/40 mb-8">
                Support
              </h4>
              <ul className="space-y-4">
                {['Help center', 'Contact', 'Privacy and Terms'].map((l) =>
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm font-bold text-iceWhite/70 hover:text-iceWhite transition-colors">

                      {l}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-iceWhite/30">
            <p>© 2026 SurgiMap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>);

}

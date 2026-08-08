import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
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
type SearchResult = {
  pharmacy_id: number;
  pharmacy_name: string;
  address: string;
  phone: string | null;
  whatsapp: string | null;
  latitude: number | null;
  longitude: number | null;
  distance_km: number | null;
  kit_name: string;
  quantity: number;
  status: string;
  last_updated: string;
};

type MapPharmacy = SearchResult & { x: number; y: number };

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')
  .replace(/\/$/, '');

function toMapPharmacy(result: SearchResult): MapPharmacy {
  const x = result.longitude === null
    ? 50
    : Math.min(90, Math.max(10, 10 + ((result.longitude - 79.83) / 0.12) * 80));
  const y = result.latitude === null
    ? 50
    : Math.min(90, Math.max(10, 90 - ((result.latitude - 6.83) / 0.1) * 80));
  return { ...result, x, y };
}

function directionsUrl(pharmacy: MapPharmacy) {
  const destination = pharmacy.latitude !== null && pharmacy.longitude !== null
    ? `${pharmacy.latitude},${pharmacy.longitude}`
    : `${pharmacy.pharmacy_name}, ${pharmacy.address}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

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
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pharmacies, setPharmacies] = useState<MapPharmacy[]>([]);
  const [error, setError] = useState('');
  const active = pharmacies.find((p) => p.pharmacy_id === activeId);

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    setError('');
    fetch(`${API_BASE_URL}/search?item_name=${encodeURIComponent(query)}`, {
      signal: controller.signal
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Search failed (${response.status})`);
        return response.json() as Promise<SearchResult[]>;
      })
      .then((results) => setPharmacies(results.map(toMapPharmacy)))
      .catch((fetchError: Error) => {
        if (fetchError.name !== 'AbortError') setError(fetchError.message);
      });
    return () => controller.abort();
  }, [query]);

  const handleBack = () => {
    navigate(query ? `/?q=${encodeURIComponent(query)}` : '/search');
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
            "{query}"{' '}
            <span className="text-arcticNavy/40 mx-2">—</span> {pharmacies.length} pharmacies
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
              {pharmacies.map((p) => {
                const isActive = activeId === p.pharmacy_id;
                const colors = getStatusColors(p.status);
                return (
                  <motion.button
                    key={p.pharmacy_id}
                    onClick={() => setActiveId(isActive ? null : p.pharmacy_id)}
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
                          {active.pharmacy_name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColors(active.status).bg} ${getStatusColors(active.status).text}`}>

                            {active.status}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-steelBlue">
                            <MapPinIcon className="w-3 h-3" />
                            {active.distance_km !== null ? `${active.distance_km} km away` : active.address}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-steelBlue/60">
                            <ClockIcon className="w-3 h-3" />
                            Updated {new Date(active.last_updated).toLocaleString()}
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
                      <a href={active.phone ? `tel:${active.phone}` : undefined} className="flex items-center justify-center gap-2 bg-arcticNavy text-iceWhite py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-obsidian transition-all shadow-lg shadow-arcticNavy/10">
                        <PhoneIcon className="w-4 h-4" />
                        Call
                      </a>
                      <a href={active.whatsapp ? `https://wa.me/${active.whatsapp.replace(/\D/g, '')}` : undefined} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-green-500/10">
                        <MessageCircleIcon className="w-4 h-4" />
                        WhatsApp
                      </a>
                      <a href={directionsUrl(active)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-white border border-silverMist text-obsidian py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-iceWhite transition-all">
                        <NavigationIcon className="w-4 h-4" />
                        Directions
                      </a>
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
            {error && <p className="p-6 rounded-2xl bg-red-50 text-red-700 font-bold">{error}</p>}
            {pharmacies.map((p) => {
              const isActive = activeId === p.pharmacy_id;
              const colors = getStatusColors(p.status);
              return (
                <motion.div
                  key={p.pharmacy_id}
                  onClick={() => setActiveId(p.pharmacy_id)}
                  whileHover={{
                    x: 4
                  }}
                  className={`p-6 rounded-[2rem] border cursor-pointer transition-all duration-300 ${isActive ? 'bg-arcticNavy border-arcticNavy shadow-xl shadow-arcticNavy/20' : 'bg-white border-silverMist hover:border-arcticNavy/30 hover:shadow-lg'}`}>

                  <div className="flex justify-between items-start mb-4">
                    <h4
                      className={`font-black tracking-tight text-sm ${isActive ? 'text-iceWhite' : 'text-obsidian'}`}>

                      {p.pharmacy_name}
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
                      {p.distance_km !== null ? `${p.distance_km} km away` : p.address}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <ClockIcon className="w-3 h-3" />
                      Updated {new Date(p.last_updated).toLocaleString()}
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

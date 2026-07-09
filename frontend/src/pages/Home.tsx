import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowRightIcon,
  MenuIcon,
  XIcon,
  SearchIcon,
  MapPinIcon,
  MessageSquareIcon,
  ZapIcon,
  MailIcon,
  PhoneIcon,
  PhoneCallIcon,
  MessageCircleIcon
} from
  'lucide-react';
  

const NAV_LINKS = ['About', 'How it works', 'Help'];
const FEATURES = [
  {
    title: 'Search local pharmacies fast',
    desc: 'Type a surgical kit name and instantly see which nearby pharmacies have it in stock.',
    icon: <SearchIcon className="w-5 h-5" />
  },
  {
    title: 'Get stock updates',
    desc: 'See real-time availability so you never travel to an empty shelf.',
    icon: <ZapIcon className="w-5 h-5" />
  },
  {
    title: 'Connect pharmacies easily',
    desc: 'Call or WhatsApp a pharmacy directly from the search results.',
    icon: <MessageSquareIcon className="w-5 h-5" />
  },
  {
    title: 'Map your options',
    desc: 'View pharmacy locations on a map and get directions instantly.',
    icon: <MapPinIcon className="w-5 h-5" />
  }];

const TESTIMONIALS = [
  {
    quote: 'SurgiMap found exactly what I needed. The search was quick and the pharmacy had the kit ready.',
    name: 'Amara S.',
    role: 'Patient relative',
    avatar: 'AS',
    logo: 'Colombo General'
  },
  {
    quote: 'Quick, clear, and reliable — documented exactly which pharmacies had my kit in stock.',
    name: 'Dr. Nimal P.',
    role: 'Surgeon',
    avatar: 'NP',
    logo: 'Lanka Medical'
  }];

const CONTACT = [
  {
    icon: <MailIcon className="w-6 h-6" />,
    label: 'Email support',
    detail: 'support@surgimap.lk'
  },
  {
    icon: <PhoneIcon className="w-6 h-6" />,
    label: 'Call support',
    detail: '+94 70 242 6077'
  },
  {
    icon: <MapPinIcon className="w-6 h-6" />,
    label: 'Mail our office',
    detail: 'Colombo, Sri Lanka'
  }];

const FOOTER_LINKS = {
  Company: ['About', 'Features', 'How it works', 'Search'],
  Support: ['Help center', 'Contact', 'Privacy and Terms']
};

const MOCK_PHARMACIES = [
  {
    id: 1,
    name: 'City Med Pharmacy',
    item: 'Caesarean Surgical Kit',
    distance: '1.2 km',
    address: 'Colombo 07',
    lastUpdated: 'Jun 26, 2026, 8:24 AM',
    availability: 'Available',
    availabilityColor: 'text-green-600',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400',
    phone: '+94 11 234 5678',
    whatsapp: '+94 77 123 4567',
    mapUrl: 'https://www.google.com/maps/search/City+Med+Pharmacy+Colombo+07'
  },
  {
    id: 2,
    name: 'Royal Med Pharmacy',
    item: 'Caesarean Surgical Kit',
    distance: '1.8 km',
    address: 'Kollupitiya',
    lastUpdated: 'Jun 26, 2026, 8:24 AM',
    availability: 'Available',
    availabilityColor: 'text-green-600',
    image:
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=400',
    phone: '+94 11 234 5679',
    whatsapp: '+94 77 123 4568',
    mapUrl: 'https://www.google.com/maps/search/Royal+Med+Pharmacy+Kollupitiya'
  },
  {
    id: 3,
    name: 'CarePlus Pharmacy',
    item: 'Caesarean Surgical Kit',
    distance: '2.4 km',
    address: 'Bambalapitiya',
    lastUpdated: 'Jun 26, 2026, 8:24 AM',
    availability: 'Low Stock',
    availabilityColor: 'text-yellow-600',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400',
    phone: '+94 11 234 5680',
    whatsapp: '+94 77 123 4569',
    mapUrl:
      'https://www.google.com/maps/search/CarePlus+Pharmacy+Bambalapitiya'
  },
  {
    id: 4,
    name: 'LifeLine Pharmacy',
    item: 'Caesarean Surgical Kit',
    distance: '3.1 km',
    address: 'Dehiwala',
    lastUpdated: 'Jun 26, 2026, 8:20 AM',
    availability: 'Out of Stock',
    availabilityColor: 'text-red-600',
    image:
      'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=400',
    phone: '+94 11 234 5681',
    whatsapp: '+94 77 123 4570',
    mapUrl: 'https://www.google.com/maps/search/LifeLine+Pharmacy+Dehiwala'
  }];

const SEARCH_CHIPS = [
  'caesarean',
  'appendix',
  'suture',
  'dressing',
  'general surgery'];

export function Home() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.hash === '#contact') {
      const el = document.getElementById('contact');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchInput.trim()) {
      navigate(`/?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Function to scroll to features section
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (query) {
    return (
      <div className="min-h-screen bg-iceWhite text-obsidian font-sans selection:bg-arcticNavy/10 overflow-x-hidden flex flex-col items-center py-12 px-6">
        {/* Search Results Header */}
        <div className="w-full max-w-2xl text-center space-y-2 mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-arcticNavy">
            SurgiMap
          </h1>
          <p className="text-steelBlue font-medium">
            Find nearby pharmacies with urgent surgical kits
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-2xl flex gap-3 mb-6">

          <div className="flex-1 relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full border border-silverMist rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-arcticNavy transition-colors"
              placeholder="Search for kits..." />

          </div>
          <button
            type="submit"
            className="px-8 py-4 bg-white border border-silverMist rounded-xl font-bold text-silverMist hover:text-arcticNavy hover:border-arcticNavy transition-all">

            Search
          </button>
        </form>

        {/* Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {SEARCH_CHIPS.map((chip) =>
            <button
              key={chip}
              onClick={() => navigate(`/?q=${encodeURIComponent(chip)}`)}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${query.toLowerCase() === chip.toLowerCase() ? 'bg-arcticNavy/5 border-arcticNavy text-arcticNavy' : 'border-silverMist text-steelBlue hover:border-arcticNavy hover:text-arcticNavy'}`}>

              {chip}
            </button>
          )}
        </div>

        <div className="w-full max-w-4xl flex items-center justify-between mb-8">
          <p className="text-steelBlue font-bold">
            {MOCK_PHARMACIES.length} pharmacies found
          </p>
          <button
            onClick={() => navigate('/map-view')}
            className="flex items-center gap-2 bg-white border border-silverMist text-arcticNavy px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:border-arcticNavy transition-all shadow-sm">

            <MapPinIcon className="w-4 h-4" />
            View on Map
          </button>
        </div>

        {/* Pharmacy Cards */}
        <div className="w-full max-w-4xl space-y-8">
          {MOCK_PHARMACIES.map((pharmacy) =>
            <div
              key={pharmacy.id}
              className="bg-white border border-silverMist rounded-[2rem] overflow-hidden shadow-xl shadow-arcticNavy/5 hover:shadow-2xl hover:shadow-arcticNavy/10 transition-all duration-300 group">

              <div className="flex flex-col md:flex-row">
                {/* Kit Image */}
                <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                  <img
                    src={pharmacy.image}
                    alt={pharmacy.item}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex-1 p-10">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-3xl font-black text-arcticNavy tracking-tight leading-tight">
                      {pharmacy.name}
                    </h3>
                    <span
                      className={`font-black text-sm uppercase tracking-widest px-4 py-2 rounded-full bg-white border border-silverMist shadow-sm ${pharmacy.availabilityColor}`}>

                      {pharmacy.availability}
                    </span>
                  </div>

                  <div className="space-y-3 text-obsidian mb-8">
                    <div className="flex items-center gap-3">
                      <ZapIcon className="w-5 h-5 text-arcticNavy" />
                      <p className="text-base font-bold">
                        <span className="text-steelBlue uppercase tracking-tighter text-xs mr-2">
                          Item
                        </span>{' '}
                        {pharmacy.item}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="w-5 h-5 text-arcticNavy" />
                      <p className="text-base font-bold">
                        <span className="text-steelBlue uppercase tracking-tighter text-xs mr-2">
                          Location
                        </span>{' '}
                        {pharmacy.address} • {pharmacy.distance}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <ZapIcon className="w-5 h-5 text-arcticNavy opacity-50" />
                      <p className="text-xs font-bold text-steelBlue uppercase tracking-widest">
                        Updated {pharmacy.lastUpdated}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 pt-6 border-t border-silverMist/30">
                    <a
                      href={`tel:${pharmacy.phone}`}
                      className="flex items-center gap-2 text-arcticNavy hover:text-obsidian font-bold text-sm uppercase tracking-widest transition-colors">

                      <PhoneCallIcon className="w-5 h-5" />
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${pharmacy.whatsapp.replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-600 hover:text-green-700 font-bold text-sm uppercase tracking-widest transition-colors">

                      <MessageCircleIcon className="w-5 h-5" />
                      WhatsApp
                    </a>
                    <a
                      href={pharmacy.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-steelBlue hover:text-arcticNavy font-bold text-sm uppercase tracking-widest transition-colors">

                      <MapPinIcon className="w-5 h-5" />
                      Map
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-12 text-arcticNavy font-bold hover:underline">

          Back to home
        </button>
      </div>);
  }

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
                className="text-xs font-bold uppercase tracking-wider transition-colors text-steelBlue hover:text-arcticNavy">
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

      {/* Hero Section */}
      <main className="max-w-[1440px] mx-auto px-8 md:px-16 pt-12 pb-32 relative">
        <div className="relative z-10">
          {/* Headline - Now with Arrow Right in front */}
          <div className="max-w-5xl mb-16">
            <h1 className="text-6xl md:text-[84px] font-black leading-[0.9] tracking-tighter text-obsidian flex flex-wrap items-center gap-x-6">
              Find the right
              <br />
              surgical supplies
              <br />
              fast.
              <ArrowRightIcon
                className="w-16 h-16 md:w-24 md:h-24 text-arcticNavy inline-block mt-2"
                strokeWidth={3} />

            </h1>
            <div className="mt-8 space-y-2">
              <p className="text-sm font-bold uppercase tracking-tighter text-steelBlue">
                Locate nearby pharmacies
              </p>
              <p className="text-sm font-bold uppercase tracking-tighter text-steelBlue">
                Search for kits at surgimap.lk
              </p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="mt-10 bg-arcticNavy text-iceWhite px-10 py-4 rounded-xl text-base font-bold shadow-lg hover:bg-obsidian hover:-translate-y-1 hover:shadow-xl transition-all active:scale-95">

              Start searching
            </button>
          </div>

          {/* Bottom Cards - Uniform Size, No large focal image on right */}
          <div className="flex flex-wrap gap-8 items-start">
            <div className="w-60 h-80 rounded-[2.5rem] overflow-hidden shadow-xl border border-silverMist hover:-translate-y-4 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=400"
                alt="Pharmacy"
                className="w-full h-full object-cover" />

            </div>
            <div className="w-60 h-80 rounded-[2.5rem] overflow-hidden shadow-xl border border-silverMist hover:-translate-y-4 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400"
                alt="Medical Professional"
                className="w-full h-full object-cover" />

            </div>

            {/* Floating Info Card - Same Size as Photos */}
            <div className="bg-white/90 backdrop-blur-md p-10 rounded-[2.5rem] shadow-xl w-60 h-80 border border-silverMist flex flex-col justify-between hover:-translate-y-4 hover:shadow-2xl transition-all duration-300 cursor-pointer group">
              <div>
                <div className="flex items-center gap-1 mb-6">
                  <span className="text-base font-black tracking-tighter text-arcticNavy">
                    surgimap
                  </span>
                </div>
                <h3 className="text-xl font-black leading-tight mb-4 text-obsidian">
                  Find surgical
                  <br />
                  kits near you
                </h3>
                <p className="text-sm leading-relaxed text-steelBlue opacity-80 font-medium">
                  Everything you need to locate the right kit.
                </p>
              </div>
              <button
                onClick={scrollToFeatures}
                className="w-full border border-arcticNavy/20 rounded-full py-4 text-xs font-bold uppercase tracking-widest text-arcticNavy group-hover:bg-arcticNavy group-hover:text-iceWhite transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Background Decorative Circles - Using Previous Palette */}
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-glacierBlue/10 rounded-full -z-10" />
        <div className="absolute bottom-[5%] left-[20%] w-[300px] h-[300px] bg-silverMist/20 rounded-full -z-10" />
      </main>

      {/* Features */}
      <section id="features" className="bg-white py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-obsidian mb-6 tracking-tight">
              Find surgical kits near you
            </h2>
            <p className="text-steelBlue text-lg max-w-2xl mx-auto">
              Everything you need to locate the right kit at the right pharmacy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {FEATURES.map((f, i) =>
              <div
                key={i}
                className="bg-iceWhite border border-silverMist rounded-[2.5rem] p-10 hover:bg-white hover:shadow-xl hover:shadow-glacierBlue/10 transition-all group">

                <div className="w-14 h-14 rounded-2xl bg-white border border-silverMist flex items-center justify-center mb-8 group-hover:scale-110 transition-transform text-arcticNavy">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold text-obsidian mb-4">
                  {f.title}
                </h3>
                <p className="text-steelBlue text-base md:text-lg leading-relaxed">
                  {f.desc}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="py-32 px-6 md:px-12 text-center bg-arcticNavy text-iceWhite relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
            <span className="bg-gradient-to-r from-glacierBlue via-white to-glacierBlue bg-clip-text text-transparent animate-gradient-x">
              Find kits. Fast.
              <br />
              Stress-free.
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-glacierBlue/70 font-medium leading-relaxed">
            Real-time inventory across local pharmacies, all in one place.
          </p>
        </div>
        {/* Subtle background glow */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-glacierBlue blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-silverMist blur-[120px] rounded-full" />
        </div>
      </section>

      {/* Trusted by those who care the most */}
      <section className="bg-iceWhite py-32 px-8 md:px-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-glacierBlue/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-silverMist/30 blur-[100px] rounded-full" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <p className="text-arcticNavy font-bold tracking-[0.2em] uppercase text-sm mb-4">
                Community Voice
              </p>
              <h2 className="text-4xl md:text-6xl font-black text-obsidian tracking-tighter leading-none">
                Trusted by those who
                <br />
                <span className="text-arcticNavy">care the most.</span>
              </h2>
            </div>
            <button
              onClick={() => navigate('/stories')}
              className="hidden md:flex items-center gap-2 bg-white border border-silverMist text-arcticNavy px-8 py-4 rounded-2xl font-bold hover:bg-arcticNavy hover:text-iceWhite transition-all group shadow-sm">
              Read more stories{' '}
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white/40 backdrop-blur-md border border-white/40 rounded-[2.5rem] p-12 shadow-xl hover:bg-white/60 hover:border-arcticNavy/20 hover:shadow-2xl hover:shadow-arcticNavy/5 transition-all group flex flex-col justify-between">

                <div className="flex mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-arcticNavy fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-obsidian text-2xl md:text-3xl font-medium leading-relaxed mb-12 tracking-tight">
                  "{t.quote}"
                </p>

                <div className="flex items-center justify-between pt-8 border-t border-silverMist/30">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-arcticNavy text-iceWhite flex items-center justify-center font-black text-lg shadow-lg shadow-arcticNavy/20 group-hover:scale-110 transition-transform">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-obsidian text-lg">{t.name}</p>
                      <p className="text-xs text-steelBlue font-bold uppercase tracking-widest mt-0.5">{t.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-arcticNavy bg-iceWhite border border-silverMist rounded-full px-4 py-2">
                    {t.logo}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <button
              onClick={() => navigate('/stories')}
              className="w-full bg-white border border-silverMist text-arcticNavy px-10 py-4 rounded-2xl font-bold hover:bg-arcticNavy hover:text-iceWhite transition-all shadow-sm">
              Read more stories
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 md:px-12 bg-white relative overflow-hidden">        <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col gap-20">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-arcticNavy font-bold tracking-[0.2em] uppercase text-base mb-6">
              GET IN TOUCH
            </p>
            <h2 className="text-5xl md:text-7xl font-black text-obsidian tracking-tighter leading-[0.9] mb-8">
              Questions? Let's
              <br />
              <span className="text-arcticNavy">connect today</span>
            </h2>
            <p className="text-steelBlue text-xl md:text-2xl leading-relaxed">
              Our team is here to help you find what you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ContactCard
              icon={<MailIcon className="w-6 h-6" />}
              title="Email Support"
              detail="support@surgimap.lk"
              description="For general inquiries and kit requests." />

            <ContactCard
              icon={<PhoneIcon className="w-6 h-6" />}
              title="Call Us"
              detail="+94 70 242 6077"
              description="Direct line for urgent supply needs." />

            <ContactCard
              icon={<MapPinIcon className="w-6 h-6" />}
              title="Visit Us"
              detail="Colombo, SL"
              description="Our main logistics and support office." />

          </div>
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

          <a href="/login"
            className="border border-arcticNavy rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest text-arcticNavy hover:bg-arcticNavy hover:text-iceWhite transition-all">
            Login
          </a>

          <a href="#contact"
            className="border border-arcticNavy rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest text-arcticNavy hover:bg-arcticNavy hover:text-iceWhite transition-all">
            Contact
          </a>
        </div>
      }
    </div>);
}

function ContactCard({
  icon,
  title,
  detail,
  description,
  className = ''
}: { icon: React.ReactNode; title: string; detail: string; description: string; className?: string; }) {
  return (
    <div
      className={`bg-iceWhite/50 border border-silverMist rounded-[2rem] p-10 hover:bg-white hover:shadow-2xl hover:shadow-arcticNavy/5 transition-all group cursor-pointer ${className}`}>

      <div className="w-14 h-14 rounded-2xl bg-white border border-silverMist flex items-center justify-center mb-8 group-hover:bg-arcticNavy group-hover:text-iceWhite transition-all group-hover:scale-110 text-arcticNavy">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-obsidian mb-2">{title}</h3>
      <p className="text-arcticNavy font-black text-base mb-4 tracking-tight">
        {detail}
      </p>
      <p className="text-steelBlue text-sm leading-relaxed opacity-70">
        {description}
      </p>
    </div>);
}
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { divIcon, latLngBounds } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import {
  ArrowLeftIcon,
  ClockIcon,
  MapPinIcon,
  MessageCircleIcon,
  NavigationIcon,
  PhoneIcon,
  SearchIcon
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { searchStock, type StockResult } from '../lib/api';
import { requestUserLocation } from '../lib/location';
import { formatStockAge, isStockStale } from '../lib/stock';

const COLOMBO_CENTER: [number, number] = [6.9271, 79.8612];
type MappedStockResult = StockResult & { latitude: number; longitude: number };

function hasCoordinates(result: StockResult): result is MappedStockResult {
  return result.latitude !== null && result.longitude !== null;
}

const getStatusColors = (status: string) => status === 'Available'
  ? { bg: 'bg-green-100', text: 'text-green-700', pin: '#16a34a' }
  : { bg: 'bg-amber-100', text: 'text-amber-700', pin: '#d97706' };

function markerIcon(status: string, isActive: boolean) {
  const { pin } = getStatusColors(status);
  return divIcon({
    className: '',
    html: `<div style="width:${isActive ? 34 : 28}px;height:${isActive ? 34 : 28}px;background:${pin};border:4px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 5px 14px rgba(15,23,42,.3)"><span style="display:block;width:8px;height:8px;background:white;border-radius:50%;margin:${isActive ? 9 : 6}px"></span></div>`,
    iconSize: [isActive ? 34 : 28, isActive ? 34 : 28],
    iconAnchor: [isActive ? 17 : 14, isActive ? 34 : 28]
  });
}

function FitResults({ results }: { results: MappedStockResult[] }) {
  const map = useMap();

  useEffect(() => {
    const points = results.map(
      (result) => [result.latitude, result.longitude] as [number, number]
    );

    if (points.length === 1) map.setView(points[0], 14);
    if (points.length > 1) map.fitBounds(latLngBounds(points), { padding: [45, 45] });
  }, [map, results]);

  return null;
}

export function MapView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const [results, setResults] = useState<StockResult[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(query));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError('');
    requestUserLocation()
      .then((userLocation) => searchStock(query, { signal: controller.signal, location: userLocation }))
      .then((data) => {
        setResults(data);
        setActiveId(data[0]?.pharmacy_id ?? null);
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return;
        setError(reason instanceof Error ? reason.message : 'Could not load map results');
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [query]);

  const mappedResults = useMemo(
    () => results.filter(hasCoordinates),
    [results]
  );
  const backUrl = query ? `/?q=${encodeURIComponent(query)}` : '/search';

  if (!query) {
    return (
      <div className="min-h-screen bg-iceWhite flex items-center justify-center px-6">
        <div className="max-w-lg text-center bg-white border border-silverMist rounded-[2rem] p-10 shadow-xl">
          <SearchIcon className="w-10 h-10 text-arcticNavy mx-auto mb-5" />
          <h1 className="text-2xl font-black text-obsidian">Search for a kit first</h1>
          <p className="text-steelBlue mt-3">The map displays pharmacies from your current search results.</p>
          <button onClick={() => navigate('/search')} className="mt-7 bg-arcticNavy text-white px-7 py-3 rounded-xl font-bold">
            Go to search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-iceWhite text-obsidian font-sans overflow-x-hidden">
      <nav className="sticky top-0 z-[1000] bg-iceWhite/90 backdrop-blur-md border-b border-silverMist/40">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-2xl font-black tracking-tighter text-arcticNavy">surgimap</button>
          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-steelBlue">
            <button onClick={() => navigate('/about')} className="hover:text-arcticNavy">About</button>
            <button onClick={() => navigate('/how-it-works')} className="hover:text-arcticNavy">How it works</button>
            <button onClick={() => navigate('/help')} className="hover:text-arcticNavy">Help</button>
            <button onClick={() => navigate('/search')} className="bg-arcticNavy text-white px-4 py-2 rounded-lg">Search</button>
          </div>
        </div>
      </nav>

      <header className="max-w-[1440px] mx-auto px-8 md:px-16 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-silverMist/20">
        <button onClick={() => navigate(backUrl)} className="group inline-flex items-center gap-2 text-arcticNavy font-bold uppercase tracking-widest text-xs">
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to list view
        </button>
        <div className="md:text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue opacity-60">Showing results for</p>
          <p className="text-lg font-black tracking-tight text-obsidian">
            “{query}” <span className="text-arcticNavy/40 mx-2">—</span>
            {isLoading ? 'Loading…' : `${results.length} pharmacies`}
          </p>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-8 md:px-16 py-10">
        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 font-medium">{error}</div>}
        {!isLoading && !error && results.length === 0 &&
          <div className="mb-6 rounded-2xl border border-silverMist bg-white p-8 text-center">
            <p className="text-xl font-black text-arcticNavy">No in-stock pharmacies found</p>
            <button onClick={() => navigate('/search')} className="mt-3 text-sm font-bold text-steelBlue hover:text-arcticNavy">Try another search</button>
          </div>
        }

        <div className="flex flex-col lg:flex-row gap-8 min-h-[620px]">
          <section className="flex-[1.8] min-h-[520px] rounded-[2.5rem] overflow-hidden border border-silverMist shadow-2xl relative z-0">
            <MapContainer center={COLOMBO_CENTER} zoom={12} scrollWheelZoom className="h-full min-h-[620px] w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FitResults results={mappedResults} />
              {mappedResults.map((pharmacy) => (
                <Marker
                  key={pharmacy.pharmacy_id}
                  position={[pharmacy.latitude, pharmacy.longitude]}
                  icon={markerIcon(pharmacy.status, pharmacy.pharmacy_id === activeId)}
                  eventHandlers={{ click: () => setActiveId(pharmacy.pharmacy_id) }}>
                  <Popup>
                    <strong>{pharmacy.pharmacy_name}</strong><br />
                    {pharmacy.kit_name}: {pharmacy.status}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </section>

          <aside className="flex-1 flex flex-col gap-4 max-h-[620px] overflow-y-auto pr-2 custom-scrollbar">
            {results.map((pharmacy) => {
              const isActive = pharmacy.pharmacy_id === activeId;
              const colors = getStatusColors(pharmacy.status);
              return (
                <div
                  key={pharmacy.pharmacy_id}
                  onClick={() => setActiveId(pharmacy.pharmacy_id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') setActiveId(pharmacy.pharmacy_id);
                  }}
                  role="button"
                  tabIndex={0}
                  className={`text-left p-6 rounded-[2rem] border transition-all ${isActive ? 'bg-arcticNavy border-arcticNavy shadow-xl' : 'bg-white border-silverMist hover:border-arcticNavy/30'}`}>
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <h2 className={`font-black tracking-tight ${isActive ? 'text-white' : 'text-obsidian'}`}>{pharmacy.pharmacy_name}</h2>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isActive ? 'bg-white/20 text-white' : `${colors.bg} ${colors.text}`}`}>
                      {pharmacy.status}
                    </span>
                  </div>
                  <div className={`space-y-2 text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-white/70' : 'text-steelBlue/70'}`}>
                    <p className="flex items-center gap-2"><MapPinIcon className="w-3 h-3" />{pharmacy.address}{pharmacy.distance_km !== null ? ` · ${pharmacy.distance_km.toFixed(1)} km` : ''}</p>
                    <p className="flex items-center gap-2"><ClockIcon className="w-3 h-3" />Updated {formatStockAge(pharmacy.last_updated)}</p>
                    {isStockStale(pharmacy.last_updated) && <p className={isActive ? 'text-amber-200' : 'text-amber-700'}>Call to verify this older update</p>}
                  </div>

                  {isActive &&
                    <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-white/20">
                      {pharmacy.phone
                        ? <a href={`tel:${pharmacy.phone}`} onClick={(event) => event.stopPropagation()} className="flex items-center justify-center gap-1 bg-white text-arcticNavy py-2 rounded-lg text-[10px] font-black"><PhoneIcon className="w-3 h-3" />Call</a>
                        : <span />}
                      {pharmacy.whatsapp
                        ? <a href={`https://wa.me/${pharmacy.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="flex items-center justify-center gap-1 bg-[#25D366] text-white py-2 rounded-lg text-[10px] font-black"><MessageCircleIcon className="w-3 h-3" />Chat</a>
                        : <span />}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="flex items-center justify-center gap-1 bg-white text-arcticNavy py-2 rounded-lg text-[10px] font-black">
                        <NavigationIcon className="w-3 h-3" />Route
                      </a>
                    </div>
                  }
                </div>
              );
            })}
          </aside>
        </div>
      </main>

      <footer className="bg-arcticNavy text-white py-10 px-8 md:px-16 mt-16">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <span className="font-black text-xl">surgimap</span>
          <p className="text-xs text-white/50">© 2026 SurgiMap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

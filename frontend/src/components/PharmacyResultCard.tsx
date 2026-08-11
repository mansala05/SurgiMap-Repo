import { useEffect, useState } from 'react';
import {
  ClockIcon,
  MapPinIcon,
  MessageCircleIcon,
  NavigationIcon,
  PhoneCallIcon,
  ZapIcon
} from 'lucide-react';
import type { StockResult } from '../lib/api';
import type { UserLocation } from '../lib/location';
import {
  getPharmacyImage,
  PHARMACY_IMAGE_FALLBACK
} from '../lib/pharmacyPresentation';
import {
  formatStockTimestamp,
  getSyncFreshness
} from '../lib/stock';

type PharmacyResultCardProps = {
  pharmacy: StockResult;
  userLocation: UserLocation | null;
};

function directionsUrl(pharmacy: StockResult, userLocation: UserLocation | null): string {
  if (pharmacy.latitude === null || pharmacy.longitude === null) {
    return `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${pharmacy.pharmacy_name} ${pharmacy.address}`)}`;
  }
  if (userLocation) {
    return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation.latitude}%2C${userLocation.longitude}%3B${pharmacy.latitude}%2C${pharmacy.longitude}`;
  }
  return `https://www.openstreetmap.org/?mlat=${pharmacy.latitude}&mlon=${pharmacy.longitude}#map=16/${pharmacy.latitude}/${pharmacy.longitude}`;
}

export function PharmacyResultCard({ pharmacy, userLocation }: PharmacyResultCardProps) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const freshness = getSyncFreshness(pharmacy.last_updated, now);
  const exactUpdateTime = formatStockTimestamp(pharmacy.last_updated);
  const freshnessColor = freshness.state === 'live'
    ? 'text-green-600'
    : freshness.state === 'delayed'
      ? 'text-amber-600'
      : 'text-red-600';

  return (
    <article className="bg-white border border-silverMist rounded-[2rem] overflow-hidden shadow-xl shadow-arcticNavy/5 hover:shadow-2xl hover:shadow-arcticNavy/10 transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
          <img
            src={getPharmacyImage(pharmacy.pharmacy_id)}
            alt={`${pharmacy.pharmacy_name} pharmacy`}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = PHARMACY_IMAGE_FALLBACK;
            }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="flex-1 p-8 md:p-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
            <h3 className="text-3xl font-black text-arcticNavy tracking-tight leading-tight">
              {pharmacy.pharmacy_name}
            </h3>
            <span className={`self-start font-black text-sm uppercase tracking-widest px-4 py-2 rounded-full bg-white border border-silverMist shadow-sm ${pharmacy.status === 'Available' ? 'text-green-600' : 'text-yellow-600'}`}>
              {pharmacy.status}
            </span>
          </div>

          <div className="space-y-3 text-obsidian mb-8">
            <div className="flex items-start gap-3">
              <ZapIcon className="w-5 h-5 mt-0.5 shrink-0 text-arcticNavy" />
              <p className="text-base font-bold">
                <span className="text-steelBlue uppercase tracking-tighter text-xs mr-2">
                  {/\bkit\b/i.test(pharmacy.kit_name) ? 'Kit' : 'Item'}
                </span>{' '}
                {pharmacy.kit_name}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <MapPinIcon className="w-5 h-5 mt-0.5 shrink-0 text-arcticNavy" />
              <p className="text-base font-bold">
                <span className="text-steelBlue uppercase tracking-tighter text-xs mr-2">Location</span>{' '}
                {pharmacy.address}
                {pharmacy.distance_km !== null ? ` · ${pharmacy.distance_km.toFixed(1)} km away` : ''}
              </p>
            </div>
            <div className="flex items-center gap-3" title={`Last successful sync: ${exactUpdateTime}`}>
              <ClockIcon className={`w-5 h-5 shrink-0 ${freshnessColor}`} />
              <p className={`text-xs font-black uppercase tracking-widest ${freshnessColor}`}>
                {freshness.label}
              </p>
            </div>
            {freshness.state !== 'live' &&
              <p className={`text-xs font-bold rounded-lg px-3 py-2 border ${freshness.state === 'delayed' ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-red-700 bg-red-50 border-red-200'}`}>
                {freshness.state === 'delayed'
                  ? 'The pharmacy missed recent sync cycles. Call to confirm before travelling.'
                  : 'Automatic stock sync appears offline. Call the pharmacy to verify availability.'}
              </p>
            }
          </div>

          <div className="flex flex-wrap gap-6 pt-6 border-t border-silverMist/30">
            {pharmacy.phone &&
              <a href={`tel:${pharmacy.phone}`} className="flex items-center gap-2 text-arcticNavy hover:text-obsidian font-bold text-sm uppercase tracking-widest transition-colors">
                <PhoneCallIcon className="w-5 h-5" />Call
              </a>
            }
            {pharmacy.whatsapp &&
              <a href={`https://wa.me/${pharmacy.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 hover:text-green-700 font-bold text-sm uppercase tracking-widest transition-colors">
                <MessageCircleIcon className="w-5 h-5" />WhatsApp
              </a>
            }
            <a href={directionsUrl(pharmacy, userLocation)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-steelBlue hover:text-arcticNavy font-bold text-sm uppercase tracking-widest transition-colors">
              <NavigationIcon className="w-5 h-5" />Directions
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

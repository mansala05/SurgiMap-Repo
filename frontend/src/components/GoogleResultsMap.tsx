import { useEffect, useRef, useState } from 'react';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { ExternalLinkIcon, MapPinIcon } from 'lucide-react';
import type { StockResult } from '../lib/api';
import type { UserLocation } from '../lib/location';

type MappedStockResult = StockResult & { latitude: number; longitude: number };

type GoogleResultsMapProps = {
  results: MappedStockResult[];
  activeId: number | null;
  userLocation: UserLocation | null;
  onActive: (pharmacyId: number) => void;
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID?.trim() || 'DEMO_MAP_ID';
let configuredApiKey: string | null = null;

async function loadGoogleMaps(apiKey: string) {
  if (configuredApiKey === null) {
    setOptions({ key: apiKey });
    configuredApiKey = apiKey;
  }
  if (configuredApiKey !== apiKey) {
    throw new Error('Google Maps was initialized with a different API key');
  }

  const [mapsLibrary, markerLibrary] = await Promise.all([
    importLibrary('maps'),
    importLibrary('marker')
  ]);
  return { mapsLibrary, markerLibrary };
}

export function GoogleResultsMap({
  results,
  activeId,
  userLocation,
  onActive
}: GoogleResultsMapProps) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerLibrary, setMarkerLibrary] = useState<google.maps.MarkerLibrary | null>(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || !mapElementRef.current) return;
    let cancelled = false;

    loadGoogleMaps(GOOGLE_MAPS_API_KEY)
      .then(({ mapsLibrary, markerLibrary: loadedMarkerLibrary }) => {
        if (cancelled || !mapElementRef.current) return;
        const googleMap = new mapsLibrary.Map(mapElementRef.current, {
          center: { lat: 6.9271, lng: 79.8612 },
          zoom: 12,
          mapId: GOOGLE_MAP_ID,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true
        });
        setMap(googleMap);
        setMarkerLibrary(loadedMarkerLibrary);
      })
      .catch(() => {
        if (!cancelled) setLoadError('Google Maps could not load. Check the API key and allowed website origins.');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!map || !markerLibrary) return;
    const markers: google.maps.marker.AdvancedMarkerElement[] = [];
    const bounds = new google.maps.LatLngBounds();

    results.forEach((pharmacy, index) => {
      const isActive = pharmacy.pharmacy_id === activeId;
      const position = { lat: pharmacy.latitude, lng: pharmacy.longitude };
      const pin = new markerLibrary.PinElement({
        background: pharmacy.status === 'Available' ? '#16a34a' : '#d97706',
        borderColor: isActive ? '#172033' : '#ffffff',
        glyphColor: '#ffffff',
        glyphText: String(index + 1),
        scale: isActive ? 1.55 : 1.22
      });
      const markerContent = document.createElement('div');
      markerContent.style.filter = isActive
        ? 'drop-shadow(0 6px 8px rgba(15, 23, 42, 0.5))'
        : 'drop-shadow(0 4px 5px rgba(15, 23, 42, 0.35))';
      markerContent.append(pin.element);
      const marker = new markerLibrary.AdvancedMarkerElement({
        map,
        position,
        title: `${index + 1}. ${pharmacy.pharmacy_name} - ${pharmacy.status}`,
        content: markerContent,
        zIndex: isActive ? 20 : 10
      });
      marker.addListener('click', () => onActive(pharmacy.pharmacy_id));
      markers.push(marker);
      bounds.extend(position);
    });

    if (userLocation) {
      const position = { lat: userLocation.latitude, lng: userLocation.longitude };
      const userPin = new markerLibrary.PinElement({
        background: '#2563eb',
        borderColor: '#ffffff',
        glyphColor: '#ffffff',
        glyphText: '●',
        scale: 1.1
      });
      const userMarker = new markerLibrary.AdvancedMarkerElement({
        map,
        position,
        title: userLocation.label,
        content: userPin.element,
        zIndex: 30
      });
      markers.push(userMarker);
      bounds.extend(position);
    }

    if (!bounds.isEmpty()) {
      if (results.length === 1 && !userLocation) {
        map.setCenter(bounds.getCenter());
        map.setZoom(14);
      } else {
        map.fitBounds(bounds, 50);
      }
    }

    return () => {
      markers.forEach((marker) => {
        marker.map = null;
      });
    };
  }, [activeId, map, markerLibrary, onActive, results, userLocation]);

  if (!GOOGLE_MAPS_API_KEY || loadError) {
    const first = results[0];
    const googleMapsUrl = first
      ? `https://www.google.com/maps/dir/?api=1${userLocation ? `&origin=${userLocation.latitude},${userLocation.longitude}` : ''}&destination=${first.latitude},${first.longitude}&travelmode=driving`
      : 'https://www.google.com/maps';
    return (
      <div className="h-full min-h-[620px] bg-gradient-to-br from-slate-100 via-white to-blue-50 flex items-center justify-center p-6 text-center">
        <div className="w-full max-w-lg rounded-[2rem] border border-silverMist bg-white/90 p-7 shadow-xl">
          <MapPinIcon className="w-12 h-12 text-arcticNavy mx-auto mb-5" />
          <h2 className="text-xl font-black text-obsidian">
            {first ? 'Open these pharmacies in Google Maps' : 'Preparing map results…'}
          </h2>
          <p className="mt-3 text-sm text-steelBlue">
            {loadError || (first
              ? 'Driving directions are available now. Add a Google Maps browser key later to display the interactive map inside SurgiMap.'
              : 'Matching pharmacies will appear here when the search finishes.')}
          </p>
          {first && <>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-arcticNavy text-white px-5 py-3 rounded-xl text-sm font-bold">
              Directions to nearest <ExternalLinkIcon className="w-4 h-4" />
            </a>
            <div className="mt-6 grid gap-2 text-left">
              {results.slice(0, 5).map((pharmacy) => (
                <a
                  key={pharmacy.pharmacy_id}
                  href={`https://www.google.com/maps/search/?api=1&query=${pharmacy.latitude},${pharmacy.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-silverMist px-4 py-3 text-sm font-bold text-arcticNavy hover:border-arcticNavy">
                  <span className="truncate pr-3">{pharmacy.pharmacy_name}</span>
                  <ExternalLinkIcon className="h-4 w-4 shrink-0" />
                </a>
              ))}
            </div>
          </>}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[620px] w-full">
      <div ref={mapElementRef} className="absolute inset-0" aria-label="Google Map of matching pharmacies" />
      <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-wrap gap-2 rounded-2xl border border-white/80 bg-white/95 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-obsidian shadow-lg backdrop-blur-sm">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-green-600 ring-2 ring-white" />Available</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-amber-600 ring-2 ring-white" />Low stock</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-blue-600 ring-2 ring-white" />You</span>
      </div>
    </div>
  );
}

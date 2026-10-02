import { useEffect, useRef, useState } from 'react';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import type { StockResult } from '../lib/api';
import type { UserLocation } from '../lib/location';
import { directionsUrl } from '../lib/maps';

type Props = {
  results: (StockResult & { latitude: number; longitude: number })[];
  activeId: number | null;
  userLocation: UserLocation | null;
  onActive: (pharmacyId: number) => void;
};

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();
if (apiKey) setOptions({ key: apiKey, v: 'weekly' });

export function GoogleResultsMap({ results, activeId, userLocation, onActive }: Props) {
  const elementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const selected = results.find((result) => result.pharmacy_id === activeId) ?? results[0];

  useEffect(() => {
    if (!apiKey) return;
    let cancelled = false;
    Promise.all([importLibrary('maps'), importLibrary('marker')]).then(([maps]) => {
      if (cancelled || !elementRef.current) return;
      const { Map } = maps as google.maps.MapsLibrary;
      mapRef.current = new Map(elementRef.current, {
        center: { lat: 6.9271, lng: 79.8612 },
        zoom: 12,
        mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID',
        mapTypeControl: false,
        streetViewControl: false,
      });
      setReady(true);
    }).catch(() => {
      if (!cancelled) setError('The interactive map could not load. Select a pharmacy to view its location below.');
    });
    return () => {
      cancelled = true;
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    const bounds = new google.maps.LatLngBounds();
    const markers: google.maps.marker.AdvancedMarkerElement[] = [];
    results.forEach((pharmacy, index) => {
      const position = { lat: pharmacy.latitude, lng: pharmacy.longitude };
      const pin = new google.maps.marker.PinElement({
        background: pharmacy.status === 'Available' ? '#16a34a' : '#d97706',
        borderColor: pharmacy.pharmacy_id === activeId ? '#172033' : '#ffffff',
        glyphColor: '#ffffff',
        glyphText: String(index + 1),
        scale: pharmacy.pharmacy_id === activeId ? 1.3 : 1,
      });
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map, position, content: pin,
        title: `${index + 1}. ${pharmacy.pharmacy_name} — ${pharmacy.status}`,
      });
      marker.addListener('click', () => onActive(pharmacy.pharmacy_id));
      markers.push(marker);
      bounds.extend(position);
    });
    if (userLocation) {
      const position = { lat: userLocation.latitude, lng: userLocation.longitude };
      const pin = new google.maps.marker.PinElement({ background: '#2563eb', glyphColor: '#ffffff' });
      markers.push(new google.maps.marker.AdvancedMarkerElement({ map, position, content: pin, title: userLocation.label }));
      bounds.extend(position);
    }
    if (!bounds.isEmpty()) {
      if (results.length === 1 && !userLocation) {
        map.setCenter(bounds.getCenter());
        map.setZoom(14);
      } else {
        map.fitBounds(bounds, 48);
      }
    }
    return () => markers.forEach((marker) => {
      google.maps.event.clearInstanceListeners(marker);
      marker.map = null;
    });
  }, [ready, results, activeId, userLocation, onActive]);

  const fallback = !apiKey || Boolean(error);
  const query = selected ? `${selected.latitude},${selected.longitude}` : 'Colombo Sri Lanka';
  return (
    <div className="relative h-full min-h-[620px] w-full">
      {fallback ? <iframe
        title={selected ? `Google Maps: ${selected.pharmacy_name}` : 'Google Maps pharmacy locations'}
        src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      /> : <div ref={elementRef} className="absolute inset-0" aria-label="Google Maps showing matching pharmacies" />}
      {fallback && <div className="absolute left-4 right-4 top-4 rounded-xl bg-white/95 p-3 text-sm shadow-lg">
        <p>{error || 'Select a pharmacy from the list to view it on Google Maps.'}</p>
        {selected && <a className="font-bold text-arcticNavy underline" href={directionsUrl(selected, userLocation)} target="_blank" rel="noreferrer">Directions to {selected.pharmacy_name}</a>}
      </div>}
      {!fallback && !ready && <p className="absolute left-4 top-4 rounded-xl bg-white p-3" role="status">Loading Google Maps…</p>}
    </div>
  );
}

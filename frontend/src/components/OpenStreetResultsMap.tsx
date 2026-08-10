import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { StockResult } from '../lib/api';
import type { UserLocation } from '../lib/location';

type MappedStockResult = StockResult & { latitude: number; longitude: number };

type OpenStreetResultsMapProps = {
  results: MappedStockResult[];
  activeId: number | null;
  userLocation: UserLocation | null;
  onActive: (pharmacyId: number) => void;
};

const COLOMBO: L.LatLngExpression = [6.9271, 79.8612];

function pharmacyIcon(index: number, status: string, isActive: boolean) {
  const statusClass = status === 'Available' ? 'is-available' : 'is-low-stock';
  const size = isActive ? 42 : 34;
  return L.divIcon({
    className: 'osm-marker-shell',
    html: `<span class="osm-pharmacy-marker ${statusClass}${isActive ? ' is-active' : ''}">${index + 1}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

export function OpenStreetResultsMap({
  results,
  activeId,
  userLocation,
  onActive
}: OpenStreetResultsMapProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const resultLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!elementRef.current || mapRef.current) return;

    const map = L.map(elementRef.current, {
      center: COLOMBO,
      zoom: 12,
      zoomControl: true
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    mapRef.current = map;
    resultLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      resultLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = resultLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    const bounds = L.latLngBounds([]);

    results.forEach((pharmacy, index) => {
      const position: L.LatLngExpression = [pharmacy.latitude, pharmacy.longitude];
      const isActive = pharmacy.pharmacy_id === activeId;
      const marker = L.marker(position, {
        icon: pharmacyIcon(index, pharmacy.status, isActive),
        keyboard: true,
        riseOnHover: true,
        title: `${index + 1}. ${pharmacy.pharmacy_name} — ${pharmacy.status}`
      });
      marker.on('click', () => onActive(pharmacy.pharmacy_id));
      marker.addTo(layer);
      bounds.extend(position);
    });

    if (userLocation) {
      const position: L.LatLngExpression = [
        userLocation.latitude,
        userLocation.longitude
      ];
      L.circleMarker(position, {
        radius: 9,
        color: '#ffffff',
        weight: 3,
        fillColor: '#2563eb',
        fillOpacity: 1
      })
        .bindTooltip(userLocation.label, { direction: 'top' })
        .addTo(layer);
      bounds.extend(position);
    }

    if (bounds.isValid()) {
      if (results.length === 1 && !userLocation) {
        map.setView(bounds.getCenter(), 14);
      } else {
        map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
      }
    }
  }, [activeId, onActive, results, userLocation]);

  return (
    <div className="relative h-full min-h-[620px] w-full">
      <div
        ref={elementRef}
        className="absolute inset-0"
        aria-label="OpenStreetMap showing matching pharmacies"
      />
      <div className="pointer-events-none absolute left-4 top-4 z-[500] flex flex-wrap gap-2 rounded-2xl border border-white/80 bg-white/95 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-obsidian shadow-lg backdrop-blur-sm">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-green-600 ring-2 ring-white" />Available</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-amber-600 ring-2 ring-white" />Low stock</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-blue-600 ring-2 ring-white" />You</span>
      </div>
    </div>
  );
}

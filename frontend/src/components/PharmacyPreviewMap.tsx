import { useEffect, useRef, useState } from 'react';
import { MapPinIcon } from 'lucide-react';
import { getPharmacies, type Pharmacy } from '../lib/api';

const ZOOM = 11;
const TILE_SIZE = 256;
const CENTER = { latitude: 6.885, longitude: 79.885 };

function point(latitude: number, longitude: number) {
  const scale = TILE_SIZE * 2 ** ZOOM;
  const sin = Math.sin(latitude * Math.PI / 180);
  return {
    x: (longitude + 180) / 360 * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}

export function PharmacyPreviewMap() {
  const container = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getPharmacies(controller.signal)
      .then(setPharmacies)
      .catch((reason: unknown) => {
        if (!(reason instanceof DOMException && reason.name === 'AbortError')) {
          setError('Start the API to show the demo pharmacy locations.');
        }
      });
    return () => controller.abort();
  }, []);

  const center = point(CENTER.latitude, CENTER.longitude);
  const left = center.x - size.width / 2;
  const top = center.y - size.height / 2;
  const tiles = [];
  for (let x = Math.floor(left / TILE_SIZE); x <= Math.floor((left + size.width) / TILE_SIZE); x++) {
    for (let y = Math.floor(top / TILE_SIZE); y <= Math.floor((top + size.height) / TILE_SIZE); y++) {
      tiles.push(<img
        key={`${x}-${y}`}
        src={`https://tile.openstreetmap.org/${ZOOM}/${x}/${y}.png`}
        alt=""
        draggable={false}
        className="absolute max-w-none select-none"
        style={{ left: x * TILE_SIZE - left, top: y * TILE_SIZE - top, width: TILE_SIZE, height: TILE_SIZE }}
      />);
    }
  }

  const active = pharmacies.find((pharmacy) => pharmacy.id === selected);
  return (
    <div ref={container} role="region" aria-label="Map of demo pharmacies around Colombo" className="relative aspect-[4/3] w-full overflow-hidden rounded-[3rem] border border-silverMist bg-slate-200 shadow-2xl">
      {tiles}
      {pharmacies.filter((pharmacy): pharmacy is Pharmacy & { latitude: number; longitude: number } => pharmacy.latitude !== null && pharmacy.longitude !== null).map((pharmacy) => {
        const position = point(pharmacy.latitude, pharmacy.longitude);
        return <button
          key={pharmacy.id}
          type="button"
          title={`${pharmacy.name}, ${pharmacy.address}`}
          aria-label={`Show ${pharmacy.name} in ${pharmacy.address}`}
          onClick={() => setSelected(pharmacy.id)}
          className="absolute z-10 -translate-x-1/2 -translate-y-full text-arcticNavy drop-shadow-md transition-transform hover:scale-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          style={{ left: position.x - left, top: position.y - top }}
        ><MapPinIcon className="h-8 w-8 fill-white" /></button>;
      })}
      <div className="absolute left-4 top-4 z-20 rounded-xl bg-white/95 px-3 py-2 text-xs font-bold text-arcticNavy shadow">
        {error || `${pharmacies.length} demo pharmacy locations · select a pin`}
      </div>
      {active && <div className="absolute bottom-8 left-4 right-4 z-20 rounded-xl bg-white p-3 text-sm shadow-lg">
        <strong>{active.name}</strong><span className="ml-2 text-steelBlue">{active.address}</span>
        <a className="ml-3 font-bold text-arcticNavy underline" href={`https://www.google.com/maps/dir/?api=1&destination=${active.latitude},${active.longitude}`} target="_blank" rel="noreferrer">Directions</a>
      </div>}
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="absolute bottom-1 right-2 z-20 rounded bg-white/90 px-1 text-[10px] text-slate-700">© OpenStreetMap contributors</a>
    </div>
  );
}

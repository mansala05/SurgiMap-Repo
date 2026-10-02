import type { StockResult } from './api';
import type { UserLocation } from './location';

export function directionsUrl(pharmacy: StockResult, location: UserLocation | null): string {
  const destination = pharmacy.latitude !== null && pharmacy.longitude !== null
    ? `${pharmacy.latitude},${pharmacy.longitude}`
    : `${pharmacy.pharmacy_name} ${pharmacy.address}`;
  const params = new URLSearchParams({ api: '1', destination, travelmode: 'driving' });
  if (location) params.set('origin', `${location.latitude},${location.longitude}`);
  return `https://www.google.com/maps/dir/?${params}`;
}

export type UserLocation = {
  latitude: number;
  longitude: number;
  label: string;
  source: 'current' | 'manual';
};

export type LocationStatus =
  | 'requesting'
  | 'ready'
  | 'denied'
  | 'timeout'
  | 'unavailable'
  | 'insecure';

export type LocationResult = {
  location: UserLocation | null;
  status: LocationStatus;
  message?: string;
};

export const AREA_LOCATIONS: UserLocation[] = [
  { label: 'Colombo', latitude: 6.9271, longitude: 79.8612, source: 'manual' },
  { label: 'Nugegoda', latitude: 6.8649, longitude: 79.8997, source: 'manual' },
  { label: 'Dehiwala', latitude: 6.8511, longitude: 79.8656, source: 'manual' },
  { label: 'Maharagama', latitude: 6.8480, longitude: 79.9265, source: 'manual' },
  { label: 'Battaramulla', latitude: 6.9022, longitude: 79.9197, source: 'manual' }
];

const LOCATION_KEY = 'surgimap-user-location';
const LOCATION_DENIED_KEY = 'surgimap-location-unavailable';
let manualSelectionVersion = 0;

export function getStoredUserLocation(): UserLocation | null {
  try {
    const value = sessionStorage.getItem(LOCATION_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<UserLocation>;
    if (typeof parsed.latitude !== 'number' || typeof parsed.longitude !== 'number'
      || !Number.isFinite(parsed.latitude) || !Number.isFinite(parsed.longitude)
      || Math.abs(parsed.latitude) > 90 || Math.abs(parsed.longitude) > 180) return null;
    return {
      latitude: parsed.latitude,
      longitude: parsed.longitude,
      label: parsed.label || 'Selected location',
      source: parsed.source === 'manual' ? 'manual' : 'current'
    };
  } catch {
    return null;
  }
}

function storeLocation(location: UserLocation): void {
  try {
    sessionStorage.setItem(LOCATION_KEY, JSON.stringify(location));
    sessionStorage.removeItem(LOCATION_DENIED_KEY);
  } catch {
    // The location still works for the current request when storage is unavailable.
  }
}

export function setManualLocation(location: UserLocation): void {
  manualSelectionVersion += 1;
  storeLocation({ ...location, source: 'manual' });
}

export function getLocationMessage(status: LocationStatus): string {
  switch (status) {
    case 'denied':
      return 'Allow location access in your browser and device settings, or select an area.';
    case 'timeout':
      return 'Your device took too long to locate you. Try again or select an area.';
    case 'insecure':
      return 'Open this app over HTTPS or localhost to use current location, or select an area.';
    default:
      return 'Your browser could not determine your location. Check device Location Services or select an area.';
  }
}

export function requestCurrentLocation(force = false): Promise<LocationResult> {
  const stored = getStoredUserLocation();
  if (!force && stored) return Promise.resolve({ location: stored, status: 'ready' });
  const selectionVersion = manualSelectionVersion;

  const selectedWhileRequesting = (): UserLocation | null =>
    manualSelectionVersion !== selectionVersion ? getStoredUserLocation() : null;

  const failure = (status: LocationStatus): LocationResult => {
    const fallback = selectedWhileRequesting() || stored;
    return fallback
      ? { location: fallback, status: 'ready', message: `${getLocationMessage(status)} Using ${fallback.label}.` }
      : { location: null, status, message: getLocationMessage(status) };
  };

  // A previous denial must not prevent a new request after permissions change.
  try {
    sessionStorage.removeItem(LOCATION_DENIED_KEY);
  } catch {
    // Storage is optional; browser location detection can still work.
  }

  if (!window.isSecureContext) return Promise.resolve(failure('insecure'));
  if (!navigator.geolocation) return Promise.resolve(failure('unavailable'));

  return new Promise((resolve) => {
    const attempt = (highAccuracy: boolean) => {
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const selected = selectedWhileRequesting();
            if (selected) {
              resolve({ location: selected, status: 'ready' });
              return;
            }
            const { latitude, longitude } = position.coords;
            if (!Number.isFinite(latitude) || !Number.isFinite(longitude)
              || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
              resolve(failure('unavailable'));
              return;
            }
            const location: UserLocation = {
              latitude, longitude, label: 'Current location', source: 'current'
            };
            storeLocation(location);
            resolve({ location, status: 'ready' });
          },
          (error) => {
            if (selectedWhileRequesting()) {
              resolve({ location: selectedWhileRequesting(), status: 'ready' });
              return;
            }
            // A coarse network-based position may work when high accuracy fails.
            if (highAccuracy && (error.code === 2 || error.code === 3)) {
              attempt(false);
              return;
            }
            resolve(failure(error.code === 1 ? 'denied' : error.code === 3 ? 'timeout' : 'unavailable'));
          },
          { enableHighAccuracy: highAccuracy, timeout: 10000, maximumAge: force ? 0 : 120000 }
        );
      } catch {
        resolve(failure('unavailable'));
      }
    };
    attempt(true);
  });
}

export function resolveUserLocation(): Promise<LocationResult> {
  return requestCurrentLocation(false);
}

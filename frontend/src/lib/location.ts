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
  | 'unavailable';

export type LocationResult = {
  location: UserLocation | null;
  status: LocationStatus;
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

export function getStoredUserLocation(): UserLocation | null {
  try {
    const value = sessionStorage.getItem(LOCATION_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<UserLocation>;
    if (typeof parsed.latitude !== 'number' || typeof parsed.longitude !== 'number') return null;
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
  storeLocation({ ...location, source: 'manual' });
}

export function requestCurrentLocation(force = false): Promise<LocationResult> {
  if (!force) {
    const stored = getStoredUserLocation();
    if (stored) return Promise.resolve({ location: stored, status: 'ready' });
    try {
      if (sessionStorage.getItem(LOCATION_DENIED_KEY) === 'true') {
        return Promise.resolve({ location: null, status: 'denied' });
      }
    } catch {
      // Continue to the browser geolocation request.
    }
  } else {
    try {
      sessionStorage.removeItem(LOCATION_KEY);
      sessionStorage.removeItem(LOCATION_DENIED_KEY);
    } catch {
      // Continue to the browser geolocation request.
    }
  }

  if (!navigator.geolocation) {
    return Promise.resolve({ location: null, status: 'unavailable' });
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: 'Current location',
          source: 'current'
        };
        storeLocation(location);
        resolve({ location, status: 'ready' });
      },
      (error) => {
        const status: LocationStatus = error.code === error.PERMISSION_DENIED
          ? 'denied'
          : error.code === error.TIMEOUT
            ? 'timeout'
            : 'unavailable';
        if (status === 'denied') {
          try {
            sessionStorage.setItem(LOCATION_DENIED_KEY, 'true');
          } catch {
            // Fall back to unsorted results when storage is unavailable.
          }
        }
        resolve({ location: null, status });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 120000 }
    );
  });
}

export function resolveUserLocation(): Promise<LocationResult> {
  return requestCurrentLocation(false);
}

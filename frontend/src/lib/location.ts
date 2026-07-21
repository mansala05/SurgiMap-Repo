export type UserLocation = {
  latitude: number;
  longitude: number;
};

const LOCATION_KEY = 'surgimap-user-location';
const LOCATION_DENIED_KEY = 'surgimap-location-unavailable';

function readStoredLocation(): UserLocation | null {
  try {
    const value = sessionStorage.getItem(LOCATION_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<UserLocation>;
    if (typeof parsed.latitude !== 'number' || typeof parsed.longitude !== 'number') return null;
    return { latitude: parsed.latitude, longitude: parsed.longitude };
  } catch {
    return null;
  }
}

export function requestUserLocation(): Promise<UserLocation | null> {
  const stored = readStoredLocation();
  if (stored) return Promise.resolve(stored);

  try {
    if (sessionStorage.getItem(LOCATION_DENIED_KEY) === 'true') return Promise.resolve(null);
  } catch {
    // Continue without session caching when storage is unavailable.
  }

  if (!navigator.geolocation) return Promise.resolve(null);

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        try {
          sessionStorage.setItem(LOCATION_KEY, JSON.stringify(location));
        } catch {
          // Location still works for the current request when storage is unavailable.
        }
        resolve(location);
      },
      () => {
        try {
          sessionStorage.setItem(LOCATION_DENIED_KEY, 'true');
        } catch {
          // Fall back to unsorted results when storage is unavailable.
        }
        resolve(null);
      },
      { enableHighAccuracy: false, timeout: 4000, maximumAge: 300000 }
    );
  });
}

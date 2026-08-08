import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getPharmacyProfile } from '../lib/api';
import { clearPharmacySession, getPharmacySession } from '../lib/pharmacySession';

export function RequirePharmacyAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const session = getPharmacySession();
    if (!session) {
      setAuthorized(false);
      return () => controller.abort();
    }

    getPharmacyProfile(session.access_token, controller.signal)
      .then(() => setAuthorized(true))
      .catch(() => {
        clearPharmacySession();
        setAuthorized(false);
      });
    return () => controller.abort();
  }, []);

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-iceWhite flex items-center justify-center font-bold text-arcticNavy">
        Checking pharmacy access…
      </div>
    );
  }

  if (!authorized) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, message: 'Please sign in to open the pharmacy portal.' }}
      />
    );
  }

  return children;
}

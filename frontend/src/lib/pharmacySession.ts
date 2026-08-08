import type { PharmacySession } from './api';

const STORAGE_KEY = 'surgimap.pharmacy.session';

export function getPharmacySession(): PharmacySession | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return null;
    const session = JSON.parse(value) as Partial<PharmacySession>;
    if (
      typeof session.access_token !== 'string' ||
      typeof session.pharmacy_id !== 'number' ||
      typeof session.pharmacy_name !== 'string' ||
      typeof session.email !== 'string'
    ) {
      clearPharmacySession();
      return null;
    }
    return session as PharmacySession;
  } catch {
    clearPharmacySession();
    return null;
  }
}

export function savePharmacySession(session: PharmacySession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearPharmacySession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

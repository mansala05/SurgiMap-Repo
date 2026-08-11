export const STOCK_REFRESH_INTERVAL_MS = 30 * 1000;

const LIVE_SYNC_WINDOW_MS = STOCK_REFRESH_INTERVAL_MS * 2.5;
const OFFLINE_AFTER_MS = 5 * 60 * 1000;

export type SyncFreshnessState = 'live' | 'delayed' | 'offline' | 'unknown';

export type SyncFreshness = {
  state: SyncFreshnessState;
  age: string;
  label: string;
};

export function formatStockAge(value: string, now = Date.now()): string {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return 'recently';

  const elapsedMs = Math.max(0, now - timestamp);
  const seconds = Math.floor(elapsedMs / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds} sec ago`;

  const minutes = Math.floor(elapsedMs / 60000);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export function formatStockTimestamp(value: string): string {
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) return 'Update time unavailable';

  return new Intl.DateTimeFormat('en-LK', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(timestamp);
}

export function getSyncFreshness(value: string, now = Date.now()): SyncFreshness {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) {
    return {
      state: 'unknown',
      age: 'time unavailable',
      label: 'Sync status unavailable'
    };
  }

  const elapsedMs = Math.max(0, now - timestamp);
  const age = formatStockAge(value, now);
  if (elapsedMs <= LIVE_SYNC_WINDOW_MS) {
    return { state: 'live', age, label: `Live · synced ${age}` };
  }
  if (elapsedMs <= OFFLINE_AFTER_MS) {
    return { state: 'delayed', age, label: `Sync delayed · last seen ${age}` };
  }
  return { state: 'offline', age, label: `Sync offline · last seen ${age}` };
}

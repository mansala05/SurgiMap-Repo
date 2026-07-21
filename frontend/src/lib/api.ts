const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

export type StockResult = {
  pharmacy_id: number;
  pharmacy_name: string;
  address: string;
  phone: string | null;
  whatsapp: string | null;
  latitude: number | null;
  longitude: number | null;
  kit_name: string;
  quantity: number;
  status: string;
  last_updated: string;
};

type ApiErrorBody = {
  detail?: string;
};

export async function searchStock(itemName: string, signal?: AbortSignal): Promise<StockResult[]> {
  const url = new URL('/search', API_BASE_URL);
  url.searchParams.set('item_name', itemName);

  const response = await fetch(url, { signal });
  if (!response.ok) {
    const body = await response.json().catch(() => ({} as ApiErrorBody));
    throw new Error(body.detail || `Search failed (${response.status})`);
  }

  return response.json() as Promise<StockResult[]>;
}

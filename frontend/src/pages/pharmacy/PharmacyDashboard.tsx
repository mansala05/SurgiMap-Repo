import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  LogOutIcon,
  PackageIcon,
  RefreshCwIcon,
  SearchIcon,
  ShieldCheckIcon,
  XCircleIcon,
} from 'lucide-react'
import {
  getPharmacyInventory,
  type PharmacyInventoryItem,
} from '../../lib/api'
import { clearPharmacySession, getPharmacySession } from '../../lib/pharmacySession'
import {
  formatStockTimestamp,
  getSyncFreshness,
  STOCK_REFRESH_INTERVAL_MS,
} from '../../lib/stock'

const STATUS_STYLES: Record<string, string> = {
  Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Low Stock': 'bg-amber-50 text-amber-700 border-amber-200',
  'Not Available': 'bg-rose-50 text-rose-700 border-rose-200',
}

export function PharmacyDashboard() {
  const navigate = useNavigate()
  const [session] = useState(() => getPharmacySession())
  const [inventory, setInventory] = useState<PharmacyInventoryItem[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadInventory = useCallback(async (signal?: AbortSignal) => {
    if (!session) return
    try {
      const rows = await getPharmacyInventory(session.access_token, signal)
      setInventory(rows)
      setError('')
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return
      setError(requestError instanceof Error ? requestError.message : 'Could not load inventory.')
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    const controller = new AbortController()
    void loadInventory(controller.signal)
    const timer = window.setInterval(() => void loadInventory(), STOCK_REFRESH_INTERVAL_MS)
    return () => {
      controller.abort()
      window.clearInterval(timer)
    }
  }, [loadInventory])

  const filteredInventory = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return inventory
    return inventory.filter((item) => item.kit_name.toLowerCase().includes(term))
  }, [inventory, query])

  const counts = useMemo(() => ({
    available: inventory.filter((item) => item.status === 'Available').length,
    low: inventory.filter((item) => item.status === 'Low Stock').length,
    unavailable: inventory.filter((item) => item.status === 'Not Available').length,
  }), [inventory])

  const latestUpdate = inventory.reduce<string | null>((latest, item) => {
    if (!latest || new Date(item.last_updated) > new Date(latest)) return item.last_updated
    return latest
  }, null)
  const freshness = latestUpdate ? getSyncFreshness(latestUpdate) : null

  function signOut() {
    clearPharmacySession()
    navigate('/login', { replace: true, state: { message: 'You have signed out.' } })
  }

  return (
    <div className="min-h-screen bg-iceWhite text-obsidian">
      <header className="bg-arcticNavy text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black tracking-tighter">surgimap</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                Pharmacy monitor
              </span>
            </div>
            <p className="mt-2 text-sm text-glacierBlue">
              {session?.pharmacy_name || 'Connected pharmacy'} · Central inventory view
            </p>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-bold hover:bg-white/10"
          >
            <LogOutIcon className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-steelBlue">Live operations</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Synced inventory</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-steelBlue">
              This is a read-only view of the central database. Quantities are changed in the pharmacy source system and appear here after the automatic 30-second sync.
            </p>
          </div>
          <button
            onClick={() => void loadInventory()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-arcticNavy px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh view
          </button>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={CheckCircleIcon} label="Available" value={counts.available} tone="text-emerald-600 bg-emerald-50" />
          <Metric icon={AlertTriangleIcon} label="Low stock" value={counts.low} tone="text-amber-600 bg-amber-50" />
          <Metric icon={XCircleIcon} label="Unavailable" value={counts.unavailable} tone="text-rose-600 bg-rose-50" />
          <Metric
            icon={ClockIcon}
            label="Sync connection"
            value={freshness?.state === 'live' ? 'Live' : freshness?.state === 'delayed' ? 'Delayed' : 'Offline'}
            tone={freshness?.state === 'live' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}
          />
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-silverMist bg-white shadow-sm">
          <div className="border-b border-silverMist p-5 sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="font-black">Inventory catalog</h2>
              <p className="mt-1 text-xs text-steelBlue">
                {inventory.length} items · {latestUpdate ? `Latest sync ${formatStockTimestamp(latestUpdate)}` : 'Waiting for first sync'}
              </p>
            </div>
            <label className="mt-4 flex items-center gap-3 rounded-xl border border-silverMist px-4 py-2 sm:mt-0 sm:w-80">
              <SearchIcon className="h-4 w-4 text-steelBlue" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter kits or items"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
          </div>

          {error && <div className="m-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</div>}
          {loading && inventory.length === 0 ? (
            <div className="p-14 text-center text-sm font-bold text-steelBlue">Loading synced inventory…</div>
          ) : filteredInventory.length === 0 ? (
            <div className="p-14 text-center text-sm font-bold text-steelBlue">No inventory items match this filter.</div>
          ) : (
            <div className="divide-y divide-silverMist">
              {filteredInventory.map((item) => {
                const itemFreshness = getSyncFreshness(item.last_updated)
                return (
                  <div key={item.kit_name} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-0.5 rounded-xl bg-arcticNavy/5 p-2 text-arcticNavy"><PackageIcon className="h-4 w-4" /></span>
                      <div className="min-w-0">
                        <p className="font-bold leading-5">{item.kit_name}</p>
                        <p className="mt-1 text-xs text-steelBlue" title={formatStockTimestamp(item.last_updated)}>{itemFreshness.label}</p>
                      </div>
                    </div>
                    <span className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${STATUS_STYLES[item.status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                      {item.status}
                    </span>
                    <p className="text-sm font-black sm:w-20 sm:text-right">Qty {item.quantity}</p>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-arcticNavy/10 bg-arcticNavy/5 p-4 text-sm text-steelBlue">
          <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-arcticNavy" />
          <p>Patient search never exposes exact quantities. It shows only Available or Low Stock and recommends calling the pharmacy before travelling.</p>
        </div>
      </main>
    </div>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof PackageIcon
  label: string
  value: number | string
  tone: string
}) {
  return (
    <div className="rounded-2xl border border-silverMist bg-white p-5 shadow-sm">
      <div className={`mb-4 w-fit rounded-xl p-2.5 ${tone}`}><Icon className="h-5 w-5" /></div>
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-steelBlue">{label}</p>
    </div>
  )
}

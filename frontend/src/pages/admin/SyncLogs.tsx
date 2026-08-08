import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LogOutIcon,
  ClockIcon,
  LayoutDashboardIcon,
  HistoryIcon,
  HeartPulseIcon,
  SearchIcon,
  DownloadIcon,
  CalendarIcon,
} from 'lucide-react'
type LogStatus = 'success' | 'error'
interface SyncLog {
  id: number
  pharmacy: string
  address: string
  timestamp: string
  status: LogStatus
  duration: string
  kitsUpdated: number
  triggeredBy: 'auto' | 'manual'
}
const ALL_LOGS: SyncLog[] = [
  {
    id: 1,
    pharmacy: 'City Med Pharmacy',
    address: 'Colombo 07',
    timestamp: 'Jul 1, 2026, 9:14:02 AM',
    status: 'success',
    duration: '1.2s',
    kitsUpdated: 8,
    triggeredBy: 'auto',
  },
  {
    id: 2,
    pharmacy: 'Royal Med Pharmacy',
    address: 'Kollupitiya',
    timestamp: 'Jul 1, 2026, 9:12:44 AM',
    status: 'success',
    duration: '0.9s',
    kitsUpdated: 8,
    triggeredBy: 'auto',
  },
  {
    id: 3,
    pharmacy: 'LifeLine Pharmacy',
    address: 'Dehiwala',
    timestamp: 'Jul 1, 2026, 9:10:11 AM',
    status: 'success',
    duration: '1.4s',
    kitsUpdated: 7,
    triggeredBy: 'auto',
  },
  {
    id: 4,
    pharmacy: 'Healthline Pharmacy',
    address: 'Nugegoda',
    timestamp: 'Jul 1, 2026, 9:08:30 AM',
    status: 'success',
    duration: '1.1s',
    kitsUpdated: 8,
    triggeredBy: 'auto',
  },
  {
    id: 5,
    pharmacy: 'Metro Pharmacy',
    address: 'Mount Lavinia',
    timestamp: 'Jul 1, 2026, 9:05:19 AM',
    status: 'success',
    duration: '0.8s',
    kitsUpdated: 8,
    triggeredBy: 'manual',
  },
  {
    id: 6,
    pharmacy: 'Wellcare Pharmacy',
    address: 'Ratmalana',
    timestamp: 'Jul 1, 2026, 9:00:55 AM',
    status: 'success',
    duration: '1.3s',
    kitsUpdated: 6,
    triggeredBy: 'auto',
  },
  {
    id: 7,
    pharmacy: 'City Surgical Supplies',
    address: 'Moratuwa',
    timestamp: 'Jul 1, 2026, 8:55:40 AM',
    status: 'success',
    duration: '1.0s',
    kitsUpdated: 8,
    triggeredBy: 'auto',
  },
  {
    id: 8,
    pharmacy: 'CarePlus Pharmacy',
    address: 'Bambalapitiya',
    timestamp: 'Jul 1, 2026, 8:45:22 AM',
    status: 'error',
    duration: '—',
    kitsUpdated: 0,
    triggeredBy: 'auto',
  },
  {
    id: 9,
    pharmacy: 'Lanka Care Pharmacy',
    address: 'Maharagama',
    timestamp: 'Jul 1, 2026, 8:30:08 AM',
    status: 'error',
    duration: '—',
    kitsUpdated: 0,
    triggeredBy: 'auto',
  },
  {
    id: 10,
    pharmacy: 'Colombo Med Hub',
    address: 'Pettah',
    timestamp: 'Jul 1, 2026, 8:20:01 AM',
    status: 'error',
    duration: '—',
    kitsUpdated: 0,
    triggeredBy: 'manual',
  },
  {
    id: 11,
    pharmacy: 'City Med Pharmacy',
    address: 'Colombo 07',
    timestamp: 'Jun 30, 2026, 9:14:00 AM',
    status: 'success',
    duration: '1.1s',
    kitsUpdated: 8,
    triggeredBy: 'auto',
  },
  {
    id: 12,
    pharmacy: 'Royal Med Pharmacy',
    address: 'Kollupitiya',
    timestamp: 'Jun 30, 2026, 9:12:00 AM',
    status: 'success',
    duration: '0.9s',
    kitsUpdated: 8,
    triggeredBy: 'auto',
  },
  {
    id: 13,
    pharmacy: 'CarePlus Pharmacy',
    address: 'Bambalapitiya',
    timestamp: 'Jun 30, 2026, 8:50:00 AM',
    status: 'success',
    duration: '1.2s',
    kitsUpdated: 8,
    triggeredBy: 'auto',
  },
  {
    id: 14,
    pharmacy: 'Colombo Med Hub',
    address: 'Pettah',
    timestamp: 'Jun 30, 2026, 8:30:00 AM',
    status: 'error',
    duration: '—',
    kitsUpdated: 0,
    triggeredBy: 'auto',
  },
]
type FilterType = 'all' | 'success' | 'error'
export function SyncLogs() {
  const navigate = useNavigate()
  const location = useLocation()
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const todayLogs = ALL_LOGS.filter((l) => l.timestamp.startsWith('Jul 1'))
  const successToday = todayLogs.filter((l) => l.status === 'success').length
  const errorToday = todayLogs.filter((l) => l.status === 'error').length
  const filtered = ALL_LOGS.filter((log) => {
    const matchesFilter = filter === 'all' || log.status === filter
    const matchesSearch =
      log.pharmacy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.address.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })
  const navItems = [
    {
      label: 'Overview',
      icon: LayoutDashboardIcon,
      path: '/admin',
    },
    {
      label: 'Sync Logs',
      icon: HistoryIcon,
      path: '/admin/sync-logs',
    },
    {
      label: 'System Health',
      icon: HeartPulseIcon,
      path: '#',
    },
  ]
  return (
    <div className="flex h-screen bg-iceWhite text-obsidian font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-arcticNavy flex flex-col shrink-0">
        <div className="p-8">
          <span className="text-2xl font-black tracking-tighter text-iceWhite">
            surgimap
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-glacierBlue mt-1">
            Admin Console
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${location.pathname === item.path ? 'bg-white/10 text-white shadow-lg' : 'text-glacierBlue hover:text-white hover:bg-white/5'}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOutIcon className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-silverMist px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-steelBlue" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-iceWhite border-none rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-arcticNavy/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-steelBlue hover:text-arcticNavy px-4 py-2 text-sm font-bold transition-colors">
              <DownloadIcon className="w-4 h-4" />
              Export CSV
            </button>
            <div className="h-8 w-px bg-silverMist" />
            <div className="flex items-center gap-2 text-arcticNavy font-bold text-sm">
              <CalendarIcon className="w-4 h-4" />
              July 1, 2026
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-black tracking-tighter text-obsidian mb-2">
                  Sync Audit Logs
                </h1>
                <p className="text-steelBlue font-medium">
                  Detailed history of all synchronization events across the
                  pharmacy network.
                </p>
              </div>

              {/* Integrated Filter Toolbar */}
              <div className="flex items-center gap-2 bg-white border border-silverMist rounded-xl p-1 shadow-sm">
                {(['all', 'success', 'error'] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-arcticNavy text-white shadow-md' : 'text-steelBlue hover:text-arcticNavy hover:bg-iceWhite'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Compact Summary Row */}
            <div className="flex gap-8 mb-10 border-b border-silverMist pb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-steelBlue mb-1">
                  Total Events Today
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tighter text-obsidian">
                    {todayLogs.length}
                  </span>
                  <span className="text-xs font-bold text-green-600">
                    +12% vs yesterday
                  </span>
                </div>
              </div>
              <div className="w-px bg-silverMist" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-steelBlue mb-1">
                  Successful
                </p>
                <span className="text-3xl font-black tracking-tighter text-green-600">
                  {successToday}
                </span>
              </div>
              <div className="w-px bg-silverMist" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-steelBlue mb-1">
                  Failed
                </p>
                <span className="text-3xl font-black tracking-tighter text-red-500">
                  {errorToday}
                </span>
              </div>
            </div>

            {/* Audit Table */}
            <div className="bg-white border border-silverMist rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-iceWhite border-b border-silverMist">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue">
                      Pharmacy
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue text-center">
                      Kits Updated
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue text-center">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue text-right">
                      Trigger
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-silverMist/50">
                  {filtered.map((log) => (
                    <motion.tr
                      layout
                      key={log.id}
                      className="hover:bg-iceWhite/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-steelBlue">
                          <ClockIcon className="w-3 h-3" />
                          {log.timestamp}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-obsidian">
                            {log.pharmacy}
                          </p>
                          <p className="text-[10px] text-steelBlue font-medium">
                            {log.address}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {log.status === 'success' ? (
                            <div
                              className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                              title="Success"
                            />
                          ) : (
                            <div
                              className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                              title="Failed"
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`text-sm font-black ${log.kitsUpdated > 0 ? 'text-obsidian' : 'text-silverMist'}`}
                        >
                          {log.kitsUpdated > 0 ? `+${log.kitsUpdated}` : '0'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs font-medium text-steelBlue">
                          {log.duration}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${log.triggeredBy === 'manual' ? 'bg-arcticNavy text-white' : 'bg-iceWhite text-steelBlue border border-silverMist'}`}
                        >
                          {log.triggeredBy}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-20 text-center">
                  <SearchIcon className="w-12 h-12 text-silverMist mx-auto mb-4" />
                  <p className="text-steelBlue font-bold">
                    No logs found matching your criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

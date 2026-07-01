import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RefreshCwIcon,
  LogOutIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ActivityIcon,
  BuildingIcon,
  LayoutDashboardIcon,
  HistoryIcon,
  HeartPulseIcon,
  SearchIcon,
  ChevronRightIcon,
  MoreVerticalIcon,
} from 'lucide-react'
import { useScreenInit } from '../../useScreenInit.js'
type SyncStatus = 'connected' | 'error' | 'syncing'
interface Pharmacy {
  id: number
  name: string
  address: string
  status: SyncStatus
  lastSync: string
  totalKits: number
  lowStock: number
  outOfStock: number
}
const INITIAL_PHARMACIES: Pharmacy[] = [
  {
    id: 1,
    name: 'City Med Pharmacy',
    address: 'Colombo 07',
    status: 'connected',
    lastSync: '9:14 AM',
    totalKits: 8,
    lowStock: 2,
    outOfStock: 1,
  },
  {
    id: 2,
    name: 'Royal Med Pharmacy',
    address: 'Kollupitiya',
    status: 'connected',
    lastSync: '9:12 AM',
    totalKits: 8,
    lowStock: 1,
    outOfStock: 0,
  },
  {
    id: 3,
    name: 'CarePlus Pharmacy',
    address: 'Bambalapitiya',
    status: 'error',
    lastSync: '8:45 AM',
    totalKits: 8,
    lowStock: 3,
    outOfStock: 2,
  },
  {
    id: 4,
    name: 'LifeLine Pharmacy',
    address: 'Dehiwala',
    status: 'connected',
    lastSync: '9:10 AM',
    totalKits: 8,
    lowStock: 0,
    outOfStock: 1,
  },
  {
    id: 5,
    name: 'Healthline Pharmacy',
    address: 'Nugegoda',
    status: 'connected',
    lastSync: '9:08 AM',
    totalKits: 8,
    lowStock: 2,
    outOfStock: 0,
  },
  {
    id: 6,
    name: 'Lanka Care Pharmacy',
    address: 'Maharagama',
    status: 'error',
    lastSync: '8:30 AM',
    totalKits: 8,
    lowStock: 4,
    outOfStock: 3,
  },
  {
    id: 7,
    name: 'Metro Pharmacy',
    address: 'Mount Lavinia',
    status: 'connected',
    lastSync: '9:05 AM',
    totalKits: 8,
    lowStock: 1,
    outOfStock: 0,
  },
  {
    id: 8,
    name: 'Wellcare Pharmacy',
    address: 'Ratmalana',
    status: 'connected',
    lastSync: '9:00 AM',
    totalKits: 8,
    lowStock: 0,
    outOfStock: 2,
  },
  {
    id: 9,
    name: 'City Surgical Supplies',
    address: 'Moratuwa',
    status: 'connected',
    lastSync: '8:55 AM',
    totalKits: 8,
    lowStock: 2,
    outOfStock: 1,
  },
  {
    id: 10,
    name: 'Colombo Med Hub',
    address: 'Pettah',
    status: 'error',
    lastSync: '8:20 AM',
    totalKits: 8,
    lowStock: 3,
    outOfStock: 2,
  },
]
export function AdminPanel() {
  const navigate = useNavigate()
  const location = useLocation()
  const [pharmacies, setPharmacies] = useState(INITIAL_PHARMACIES)
  const [syncingAll, setSyncingAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  useScreenInit()
  const connected = pharmacies.filter((p) => p.status === 'connected').length
  const errors = pharmacies.filter((p) => p.status === 'error').length
  const totalLowStock = pharmacies.reduce((a, p) => a + p.lowStock, 0)
  const triggerSync = (id: number) => {
    setPharmacies((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'syncing',
            }
          : p,
      ),
    )
    setTimeout(() => {
      setPharmacies((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                status: 'connected',
                lastSync: 'Just now',
              }
            : p,
        ),
      )
    }, 2000)
  }
  const triggerSyncAll = () => {
    setSyncingAll(true)
    setPharmacies((prev) =>
      prev.map((p) => ({
        ...p,
        status: 'syncing',
      })),
    )
    setTimeout(() => {
      setPharmacies((prev) =>
        prev.map((p) => ({
          ...p,
          status: 'connected',
          lastSync: 'Just now',
        })),
      )
      setSyncingAll(false)
    }, 3000)
  }
  const filteredPharmacies = pharmacies.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )
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
                placeholder="Search pharmacies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-iceWhite border-none rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-arcticNavy/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider">
                System Live
              </span>
            </div>
            <button
              onClick={triggerSyncAll}
              disabled={syncingAll}
              className="flex items-center gap-2 bg-arcticNavy text-iceWhite rounded-xl px-6 py-2.5 text-sm font-bold hover:bg-obsidian transition-all disabled:opacity-50"
            >
              <RefreshCwIcon
                className={`w-4 h-4 ${syncingAll ? 'animate-spin' : ''}`}
              />
              {syncingAll ? 'Syncing...' : 'Sync All'}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <h1 className="text-4xl font-black tracking-tighter text-obsidian mb-2">
                Pharmacy Network
              </h1>
              <p className="text-steelBlue font-medium">
                Manage and monitor real-time stock synchronization across your
                network.
              </p>
            </div>

            {/* Subtle Stats Summary */}
            <div className="grid grid-cols-4 gap-6 mb-10">
              {[
                {
                  label: 'Total Nodes',
                  value: pharmacies.length,
                  icon: BuildingIcon,
                  color: 'text-arcticNavy',
                },
                {
                  label: 'Connected',
                  value: connected,
                  icon: CheckCircleIcon,
                  color: 'text-green-600',
                },
                {
                  label: 'Sync Errors',
                  value: errors,
                  icon: XCircleIcon,
                  color: 'text-red-500',
                },
                {
                  label: 'Low Stock',
                  value: totalLowStock,
                  icon: ActivityIcon,
                  color: 'text-yellow-600',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white border border-silverMist rounded-2xl p-5 flex items-center gap-4 shadow-sm"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-iceWhite flex items-center justify-center ${stat.color}`}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-black tracking-tight text-obsidian leading-none">
                      {stat.value}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-steelBlue mt-1">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Table */}
            <div className="bg-white border border-silverMist rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-iceWhite border-b border-silverMist">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue">
                      Pharmacy Details
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue text-center">
                      Last Sync
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue text-center">
                      Inventory Alerts
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-silverMist/50">
                  {filteredPharmacies.map((p) => (
                    <motion.tr
                      layout
                      key={p.id}
                      className="hover:bg-iceWhite/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-arcticNavy/5 flex items-center justify-center text-xs font-bold text-arcticNavy">
                            {p.id}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-obsidian">
                              {p.name}
                            </p>
                            <p className="text-xs text-steelBlue">
                              {p.address}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {p.status === 'connected' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider border border-green-100">
                              <CheckCircleIcon className="w-3 h-3" /> Connected
                            </span>
                          )}
                          {p.status === 'error' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider border border-red-100">
                              <XCircleIcon className="w-3 h-3" /> Error
                            </span>
                          )}
                          {p.status === 'syncing' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-arcticNavy/5 text-arcticNavy text-[10px] font-bold uppercase tracking-wider border border-arcticNavy/10">
                              <RefreshCwIcon className="w-3 h-3 animate-spin" />{' '}
                              Syncing
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs font-medium text-steelBlue">
                          {p.lastSync}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {p.outOfStock > 0 && (
                            <span className="px-2 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold">
                              {p.outOfStock} OUT
                            </span>
                          )}
                          {p.lowStock > 0 && (
                            <span className="px-2 py-0.5 rounded bg-yellow-500 text-white text-[10px] font-bold">
                              {p.lowStock} LOW
                            </span>
                          )}
                          {p.outOfStock === 0 && p.lowStock === 0 && (
                            <span className="text-silverMist">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => triggerSync(p.id)}
                            disabled={p.status === 'syncing'}
                            className="p-2 hover:bg-arcticNavy hover:text-white rounded-lg transition-all text-steelBlue"
                          >
                            <RefreshCwIcon
                              className={`w-4 h-4 ${p.status === 'syncing' ? 'animate-spin' : ''}`}
                            />
                          </button>
                          <button className="p-2 hover:bg-iceWhite rounded-lg transition-all text-steelBlue">
                            <ChevronRightIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredPharmacies.length === 0 && (
                <div className="py-20 text-center">
                  <SearchIcon className="w-12 h-12 text-silverMist mx-auto mb-4" />
                  <p className="text-steelBlue font-bold">
                    No pharmacies found matching "{searchQuery}"
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

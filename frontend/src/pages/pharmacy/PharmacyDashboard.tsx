import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PackageIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  RefreshCwIcon,
  LogOutIcon,
  SaveIcon,
  SearchIcon,
  ShoppingCartIcon,
  BarChart3Icon,
  PlusIcon,
  MinusIcon,
  UserIcon,
  ArrowRightIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarIcon,
  FilterIcon,
} from 'lucide-react'
import { clearPharmacySession, getPharmacySession } from '../../lib/pharmacySession'
const INITIAL_STOCK = [
  {
    id: 1,
    name: 'Maternity & Cesarean Section Delivery Kit',
    quantity: 6,
    lastSynced: '9:14 AM',
  },
  {
    id: 2,
    name: 'Laparoscopic / Abdominal Surgery Kit',
    quantity: 2,
    lastSynced: '9:14 AM',
  },
  {
    id: 3,
    name: 'Orthopedic & Major Joint Surgery Prep Kit',
    quantity: 8,
    lastSynced: '9:10 AM',
  },
  {
    id: 4,
    name: 'Minor Surgical & Suture Removal Kit',
    quantity: 0,
    lastSynced: '9:05 AM',
  },
  {
    id: 5,
    name: 'Cataract & Eye Surgery Kit',
    quantity: 3,
    lastSynced: '9:14 AM',
  },
  {
    id: 6,
    name: 'Wound Care & Post-Operative Dressing Kit',
    quantity: 12,
    lastSynced: '8:58 AM',
  },
  {
    id: 7,
    name: 'Disposable Trocar Set 10mm & 5mm',
    quantity: 1,
    lastSynced: '9:00 AM',
  },
  {
    id: 8,
    name: 'Sterile Surgical Gown',
    quantity: 0,
    lastSynced: '8:45 AM',
  },
]
const INITIAL_ORDERS = [
  {
    id: 'ORD-8821',
    customer: 'Amara Silva',
    items: 'Maternity Delivery Kit (1)',
    status: 'pending',
    time: '10 mins ago',
    type: 'Request',
  },
  {
    id: 'ORD-8819',
    customer: 'Dr. Nimal',
    items: 'Minor Surgical Kit (2)',
    status: 'confirmed',
    time: '45 mins ago',
    type: 'Order',
  },
  {
    id: 'ORD-8815',
    customer: 'Kamal Perera',
    items: 'Wound Care Kit (1)',
    status: 'ready',
    time: '1 hr ago',
    type: 'Request',
  },
  {
    id: 'ORD-8812',
    customer: 'Lanka Hospital',
    items: 'Laparoscopic Kit (5)',
    status: 'cancelled',
    time: '3 hrs ago',
    type: 'Order',
  },
]
function getCurrentTime() {
  const now = new Date()
  return now.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
function getCurrentTimeShort() {
  const now = new Date()
  return now.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
function getStatus(qty: number) {
  if (qty === 0)
    return {
      label: 'Not Available',
      color: 'text-red-500',
      bg: 'bg-red-50 border-red-100',
    }
  if (qty <= 3)
    return {
      label: 'Low Stock',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 border-yellow-100',
    }
  return {
    label: 'Available',
    color: 'text-green-600',
    bg: 'bg-green-50 border-green-100',
  }
}
export function PharmacyDashboard() {
  const navigate = useNavigate()
  const pharmacySession = getPharmacySession()
  const pharmacyName = pharmacySession?.pharmacy_name || 'Pharmacy'
  const [activeTab, setActiveTab] = useState('stock')
  const [stock, setStock] = useState(INITIAL_STOCK)
  const orders = INITIAL_ORDERS
  const [saved, setSaved] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState('Jul 1, 2026, 9:14 AM')
  const [searchQuery, setSearchQuery] = useState('')
  const totalAvailable = stock.filter((s) => s.quantity >= 4).length
  const lowStock = stock.filter((s) => s.quantity > 0 && s.quantity <= 3).length
  const outOfStock = stock.filter((s) => s.quantity === 0).length
  const handleQuantityChange = (id: number, value: string | number) => {
    const qty = Math.max(
      0,
      typeof value === 'string' ? parseInt(value) || 0 : value,
    )
    setStock((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              quantity: qty,
            }
          : s,
      ),
    )
    setSaved(false)
  }
  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }
  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      const newTime = getCurrentTime()
      const newTimeShort = getCurrentTimeShort()
      setLastSync(newTime)
      setStock((prev) =>
        prev.map((s) => ({
          ...s,
          lastSynced: newTimeShort,
        })),
      )
    }, 2000)
  }
  const filteredStock = stock.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  const filteredOrders = orders.filter(
    (o) =>
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  const navItems = [
    {
      id: 'stock',
      label: 'Stock Management',
      icon: PackageIcon,
    },
    {
      id: 'orders',
      label: 'Orders & Requests',
      icon: ShoppingCartIcon,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3Icon,
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
            Pharmacy Portal
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-white/10 text-white shadow-lg' : 'text-glacierBlue hover:text-white hover:bg-white/5'}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="mb-6 px-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-glacierBlue mb-2">
              Connected as
            </p>
            <p className="text-sm font-bold text-white truncate">
              {pharmacyName}
            </p>
          </div>
          <button
            onClick={() => {
              clearPharmacySession()
              navigate('/login', { replace: true, state: { message: 'You have signed out.' } })
            }}
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
                placeholder={
                  activeTab === 'stock'
                    ? 'Search inventory...'
                    : activeTab === 'orders'
                      ? 'Search orders...'
                      : 'Search analytics...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-iceWhite border-none rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-arcticNavy/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 mr-4 text-xs font-bold text-steelBlue uppercase tracking-wider">
              <ClockIcon className="w-3.5 h-3.5" />
              Last Sync: {lastSync}
            </div>
            {activeTab === 'stock' && (
              <>
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="flex items-center gap-2 border border-silverMist bg-white rounded-xl px-4 py-2.5 text-sm font-bold text-steelBlue hover:border-arcticNavy hover:text-arcticNavy transition-all disabled:opacity-50"
                >
                  <RefreshCwIcon
                    className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`}
                  />
                  <span className="hidden sm:inline">Sync</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-arcticNavy text-iceWhite rounded-xl px-6 py-2.5 text-sm font-bold hover:bg-obsidian transition-all active:scale-95 shadow-sm"
                >
                  <SaveIcon className="w-4 h-4" />
                  {saved ? 'Saved ✓' : 'Save Changes'}
                </button>
              </>
            )}
            {activeTab === 'orders' && (
              <button className="flex items-center gap-2 bg-arcticNavy text-iceWhite rounded-xl px-6 py-2.5 text-sm font-bold hover:bg-obsidian transition-all active:scale-95 shadow-sm">
                <PlusIcon className="w-4 h-4" />
                New Order
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'stock' && (
                <motion.div
                  key="stock"
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <div className="mb-10">
                    <h1 className="text-4xl font-black tracking-tighter text-obsidian mb-2">
                      Inventory Overview
                    </h1>
                    <p className="text-steelBlue font-medium">
                      Update and manage your surgical kit stock levels for
                      real-time patient visibility.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-10">
                    {[
                      {
                        label: 'Available Kits',
                        value: totalAvailable,
                        icon: CheckCircleIcon,
                        color: 'text-green-600',
                      },
                      {
                        label: 'Low Stock Alerts',
                        value: lowStock,
                        icon: AlertTriangleIcon,
                        color: 'text-yellow-600',
                      },
                      {
                        label: 'Out of Stock',
                        value: outOfStock,
                        icon: PackageIcon,
                        color: 'text-red-500',
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

                  <div className="bg-white border border-silverMist rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-iceWhite border-b border-silverMist">
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue">
                            Kit Name
                          </th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue text-center">
                            Quantity
                          </th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue text-center">
                            Status
                          </th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue text-right">
                            Last Updated
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-silverMist/50">
                        {filteredStock.map((item) => {
                          const status = getStatus(item.quantity)
                          return (
                            <motion.tr
                              layout
                              key={item.id}
                              className="hover:bg-iceWhite/50 transition-colors group"
                            >
                              <td className="px-6 py-4">
                                <p className="text-sm font-bold text-obsidian">
                                  {item.name}
                                </p>
                                <p className="text-[10px] text-steelBlue font-medium uppercase tracking-wider">
                                  SKU: SK-{String(item.id).padStart(4, '0')}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-center">
                                  <div className="flex items-center bg-iceWhite rounded-lg p-1 border border-silverMist/50">
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.id,
                                          item.quantity - 1,
                                        )
                                      }
                                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:text-arcticNavy text-steelBlue transition-all"
                                    >
                                      <MinusIcon className="w-3.5 h-3.5" />
                                    </button>
                                    <input
                                      type="number"
                                      min="0"
                                      value={item.quantity}
                                      onChange={(e) =>
                                        handleQuantityChange(
                                          item.id,
                                          e.target.value,
                                        )
                                      }
                                      className="w-12 text-center bg-transparent border-none text-sm font-bold focus:ring-0"
                                    />
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.id,
                                          item.quantity + 1,
                                        )
                                      }
                                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:text-arcticNavy text-steelBlue transition-all"
                                    >
                                      <PlusIcon className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-center">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status.bg} ${status.color}`}
                                  >
                                    {status.label}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className="text-xs font-medium text-steelBlue">
                                  {item.lastSynced}
                                </span>
                              </td>
                            </motion.tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <div className="mb-10">
                    <h1 className="text-4xl font-black tracking-tighter text-obsidian mb-2">
                      Orders & Requests
                    </h1>
                    <p className="text-steelBlue font-medium">
                      Manage incoming kit requests and confirmed orders from
                      patients and doctors.
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-6 mb-10">
                    {[
                      {
                        label: 'New Requests',
                        value: 3,
                        color: 'text-arcticNavy',
                      },
                      {
                        label: 'Confirmed',
                        value: 12,
                        color: 'text-green-600',
                      },
                      {
                        label: 'Ready for Pickup',
                        value: 5,
                        color: 'text-glacierBlue',
                      },
                      {
                        label: 'Cancelled',
                        value: 1,
                        color: 'text-red-400',
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-white border border-silverMist rounded-2xl p-5 shadow-sm"
                      >
                        <p className="text-2xl font-black tracking-tight text-obsidian leading-none">
                          {stat.value}
                        </p>
                        <p
                          className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${stat.color}`}
                        >
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white border border-silverMist rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-silverMist flex items-center justify-between bg-iceWhite/30">
                      <div className="flex gap-4">
                        <button className="text-[10px] font-black uppercase tracking-widest text-arcticNavy border-b-2 border-arcticNavy pb-1">
                          All
                        </button>
                        <button className="text-[10px] font-black uppercase tracking-widest text-steelBlue hover:text-arcticNavy transition-colors pb-1">
                          Requests
                        </button>
                        <button className="text-[10px] font-black uppercase tracking-widest text-steelBlue hover:text-arcticNavy transition-colors pb-1">
                          Orders
                        </button>
                      </div>
                      <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-steelBlue hover:text-arcticNavy transition-colors">
                        <FilterIcon className="w-3 h-3" /> Filter
                      </button>
                    </div>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-iceWhite/50 border-b border-silverMist">
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue">
                            Order ID
                          </th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue">
                            Customer / Doctor
                          </th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue">
                            Items
                          </th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue text-center">
                            Status
                          </th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-steelBlue text-right">
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-silverMist/50">
                        {filteredOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="hover:bg-iceWhite/50 transition-colors group cursor-pointer"
                          >
                            <td className="px-6 py-4">
                              <span className="text-xs font-black text-arcticNavy">
                                {order.id}
                              </span>
                              <p className="text-[9px] font-bold uppercase text-steelBlue/60 tracking-tighter mt-0.5">
                                {order.type}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-arcticNavy/5 flex items-center justify-center">
                                  <UserIcon className="w-3.5 h-3.5 text-arcticNavy" />
                                </div>
                                <span className="text-sm font-bold text-obsidian">
                                  {order.customer}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-medium text-steelBlue">
                                {order.items}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                <span
                                  className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' : order.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-100' : order.status === 'ready' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
                                >
                                  {order.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="text-xs font-medium text-steelBlue">
                                {order.time}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <div className="mb-10">
                    <h1 className="text-4xl font-black tracking-tighter text-obsidian mb-2">
                      Performance Analytics
                    </h1>
                    <p className="text-steelBlue font-medium">
                      Insights into your kit availability, search trends, and
                      order fulfillment.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-8 mb-10">
                    <div className="bg-white border border-silverMist rounded-[2rem] p-8 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-steelBlue">
                          Search Visibility
                        </p>
                        <TrendingUpIcon className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-5xl font-black tracking-tighter text-obsidian mb-2">
                        1,284
                      </p>
                      <p className="text-sm font-bold text-green-600">
                        +18% this week
                      </p>
                      <p className="text-xs text-steelBlue/60 mt-4 leading-relaxed">
                        Times your pharmacy appeared in patient search results.
                      </p>
                    </div>
                    <div className="bg-white border border-silverMist rounded-[2rem] p-8 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-steelBlue">
                          Fulfillment Rate
                        </p>
                        <TrendingUpIcon className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-5xl font-black tracking-tighter text-obsidian mb-2">
                        94%
                      </p>
                      <p className="text-sm font-bold text-green-600">
                        +2% vs last month
                      </p>
                      <p className="text-xs text-steelBlue/60 mt-4 leading-relaxed">
                        Percentage of requests successfully converted to
                        pickups.
                      </p>
                    </div>
                    <div className="bg-white border border-silverMist rounded-[2rem] p-8 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-steelBlue">
                          Avg. Pickup Time
                        </p>
                        <TrendingDownIcon className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-5xl font-black tracking-tighter text-obsidian mb-2">
                        42m
                      </p>
                      <p className="text-sm font-bold text-green-600">
                        -5m improvement
                      </p>
                      <p className="text-xs text-steelBlue/60 mt-4 leading-relaxed">
                        Average time from order confirmation to kit collection.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="bg-white border border-silverMist rounded-[2rem] p-8 shadow-sm">
                      <h3 className="text-lg font-black tracking-tighter text-obsidian mb-6">
                        Top Searched Kits
                      </h3>
                      <div className="space-y-6">
                        {[
                          {
                            name: 'Maternity Delivery Kit',
                            count: 420,
                            trend: '+12%',
                          },
                          {
                            name: 'Laparoscopic Surgery Kit',
                            count: 310,
                            trend: '+5%',
                          },
                          {
                            name: 'Minor Surgical Kit',
                            count: 280,
                            trend: '-2%',
                          },
                          {
                            name: 'Wound Care Kit',
                            count: 190,
                            trend: '+8%',
                          },
                        ].map((kit, i) => (
                          <div
                            key={kit.name}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-black text-steelBlue/40">
                                0{i + 1}
                              </span>
                              <p className="text-sm font-bold text-obsidian">
                                {kit.name}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-black text-arcticNavy">
                                {kit.count}
                              </span>
                              <span
                                className={`text-[10px] font-bold ${kit.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}
                              >
                                {kit.trend}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white border border-silverMist rounded-[2rem] p-8 shadow-sm flex flex-col justify-center items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-arcticNavy/5 flex items-center justify-center mb-6">
                        <CalendarIcon className="w-8 h-8 text-arcticNavy" />
                      </div>
                      <h3 className="text-xl font-black tracking-tighter text-obsidian mb-2">
                        Weekly Report Ready
                      </h3>
                      <p className="text-sm text-steelBlue mb-8 max-w-[240px]">
                        Your performance summary for June 24 - June 30 is now
                        available.
                      </p>
                      <button className="flex items-center gap-2 bg-arcticNavy text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-obsidian transition-all">
                        Download PDF <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save Prompt */}
            {activeTab === 'stock' && !saved && stock !== INITIAL_STOCK && (
              <motion.div
                initial={{
                  y: 20,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                className="fixed bottom-8 right-8 bg-arcticNavy text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-[60]"
              >
                <p className="text-sm font-bold">
                  You have unsaved changes in your inventory.
                </p>
                <button
                  onClick={handleSave}
                  className="bg-white text-arcticNavy px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-iceWhite transition-all"
                >
                  Save Now
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { HowItWorks } from './pages/HowItWorks';
import { Search } from './pages/Search';
import { Help } from './pages/Help';
import { NoResults } from './pages/NoResults';
import { About } from './pages/About';
import { MapView } from './pages/MapView';
import { Login } from './pages/auth/Login';
import { PharmacyDashboard } from './pages/pharmacy/PharmacyDashboard';
import { AdminPanel } from './pages/admin/AdminPanel';
import { SyncLogs } from './pages/admin/SyncLogs';
import { Services } from './pages/Services';
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/search" element={<Search />} />
        <Route path="/help" element={<Help />} />
        <Route path="/no-results" element={<NoResults />} />
        <Route path="/about" element={<About />} />
        <Route path="/map-view" element={<MapView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/sync-logs" element={<SyncLogs />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </BrowserRouter>);

}
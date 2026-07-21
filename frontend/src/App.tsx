import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { HowItWorks } from './pages/HowItWorks';
import { Search } from './pages/Search';
import { Help } from './pages/Help';
import { NoResults } from './pages/NoResults';
import { About } from './pages/About';
import { Stories } from './pages/Stories';

const MapView = lazy(() => import('./pages/MapView').then((module) => ({ default: module.MapView })));
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
        <Route path="/map-view" element={
          <Suspense fallback={<div className="min-h-screen bg-iceWhite flex items-center justify-center font-bold text-arcticNavy">Loading map…</div>}>
            <MapView />
          </Suspense>
        } />
        <Route path="/stories" element={<Stories />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>);

}

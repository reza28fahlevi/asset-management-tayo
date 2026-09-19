import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardScreen } from './pages/DashboardScreen';
import { MasterArmadaScreen } from './pages/MasterArmadaScreen';
import { TrackingBanScreen } from './pages/TrackingBanScreen';
import { GudangScreen } from './pages/GudangScreen';
import { LegalitasScreen } from './pages/LegalitasScreen';
import { DispatchSerahTerimaScreen } from './pages/DispatchSerahTerimaScreen';
import { IncidentScreen } from './pages/IncidentScreen';
import { MasterPoolScreen } from './pages/MasterPoolScreen';
import { InspeksiPreTripScreen } from './pages/InspeksiPreTripScreen';
import { AnalitikBiayaScreen } from './pages/AnalitikBiayaScreen';
import { PerawatanSPKScreen } from './pages/PerawatanSPKScreen';

export const App: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('tayo-theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tayo-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tayo-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout isDark={isDark} onToggleTheme={toggleTheme} />}>
          <Route path="/" element={<DashboardScreen />} />
          <Route path="/dashboard-overview" element={<DashboardScreen />} />
          <Route path="/master-armada" element={<MasterArmadaScreen />} />
          <Route path="/armada-sasis" element={<MasterArmadaScreen />} />
          <Route path="/pelacakan-ban-komponen" element={<TrackingBanScreen />} />
          <Route path="/master-pool-trayek" element={<MasterPoolScreen />} />
          <Route path="/inspeksi-pre-trip" element={<InspeksiPreTripScreen />} />
          <Route path="/dispatch-serah-terima" element={<DispatchSerahTerimaScreen />} />
          <Route path="/operasional-bus" element={<DispatchSerahTerimaScreen />} />
          <Route path="/log-insiden" element={<IncidentScreen />} />
          <Route path="/perawatan-spk" element={<PerawatanSPKScreen />} />
          <Route path="/bengkel-spk" element={<PerawatanSPKScreen />} />
          <Route path="/gudang-suku-cadang" element={<GudangScreen />} />
          <Route path="/suku-cadang-ban" element={<GudangScreen />} />
          <Route path="/legalitas-regulasi" element={<LegalitasScreen />} />
          <Route path="/legalitas" element={<LegalitasScreen />} />
          <Route path="/analitik-biaya-km" element={<AnalitikBiayaScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

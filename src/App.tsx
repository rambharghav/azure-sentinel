import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './hooks/useAppState';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import SimulationPage from './pages/SimulationPage';
import ArchitecturePage from './pages/ArchitecturePage';
import DetectionRulesPage from './pages/DetectionRulesPage';
import IncidentsPage from './pages/IncidentsPage';
import InvestigationPage from './pages/InvestigationPage';
import TuningPage from './pages/TuningPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="simulation" element={<SimulationPage />} />
            <Route path="architecture" element={<ArchitecturePage />} />
            <Route path="rules" element={<DetectionRulesPage />} />
            <Route path="incidents" element={<IncidentsPage />} />
            <Route path="investigation" element={<InvestigationPage />} />
            <Route path="investigation/:id" element={<InvestigationPage />} />
            <Route path="tuning" element={<TuningPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

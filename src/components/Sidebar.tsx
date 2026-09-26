import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Play,
  Network,
  FileCode,
  AlertTriangle,
  Search,
  SlidersHorizontal,
  Shield,
  Activity,
  Database,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/simulation', label: 'Live Simulation', icon: Play },
  { path: '/architecture', label: 'Architecture', icon: Network },
  { path: '/rules', label: 'Detection Rules', icon: FileCode },
  { path: '/incidents', label: 'Incidents', icon: AlertTriangle },
  { path: '/investigation', label: 'Investigation', icon: Search },
  { path: '/tuning', label: 'Rule Tuning', icon: SlidersHorizontal },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-5 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
            }}
          >
            <Shield size={20} color="white" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-wider text-white leading-tight">
              SENTINEL
            </div>
            <div className="text-sm font-bold tracking-wider text-cyber-blue leading-tight">
              SECURITY
            </div>
          </div>
        </div>
        <div className="text-[0.65rem] text-navy-400 tracking-wide mt-1.5 ml-0.5">
          Threat Detection Platform
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 my-3 h-px bg-navy-700/50" />

      {/* Navigation */}
      <nav className="px-3 flex-1">
        <div className="text-[0.65rem] font-semibold text-navy-400 tracking-widest uppercase px-3 mb-2">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar-link mb-0.5 ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
              aria-label={item.label}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Status */}
      <div className="p-4 mx-3 mb-3 rounded-xl" style={{ background: 'rgba(15, 22, 41, 0.6)' }}>
        <div className="text-[0.65rem] font-semibold text-navy-400 tracking-widest uppercase mb-3">
          System Status
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Activity size={12} className="text-status-healthy" />
            <span className="text-navy-200">Monitoring Active</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Database size={12} className="text-status-healthy" />
            <span className="text-navy-200">Data Pipeline Connected</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-navy-700/50">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[0.65rem] font-semibold tracking-wider"
            style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.2)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            DEMO MODE
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-3 left-3 z-50 p-2 rounded-lg lg:hidden"
        style={{ background: 'rgba(15, 22, 41, 0.9)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
      </button>

      {/* Desktop sidebar */}
      <aside
        className="sidebar-desktop fixed left-0 top-0 h-screen w-[240px] flex flex-col z-40"
        style={{
          background: 'rgba(10, 14, 26, 0.95)',
          borderRight: '1px solid rgba(59, 130, 246, 0.08)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="fixed left-0 top-0 h-screen w-[240px] flex flex-col z-50 lg:hidden animate-slide-in-right"
            style={{
              background: 'rgba(10, 14, 26, 0.98)',
              borderRight: '1px solid rgba(59, 130, 246, 0.15)',
            }}
          >
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}

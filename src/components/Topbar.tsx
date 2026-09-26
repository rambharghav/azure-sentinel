import { useState, useRef, useEffect } from 'react';
import { Search, Bell, RotateCcw, User, FlaskConical } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { state, resetDemo, dispatch } = useAppState();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [bellShake, setBellShake] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Bell shake effect when new notifications arrive
  useEffect(() => {
    if (unreadCount > 0) {
      setBellShake(true);
      const timer = setTimeout(() => setBellShake(false), 600);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  const handleReset = () => {
    resetDemo();
    setShowResetConfirm(false);
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  return (
    <>
      <header
        className="sticky top-0 z-30 px-6 py-3 flex items-center justify-between"
        style={{
          background: 'rgba(10, 14, 26, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.06)',
        }}
      >
        {/* Left */}
        <div className="pl-0 lg:pl-0">
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          {subtitle && <p className="text-xs text-navy-400 mt-0.5">{subtitle}</p>}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button
            className="p-2 rounded-lg transition-colors hover:bg-navy-800"
            aria-label="Search"
          >
            <Search size={17} className="text-navy-400" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <button
              className={`p-2 rounded-lg transition-colors hover:bg-navy-800 relative ${bellShake ? 'animate-bell-shake' : ''}`}
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              <Bell size={17} className="text-navy-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[0.6rem] font-bold flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="p-3 border-b border-navy-700/50">
                  <div className="text-sm font-semibold text-white">Notifications</div>
                  <div className="text-[0.7rem] text-navy-400">{unreadCount} unread</div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {state.notifications.length === 0 ? (
                    <div className="p-6 text-center text-navy-400 text-sm">No notifications</div>
                  ) : (
                    state.notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-3 py-2.5 border-b border-navy-800/50 cursor-pointer transition-colors hover:bg-navy-800/30 ${!notif.read ? 'bg-navy-800/20' : ''}`}
                        onClick={() => {
                          dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notif.id });
                          if (notif.incidentId) {
                            dispatch({ type: 'SELECT_INCIDENT', payload: notif.incidentId });
                            navigate('/investigation');
                          }
                          setShowNotifications(false);
                        }}
                      >
                        <div className="flex items-start gap-2.5">
                          <div
                            className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                            style={{ background: severityColor(notif.severity) }}
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-medium text-white truncate">
                              {notif.title}
                            </div>
                            <div className="text-[0.7rem] text-navy-400 mt-0.5 truncate">
                              {notif.message}
                            </div>
                            <div className="text-[0.65rem] text-navy-500 mt-1">
                              {notif.timestamp}
                            </div>
                          </div>
                          {!notif.read && (
                            <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue shrink-0 mt-1.5" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Demo badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[0.65rem] font-semibold tracking-wider"
            style={{
              background: 'rgba(59, 130, 246, 0.08)',
              color: '#60a5fa',
              border: '1px solid rgba(59, 130, 246, 0.15)',
            }}
          >
            <FlaskConical size={12} />
            DEMO ENVIRONMENT
          </div>

          {/* Reset */}
          <button
            className="p-2 rounded-lg transition-colors hover:bg-navy-800"
            onClick={() => setShowResetConfirm(true)}
            aria-label="Reset demo"
            title="Reset Demo"
          >
            <RotateCcw size={17} className="text-navy-400" />
          </button>

          {/* User */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2))',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <User size={15} className="text-cyber-blue" />
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="modal-overlay" onClick={() => setShowResetConfirm(false)}>
          <div
            className="glass-card p-6 max-w-sm mx-4 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <RotateCcw size={20} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Reset Demo?</h3>
                <p className="text-xs text-navy-400">This will clear all simulated data</p>
              </div>
            </div>
            <p className="text-xs text-navy-300 mb-5">
              All simulated incidents, events, and counter changes will be reset to the initial demo
              state. This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button className="btn-secondary text-xs" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </button>
              <button className="btn-danger text-xs" onClick={handleReset}>
                Reset Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

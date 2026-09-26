import { useEffect, useState } from 'react';
import { type Notification as NotifType } from '../types';

interface ToastProps {
  notifications: NotifType[];
}

export default function ToastContainer({ notifications }: ToastProps) {
  const [visibleToasts, setVisibleToasts] = useState<NotifType[]>([]);

  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      // Only show toast for truly new notifications (check if already showing)
      if (!visibleToasts.find((t) => t.id === latest.id)) {
        setVisibleToasts((prev) => [latest, ...prev].slice(0, 3));
        // Auto-remove after 5s
        setTimeout(() => {
          setVisibleToasts((prev) => prev.filter((t) => t.id !== latest.id));
        }, 5000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications.length]);

  const severityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '🔔';
      default: return 'ℹ️';
    }
  };

  if (visibleToasts.length === 0) return null;

  return (
    <div className="toast-container">
      {visibleToasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toast.severity === 'critical' ? 'toast-critical' : toast.severity === 'high' ? 'toast-high' : ''}`}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-3">
            <span className="text-lg">{severityIcon(toast.severity)}</span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white">{toast.title}</div>
              <div className="text-xs text-navy-300 mt-0.5">{toast.message}</div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`badge badge-${toast.severity} !text-[0.6rem] !py-0 !px-2`}>
                  {toast.severity.toUpperCase()}
                </span>
                <span className="text-[0.65rem] text-navy-500">{toast.timestamp}</span>
              </div>
            </div>
            <button
              className="text-navy-500 hover:text-white text-lg leading-none"
              onClick={() => setVisibleToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

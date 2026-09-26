import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Globe,
  Server,
  Hash,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  ArrowLeft,
  Eye,
  Zap,
  ChevronDown,
} from 'lucide-react';
import Topbar from '../components/Topbar';
import { useAppState } from '../hooks/useAppState';

export default function InvestigationPage() {
  const { state, dispatch, updateIncidentStatus } = useAppState();
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<string[]>([]);

  // Determine which incident to show
  const incidentId = state.selectedIncidentId || (state.incidents.length > 0 ? state.incidents[0].id : null);
  const incident = state.incidents.find((i) => i.id === incidentId);

  // Incident selector for mobile
  const [showSelector, setShowSelector] = useState(false);

  if (!incident) {
    return (
      <div>
        <Topbar title="Incident Investigation" subtitle="Analyze security incidents" />
        <div className="p-6">
          <div className="glass-card p-12 text-center">
            <AlertTriangle size={40} className="text-navy-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Incident Selected</h3>
            <p className="text-sm text-navy-400 mb-4">
              Select an incident from the Incidents page or run a simulation to create one.
            </p>
            <div className="flex gap-3 justify-center">
              <button className="btn-primary text-sm" onClick={() => navigate('/incidents')}>
                View Incidents
              </button>
              <button className="btn-secondary text-sm" onClick={() => navigate('/simulation')}>
                Run Simulation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const severityColor = incident.severity === 'critical' ? '#ef4444' : incident.severity === 'high' ? '#f97316' : incident.severity === 'medium' ? '#f59e0b' : '#3b82f6';

  const handleAddNote = () => {
    if (note.trim()) {
      setNotes((prev) => [...prev, note.trim()]);
      setNote('');
    }
  };

  return (
    <div>
      <Topbar title="Incident Investigation" subtitle="Detailed incident analysis and response" />

      <div className="p-6 space-y-5">
        {/* Incident header */}
        <div
          className="glass-card p-5 animate-fade-in-up"
          style={{ borderColor: `${severityColor}30` }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <button
              className="p-1.5 rounded-lg hover:bg-navy-800 transition-colors"
              onClick={() => navigate('/incidents')}
              aria-label="Back to incidents"
            >
              <ArrowLeft size={17} className="text-navy-400" />
            </button>
            <span className="text-xs font-mono text-cyber-blue font-bold">{incident.id}</span>
            <span className={`badge badge-${incident.severity}`}>
              {incident.severity.toUpperCase()}
            </span>
            <span className={`badge status-${incident.status}`}>
              {incident.status.toUpperCase()}
            </span>

            {/* Incident selector */}
            <div className="ml-auto relative">
              <button
                className="btn-secondary !text-xs !py-1.5"
                onClick={() => setShowSelector(!showSelector)}
              >
                Switch Incident <ChevronDown size={13} />
              </button>
              {showSelector && (
                <div className="absolute right-0 top-full mt-1 w-64 rounded-xl overflow-hidden z-50 animate-slide-down"
                  style={{ background: 'rgba(10,14,26,0.98)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  {state.incidents.map((inc) => (
                    <button
                      key={inc.id}
                      className={`w-full text-left px-3 py-2.5 text-xs hover:bg-navy-800/30 transition-colors ${inc.id === incident.id ? 'bg-navy-800/30' : ''}`}
                      onClick={() => {
                        dispatch({ type: 'SELECT_INCIDENT', payload: inc.id });
                        setShowSelector(false);
                      }}
                    >
                      <span className="font-mono text-cyber-blue">{inc.id}</span>
                      <span className="text-navy-300 ml-2">{inc.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <h2 className="text-lg font-bold text-white mb-1">{incident.title}</h2>
          <p className="text-xs text-navy-400">{incident.detectionRule}</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { icon: User, label: 'Account', value: incident.account, color: '#3b82f6' },
            { icon: Globe, label: 'Source IP', value: incident.sourceIp, color: '#06b6d4' },
            { icon: Server, label: 'Host', value: incident.host, color: '#8b5cf6' },
            { icon: Hash, label: 'Failed Attempts', value: String(incident.failedAttempts), color: '#ef4444' },
            { icon: Clock, label: 'Time Window', value: incident.timeWindow || '10 minutes', color: '#f59e0b' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="glass-card-static p-3 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} style={{ color: card.color }} />
                  <span className="text-[0.65rem] text-navy-500 uppercase tracking-wider font-semibold">
                    {card.label}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white font-mono truncate">{card.value}</div>
              </div>
            );
          })}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Timeline - takes 2 cols */}
          <div className="lg:col-span-2 glass-card p-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-sm font-semibold text-white mb-4">Event Timeline</h3>
            <div className="relative pl-8">
              <div className="timeline-connector" />
              <div className="space-y-4">
                {incident.events.map((evt, i) => (
                  <div key={evt.id} className="relative animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    {/* Dot */}
                    <div
                      className="absolute left-[-1.55rem] w-3 h-3 rounded-full border-2 z-10"
                      style={{
                        background: evt.status === 'failed' ? '#ef4444' : '#22c55e',
                        borderColor: evt.status === 'failed' ? '#fca5a5' : '#86efac',
                        top: '0.2rem',
                      }}
                    />
                    <div className="event-stream-item" style={{ borderLeft: `3px solid ${evt.status === 'failed' ? '#ef4444' : '#22c55e'}` }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {evt.status === 'failed' ? (
                            <XCircle size={14} className="text-red-400" />
                          ) : (
                            <CheckCircle size={14} className="text-emerald-400" />
                          )}
                          <span className="text-xs text-white font-medium">
                            {evt.status === 'failed' ? 'Authentication Failed' : 'Authentication Successful'}
                          </span>
                        </div>
                        <span className="text-[0.65rem] font-mono text-navy-500">{evt.timestamp}</span>
                      </div>
                      <div className="mt-1.5 text-[0.7rem] text-navy-400">
                        Event ID: <span className="text-cyber-cyan">{evt.eventId}</span> &middot; Account:{' '}
                        <span className="text-white">{evt.account}</span> &middot; IP:{' '}
                        <span className="text-white">{evt.sourceIp}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Detection and Incident events */}
                <div className="relative animate-fade-in" style={{ animationDelay: `${incident.events.length * 100}ms` }}>
                  <div
                    className="absolute left-[-1.55rem] w-3 h-3 rounded-full border-2 z-10"
                    style={{ background: '#f59e0b', borderColor: '#fcd34d', top: '0.2rem' }}
                  />
                  <div className="event-stream-item alert">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} className="text-amber-400" />
                      <span className="text-xs text-amber-400 font-semibold">Detection Triggered</span>
                    </div>
                    <p className="text-[0.7rem] text-navy-400 mt-1">
                      KQL analytics rule matched the configured threshold.
                    </p>
                  </div>
                </div>

                <div className="relative animate-fade-in" style={{ animationDelay: `${(incident.events.length + 1) * 100}ms` }}>
                  <div
                    className="absolute left-[-1.55rem] w-3 h-3 rounded-full border-2 z-10"
                    style={{ background: '#8b5cf6', borderColor: '#c4b5fd', top: '0.2rem' }}
                  />
                  <div className="event-stream-item detection">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-purple-400" />
                      <span className="text-xs text-purple-400 font-semibold">Incident Created — {incident.id}</span>
                    </div>
                    <p className="text-[0.7rem] text-navy-400 mt-1">
                      Security incident assigned for investigation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Investigation Findings */}
            <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <h3 className="text-sm font-semibold text-white mb-3">Investigation Findings</h3>
              <div className="rounded-lg p-3 mb-4" style={{ background: 'rgba(10,14,26,0.5)' }}>
                <p className="text-xs text-navy-300 leading-relaxed">{incident.description}</p>
              </div>

              {incident.successfulLogin && (
                <div className="rounded-lg p-3 mb-4" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <AlertTriangle size={13} className="text-red-400" />
                    <span className="text-xs font-semibold text-red-400">Critical Finding</span>
                  </div>
                  <p className="text-xs text-navy-300">
                    A successful login was detected after multiple failures, suggesting the attacker may have gained access.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <h3 className="text-sm font-semibold text-white mb-3">Actions</h3>
              <div className="space-y-2">
                {incident.status === 'open' && (
                  <button
                    className="btn-warning w-full text-xs justify-center"
                    onClick={() => updateIncidentStatus(incident.id, 'investigating')}
                  >
                    <Eye size={14} />
                    Mark Investigating
                  </button>
                )}
                {(incident.status === 'open' || incident.status === 'investigating') && (
                  <button
                    className="btn-success w-full text-xs justify-center"
                    onClick={() => updateIncidentStatus(incident.id, 'resolved')}
                  >
                    <CheckCircle size={14} />
                    Resolve Incident
                  </button>
                )}
                {incident.status === 'resolved' && (
                  <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'rgba(34,197,94,0.08)' }}>
                    <CheckCircle size={14} className="text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">Incident Resolved</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <h3 className="text-sm font-semibold text-white mb-3">
                <FileText size={14} className="inline mr-1.5" />
                Investigation Notes
              </h3>

              {notes.map((n, i) => (
                <div
                  key={i}
                  className="rounded-lg p-2.5 mb-2 text-xs text-navy-300"
                  style={{ background: 'rgba(10,14,26,0.5)' }}
                >
                  {n}
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add investigation note..."
                  className="flex-1 px-3 py-2 rounded-lg text-xs text-white placeholder:text-navy-500 outline-none"
                  style={{
                    background: 'rgba(10,14,26,0.5)',
                    border: '1px solid rgba(59,130,246,0.15)',
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  aria-label="Investigation note"
                />
                <button className="btn-primary !text-xs !py-2 !px-3" onClick={handleAddNote}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

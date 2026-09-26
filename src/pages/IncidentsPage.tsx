import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye } from 'lucide-react';
import Topbar from '../components/Topbar';
import { useAppState } from '../hooks/useAppState';
import type { Severity, IncidentStatus } from '../types';

type FilterType = 'all' | Severity | IncidentStatus;

export default function IncidentsPage() {
  const { state, dispatch } = useAppState();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const severityFilters: FilterType[] = ['all', 'critical', 'high', 'medium', 'low'];
  const statusFilters: FilterType[] = ['open', 'investigating', 'resolved'];

  const filtered = state.incidents.filter((inc) => {
    if (filter !== 'all') {
      if (['critical', 'high', 'medium', 'low'].includes(filter)) {
        if (inc.severity !== filter) return false;
      } else {
        if (inc.status !== filter) return false;
      }
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inc.title.toLowerCase().includes(q) ||
        inc.account.toLowerCase().includes(q) ||
        inc.sourceIp.includes(q) ||
        inc.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openIncident = (id: string) => {
    dispatch({ type: 'SELECT_INCIDENT', payload: id });
    navigate('/investigation');
  };

  const severityColor = (s: Severity) => {
    switch (s) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  return (
    <div>
      <Topbar
        title="Incidents"
        subtitle="Security incidents requiring investigation and response"
      />

      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          {[
            { label: 'Total Incidents', value: state.incidents.length, color: '#3b82f6' },
            { label: 'Open', value: state.incidents.filter((i) => i.status === 'open').length, color: '#ef4444' },
            { label: 'Investigating', value: state.incidents.filter((i) => i.status === 'investigating').length, color: '#f59e0b' },
            { label: 'Resolved', value: state.incidents.filter((i) => i.status === 'resolved').length, color: '#22c55e' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card-static p-3 text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-[0.65rem] text-navy-400 mt-0.5" style={{ color: stat.color }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500" />
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm text-white placeholder:text-navy-500 outline-none"
              style={{
                background: 'rgba(15,22,41,0.6)',
                border: '1px solid rgba(59,130,246,0.15)',
              }}
              aria-label="Search incidents"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter size={14} className="text-navy-500" />
            {severityFilters.map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <div className="w-px h-5 bg-navy-700 mx-1" />
            {statusFilters.map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Incidents Table */}
        <div className="glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[0.65rem] text-navy-400 uppercase tracking-wider border-b border-navy-800/50">
                  <th className="text-left p-4 font-semibold">Incident ID</th>
                  <th className="text-left p-4 font-semibold">Severity</th>
                  <th className="text-left p-4 font-semibold">Detection</th>
                  <th className="text-left p-4 font-semibold hidden md:table-cell">Account</th>
                  <th className="text-left p-4 font-semibold hidden lg:table-cell">Source</th>
                  <th className="text-left p-4 font-semibold hidden sm:table-cell">Time</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-navy-400 text-sm">
                      No incidents match the current filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((inc, i) => (
                    <tr
                      key={inc.id}
                      className="border-b border-navy-800/30 cursor-pointer hover:bg-navy-800/20 transition-colors animate-fade-in"
                      style={{ animationDelay: `${i * 50}ms` }}
                      onClick={() => openIncident(inc.id)}
                    >
                      <td className="p-4 font-mono text-xs text-cyber-blue font-semibold">{inc.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: severityColor(inc.severity) }}
                          />
                          <span className={`badge badge-${inc.severity} !text-[0.6rem]`}>
                            {inc.severity.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-white font-medium text-xs">{inc.title}</td>
                      <td className="p-4 text-navy-300 font-mono text-xs hidden md:table-cell">
                        {inc.account}
                      </td>
                      <td className="p-4 text-navy-300 font-mono text-xs hidden lg:table-cell">
                        {inc.sourceIp}
                      </td>
                      <td className="p-4 text-navy-400 text-xs hidden sm:table-cell">
                        {inc.timestamp}
                      </td>
                      <td className="p-4">
                        <span className={`badge status-${inc.status} !text-[0.6rem]`}>
                          {inc.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          className="p-1.5 rounded-lg hover:bg-navy-700 transition-colors"
                          aria-label={`View incident ${inc.id}`}
                        >
                          <Eye size={15} className="text-navy-400" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

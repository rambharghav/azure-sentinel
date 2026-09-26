import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  Radar,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Monitor,
  Radio,
  Database,
  Shield,
  Code,
  FileWarning,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Topbar from '../components/Topbar';
import { useAppState } from '../hooks/useAppState';
import type { Severity, IncidentStatus } from '../types';

function AnimatedNumber({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span className="animate-count-up">{display}</span>;
}

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`badge badge-${severity}`}>
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background:
            severity === 'critical'
              ? '#ef4444'
              : severity === 'high'
                ? '#f97316'
                : severity === 'medium'
                  ? '#f59e0b'
                  : '#3b82f6',
        }}
      />
      {severity.toUpperCase()}
    </span>
  );
}

function StatusBadge({ status }: { status: IncidentStatus }) {
  return <span className={`badge status-${status}`}>{status.toUpperCase()}</span>;
}

const pipelineSteps = [
  { icon: Monitor, label: 'Windows VM', color: '#3b82f6' },
  { icon: Radio, label: 'Azure Monitor Agent', color: '#0ea5e9' },
  { icon: Database, label: 'Log Analytics', color: '#6366f1' },
  { icon: Shield, label: 'Microsoft Sentinel', color: '#8b5cf6' },
  { icon: Code, label: 'KQL Rules', color: '#ec4899' },
  { icon: FileWarning, label: 'Incidents', color: '#ef4444' },
];

export default function DashboardPage() {
  const { state } = useAppState();
  const navigate = useNavigate();
  const [activePipelineNode, setActivePipelineNode] = useState(-1);

  // Pipeline animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePipelineNode((prev) => (prev >= pipelineSteps.length - 1 ? -1 : prev + 1));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const activeIncidentCount = state.incidents.filter(
    (i) => i.status === 'open' || i.status === 'investigating',
  ).length;
  const highPriorityCount = state.incidents.filter(
    (i) =>
      (i.severity === 'high' || i.severity === 'critical') && i.status !== 'resolved',
  ).length;

  const kpiCards = [
    {
      label: 'Failed Logins',
      value: state.failedLoginCount,
      change: '+18% today',
      changeUp: true,
      icon: ShieldAlert,
      color: '#ef4444',
      accent: '239, 68, 68',
    },
    {
      label: 'Active Incidents',
      value: activeIncidentCount,
      change: `${highPriorityCount} high priority`,
      changeUp: true,
      icon: AlertTriangle,
      color: '#f97316',
      accent: '249, 115, 22',
    },
    {
      label: 'Detections',
      value: state.detectionsTriggered,
      change: '2 triggered today',
      changeUp: false,
      icon: Radar,
      color: '#3b82f6',
      accent: '59, 130, 246',
    },
    {
      label: 'False Positive Rate',
      value: state.falsePositiveRate,
      change: '↓ 8% after tuning',
      changeUp: false,
      icon: TrendingDown,
      color: '#22c55e',
      accent: '34, 197, 94',
      suffix: '%',
    },
  ];

  return (
    <div>
      <Topbar
        title="Security Operations Dashboard"
        subtitle="Real-time authentication monitoring and threat detection"
      />

      <div className="p-6 space-y-6">
        {/* Hero Status Banner */}
        <div
          className="glass-card-static p-4 flex items-center gap-3 animate-fade-in-up"
          style={{ borderColor: 'rgba(34, 197, 94, 0.2)' }}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <CheckCircle size={18} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
              SYSTEM OPERATIONAL
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-xs text-navy-400">
              All monitoring components are functioning normally.
            </div>
          </div>
          <div className="ml-auto hidden sm:block">
            <span
              className="text-[0.65rem] px-2.5 py-1 rounded-md font-medium"
              style={{
                background: 'rgba(59, 130, 246, 0.08)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.12)',
              }}
            >
              DEMO ENVIRONMENT — Visualization Layer
            </span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className="metric-card animate-fade-in-up"
                style={{
                  animationDelay: `${i * 100}ms`,
                  '--accent': kpi.color,
                } as React.CSSProperties}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[0.7rem] font-semibold text-navy-400 tracking-wider uppercase">
                    {kpi.label}
                  </span>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `rgba(${kpi.accent}, 0.12)` }}
                  >
                    <Icon size={16} style={{ color: kpi.color }} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1 metric-value">
                  <AnimatedNumber value={kpi.value} />
                  {kpi.suffix || ''}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {kpi.changeUp ? (
                    <ArrowUpRight size={13} className="text-red-400" />
                  ) : (
                    <ArrowDownRight size={13} className="text-emerald-400" />
                  )}
                  <span className={kpi.changeUp ? 'text-red-400' : 'text-emerald-400'}>
                    {kpi.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Failed Auth Chart */}
          <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <h3 className="text-sm font-semibold text-white mb-1">Failed Authentication Attempts</h3>
            <p className="text-[0.7rem] text-navy-400 mb-4">Last 6 hours — Event ID 4625</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={state.chartData}>
                <defs>
                  <linearGradient id="failedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.06)" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,14,26,0.95)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#e2e8f0',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="failed"
                  stroke="#ef4444"
                  fill="url(#failedGrad)"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 3 }}
                  name="Failed Attempts"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Auth Outcomes Chart */}
          <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <h3 className="text-sm font-semibold text-white mb-1">Authentication Outcomes</h3>
            <p className="text-[0.7rem] text-navy-400 mb-4">Distribution by status</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={state.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.06)" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,14,26,0.95)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#e2e8f0',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="successful" fill="#22c55e" radius={[3, 3, 0, 0]} name="Successful" />
                <Bar dataKey="failed" fill="#ef4444" radius={[3, 3, 0, 0]} name="Failed" />
                <Bar dataKey="suspicious" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Suspicious" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Recent Incidents</h3>
              <p className="text-[0.7rem] text-navy-400 mt-0.5">Latest security detections</p>
            </div>
            <button
              className="btn-secondary !text-xs !py-1.5 !px-3"
              onClick={() => navigate('/incidents')}
            >
              View All
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[0.7rem] text-navy-400 uppercase tracking-wider border-b border-navy-800/50">
                  <th className="text-left pb-3 pr-4 font-semibold">Severity</th>
                  <th className="text-left pb-3 pr-4 font-semibold">Incident</th>
                  <th className="text-left pb-3 pr-4 font-semibold hidden md:table-cell">Account</th>
                  <th className="text-left pb-3 pr-4 font-semibold hidden lg:table-cell">Source IP</th>
                  <th className="text-left pb-3 pr-4 font-semibold hidden sm:table-cell">Time</th>
                  <th className="text-left pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {state.incidents.slice(0, 5).map((inc, i) => (
                  <tr
                    key={inc.id}
                    className="border-b border-navy-800/30 cursor-pointer hover:bg-navy-800/20 transition-colors animate-fade-in"
                    style={{ animationDelay: `${i * 80}ms` }}
                    onClick={() => {
                      navigate('/investigation');
                    }}
                  >
                    <td className="py-3 pr-4">
                      <SeverityBadge severity={inc.severity} />
                    </td>
                    <td className="py-3 pr-4 text-white font-medium text-xs">{inc.title}</td>
                    <td className="py-3 pr-4 text-navy-300 text-xs font-mono hidden md:table-cell">
                      {inc.account}
                    </td>
                    <td className="py-3 pr-4 text-navy-300 text-xs font-mono hidden lg:table-cell">
                      {inc.sourceIp}
                    </td>
                    <td className="py-3 pr-4 text-navy-400 text-xs hidden sm:table-cell">
                      {inc.timestamp}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={inc.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detection Rules Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.rules.map((rule, i) => (
            <div
              key={rule.id}
              className="glass-card p-5 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${700 + i * 100}ms` }}
              onClick={() => navigate('/rules')}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[0.65rem] font-bold text-navy-500 tracking-wider">
                  {rule.id}
                </span>
                <span
                  className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-md"
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#4ade80',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  ACTIVE
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">{rule.name}</h4>
              <p className="text-xs text-navy-400 mb-3">{rule.condition}</p>
              <div className="flex items-center gap-4 text-[0.7rem] text-navy-400">
                <span>
                  Threshold: <span className="text-cyber-cyan font-semibold">{rule.threshold} failures</span>
                </span>
                <span>
                  Window: <span className="text-cyber-cyan font-semibold">{rule.timeWindow}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Detection Pipeline */}
        <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">Detection Pipeline</h3>
            <p className="text-[0.7rem] text-navy-400 mt-0.5">
              End-to-end security event processing workflow
            </p>
          </div>

          <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
            {pipelineSteps.map((step, i) => {
              const Icon = step.icon;
              const isActive = activePipelineNode === i;
              return (
                <div key={step.label} className="flex items-center gap-2 shrink-0">
                  <div
                    className={`pipeline-node ${isActive ? 'active animate-pulse-glow' : ''}`}
                    onClick={() => navigate('/architecture')}
                    style={
                      isActive
                        ? { borderColor: `${step.color}80`, boxShadow: `0 0 20px ${step.color}30` }
                        : {}
                    }
                  >
                    <Icon
                      size={20}
                      style={{ color: step.color }}
                      className="mx-auto mb-1.5"
                    />
                    <div className="text-[0.7rem] font-medium text-navy-200 whitespace-nowrap">
                      {step.label}
                    </div>
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <ChevronRight
                      size={16}
                      className={`text-navy-600 shrink-0 transition-colors ${
                        activePipelineNode === i ? 'text-cyber-blue animate-flow-pulse' : ''
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center py-4">
          <p className="text-xs text-navy-500 tracking-widest">
            DETECT &middot; INVESTIGATE &middot; TUNE
          </p>
        </div>
      </div>
    </div>
  );
}

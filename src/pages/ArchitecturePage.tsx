import { useState } from 'react';
import {
  Monitor,
  Radio,
  Database,
  Shield,
  Code,
  Bell,
  AlertTriangle,
  Search,
  SlidersHorizontal,
  CheckCircle,
  X,
  ArrowDown,
  Info,
} from 'lucide-react';
import Topbar from '../components/Topbar';
import { architectureNodes } from '../data/mockData';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  Monitor,
  Radio,
  Database,
  Shield,
  Code,
  Bell,
  AlertTriangle,
  Search,
  Sliders: SlidersHorizontal,
  CheckCircle,
};

export default function ArchitecturePage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const selected = architectureNodes.find((n) => n.id === selectedNode);

  return (
    <div>
      <Topbar
        title="Security Monitoring Architecture"
        subtitle="From raw authentication events to actionable security incidents"
      />

      <div className="p-6 space-y-6">
        {/* Why this matters */}
        <div className="glass-card-static p-4 animate-fade-in-up" style={{ borderColor: 'rgba(99, 102, 241, 0.2)' }}>
          <p className="text-xs text-navy-300">
            <span className="text-indigo-400 font-semibold">Why this matters:</span> Understanding the architecture is essential to see how each component contributes to the detection pipeline. Click any node below to learn more.
          </p>
        </div>

        {/* Architecture Flow */}
        <div className="flex flex-col items-center gap-1 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {architectureNodes.map((node, i) => {
            const IconComp = iconMap[node.icon] || Shield;
            const isSelected = selectedNode === node.id;

            return (
              <div key={node.id} className="flex flex-col items-center w-full max-w-xl">
                <div
                  className={`arch-node w-full ${isSelected ? 'animate-pulse-glow' : ''}`}
                  style={{
                    '--node-color': node.color,
                    borderColor: isSelected ? `${node.color}60` : undefined,
                    boxShadow: isSelected ? `0 0 25px ${node.color}20` : undefined,
                  } as React.CSSProperties}
                  onClick={() => setSelectedNode(isSelected ? null : node.id)}
                  role="button"
                  aria-expanded={isSelected}
                  aria-label={`${node.title} - click for details`}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedNode(isSelected ? null : node.id)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${node.color}15` }}
                    >
                      <IconComp size={24} style={{ color: node.color }} />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white">{node.title}</h3>
                      <p className="text-[0.7rem] text-navy-400 mt-0.5">{node.description}</p>
                    </div>
                    <Info size={15} className="text-navy-500 shrink-0" />
                  </div>

                  {/* Details on selected */}
                  {node.id === 'kql-rules' && (
                    <div className="mt-3 pt-3 border-t border-navy-800/50 text-left">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="rounded-lg p-2.5" style={{ background: 'rgba(10,14,26,0.5)' }}>
                          <div className="text-[0.65rem] text-navy-500 mb-1">Rule 1: Repeated Failed Login</div>
                          <code className="text-[0.7rem] text-pink-300">EventID == 4625 | FailedAttempts ≥ 5</code>
                        </div>
                        <div className="rounded-lg p-2.5" style={{ background: 'rgba(10,14,26,0.5)' }}>
                          <div className="text-[0.65rem] text-navy-500 mb-1">Rule 2: Failed → Successful Login</div>
                          <code className="text-[0.7rem] text-pink-300">4625 + 4624 within 15 min</code>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Arrow */}
                {i < architectureNodes.length - 1 && (
                  <div className="py-1">
                    <ArrowDown
                      size={18}
                      className="text-navy-600 animate-flow-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <div className="text-center py-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-red-400 font-semibold">Detect</span>
            <span className="text-navy-600">→</span>
            <span className="text-amber-400 font-semibold">Alert</span>
            <span className="text-navy-600">→</span>
            <span className="text-cyber-blue font-semibold">Investigate</span>
            <span className="text-navy-600">→</span>
            <span className="text-emerald-400 font-semibold">Tune</span>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[799]"
            onClick={() => setSelectedNode(null)}
          />
          <div className="arch-detail-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{selected.title}</h2>
              <button
                className="p-1.5 rounded-lg hover:bg-navy-800 transition-colors"
                onClick={() => setSelectedNode(null)}
                aria-label="Close panel"
              >
                <X size={18} className="text-navy-400" />
              </button>
            </div>

            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `${selected.color}15` }}
            >
              {(() => {
                const IconComp = iconMap[selected.icon] || Shield;
                return <IconComp size={28} style={{ color: selected.color }} />;
              })()}
            </div>

            <p className="text-sm text-navy-300 mb-6">{selected.description}</p>

            <div className="mb-6">
              <h4 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3">
                Details
              </h4>
              <div className="space-y-2">
                {selected.details.map((detail, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-navy-200"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: selected.color }}
                    />
                    {detail}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card-static p-4" style={{ borderColor: `${selected.color}20` }}>
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                Why This Matters
              </h4>
              <p className="text-xs text-navy-300 leading-relaxed">
                {(selected as any).whyItMatters}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

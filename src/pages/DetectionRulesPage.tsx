import { useState } from 'react';
import {
  Code,
  Play,
  Eye,
  XCircle,
  CheckCircle,
  AlertTriangle,
  ArrowDown,
} from 'lucide-react';
import Topbar from '../components/Topbar';
import { useAppState } from '../hooks/useAppState';

function KqlHighlight({ code }: { code: string }) {
  // Simple KQL syntax highlighting
  const keywords = ['where', 'summarize', 'by', 'project', 'let', 'join', 'on', 'kind'];
  const functions = ['count', 'ago', 'min', 'max', 'make_set', 'make_list'];

  const highlightLine = (line: string) => {
    let result = line;
    // Highlight pipe operators
    result = result.replace(/\|/g, '<span class="kql-operator">|</span>');
    // Highlight keywords
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'gi');
      result = result.replace(regex, '<span class="kql-keyword">$1</span>');
    });
    // Highlight functions
    functions.forEach((fn) => {
      const regex = new RegExp(`\\b(${fn})\\b`, 'gi');
      result = result.replace(regex, '<span class="kql-function">$1</span>');
    });
    // Highlight numbers
    result = result.replace(/\b(\d+[mhds]?)\b/g, '<span class="kql-number">$1</span>');
    // Highlight strings
    result = result.replace(/(["'])([^"']*)\1/g, '<span class="kql-string">$1$2$1</span>');

    return result;
  };

  return (
    <div className="kql-block">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-navy-800/50">
        <Code size={13} className="text-navy-500" />
        <span className="text-[0.65rem] text-navy-500 font-semibold tracking-wider">KQL QUERY</span>
      </div>
      <pre className="whitespace-pre-wrap">
        {code.split('\n').map((line, i) => (
          <div
            key={i}
            className="hover:bg-navy-800/20 px-1 -mx-1 rounded transition-colors"
            dangerouslySetInnerHTML={{ __html: highlightLine(line) || '&nbsp;' }}
          />
        ))}
      </pre>
    </div>
  );
}

export default function DetectionRulesPage() {
  const { state } = useAppState();
  const [testingRule, setTestingRule] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<string | null>(null);

  const sampleResults = [
    { ip: '192.168.1.24', account: 'admin', computer: 'SENTINEL-TEST-VM', failed: 5, first: '10:31:02', last: '10:31:14' },
    { ip: '192.168.1.18', account: 'test-user', computer: 'SENTINEL-TEST-VM', failed: 3, first: '10:20:30', last: '10:20:40' },
    { ip: '10.0.0.15', account: 'svc-backup', computer: 'SENTINEL-TEST-VM', failed: 7, first: '09:45:10', last: '09:46:30' },
  ];

  return (
    <div>
      <Topbar
        title="Analytics Rules"
        subtitle="KQL-based detection logic for authentication threat patterns"
      />

      <div className="p-6 space-y-6">
        {/* Why this matters */}
        <div className="glass-card-static p-4 animate-fade-in-up" style={{ borderColor: 'rgba(236, 72, 153, 0.2)' }}>
          <p className="text-xs text-navy-300">
            <span className="text-pink-400 font-semibold">Why this matters:</span> Analytics rules define
            <em> what</em> patterns to look for. Well-designed rules accurately detect threats while minimizing false positives.
          </p>
        </div>

        {/* Rule Cards */}
        {state.rules.map((rule, idx) => (
          <div
            key={rule.id}
            className="glass-card p-6 animate-fade-in-up"
            style={{ animationDelay: `${(idx + 1) * 150}ms` }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-[0.65rem] text-navy-500 font-bold tracking-wider">{rule.id}</span>
                <h3 className="text-base font-bold text-white mt-1">{rule.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge badge-${rule.severity}`}>
                  {rule.severity.toUpperCase()}
                </span>
                <span
                  className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-md"
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#4ade80',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  {rule.status.toUpperCase()}
                </span>
              </div>
            </div>

            <p className="text-sm text-navy-300 mb-4">{rule.description}</p>

            {/* Condition info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="rounded-lg p-3" style={{ background: 'rgba(10,14,26,0.5)' }}>
                <div className="text-[0.65rem] text-navy-500 uppercase tracking-wider mb-1">Condition</div>
                <div className="text-xs text-white font-medium">{rule.condition}</div>
              </div>
              <div className="rounded-lg p-3" style={{ background: 'rgba(10,14,26,0.5)' }}>
                <div className="text-[0.65rem] text-navy-500 uppercase tracking-wider mb-1">Event IDs</div>
                <div className="text-xs text-white font-mono">
                  {rule.eventIds.map((id) => (
                    <span key={id} className="inline-block mr-1.5 px-1.5 py-0.5 rounded bg-navy-800 text-cyber-cyan">
                      {id}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-lg p-3" style={{ background: 'rgba(10,14,26,0.5)' }}>
                <div className="text-[0.65rem] text-navy-500 uppercase tracking-wider mb-1">Time Window</div>
                <div className="text-xs text-white font-medium">{rule.timeWindow}</div>
              </div>
            </div>

            {/* KQL Query */}
            <KqlHighlight code={rule.kqlQuery} />

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                className="btn-primary text-xs"
                onClick={() => setTestingRule(testingRule === rule.id ? null : rule.id)}
              >
                <Play size={14} />
                Test Rule
              </button>
              <button
                className="btn-secondary text-xs"
                onClick={() => setShowResults(showResults === rule.id ? null : rule.id)}
              >
                <Eye size={14} />
                View Results
              </button>
            </div>

            {/* Test Results */}
            {testingRule === rule.id && (
              <div className="mt-4 animate-slide-down">
                <div className="rounded-xl p-4" style={{ background: 'rgba(10,14,26,0.5)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={15} className="text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">Test Completed — Rule Matched</span>
                  </div>
                  <div className="text-xs text-navy-300">
                    <p>The rule executed successfully against the SecurityEvent table.</p>
                    <p className="mt-1">
                      <strong className="text-white">{sampleResults.filter(r => r.failed >= rule.threshold).length} results</strong> matched the threshold of{' '}
                      <strong className="text-cyber-cyan">{rule.threshold}+ failures</strong> within{' '}
                      <strong className="text-cyber-cyan">{rule.timeWindow}</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sample Results Table */}
            {showResults === rule.id && (
              <div className="mt-4 animate-slide-down overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[0.65rem] text-navy-400 uppercase tracking-wider border-b border-navy-800/50">
                      <th className="text-left pb-2 pr-3 font-semibold">IP Address</th>
                      <th className="text-left pb-2 pr-3 font-semibold">Account</th>
                      <th className="text-left pb-2 pr-3 font-semibold">Computer</th>
                      <th className="text-left pb-2 pr-3 font-semibold">Failed</th>
                      <th className="text-left pb-2 pr-3 font-semibold">First Attempt</th>
                      <th className="text-left pb-2 font-semibold">Last Attempt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleResults.map((r, i) => (
                      <tr key={i} className="border-b border-navy-800/30">
                        <td className="py-2 pr-3 font-mono text-white">{r.ip}</td>
                        <td className="py-2 pr-3 font-mono text-navy-300">{r.account}</td>
                        <td className="py-2 pr-3 text-navy-300">{r.computer}</td>
                        <td className="py-2 pr-3">
                          <span className={r.failed >= rule.threshold ? 'text-red-400 font-semibold' : 'text-navy-400'}>
                            {r.failed}
                          </span>
                        </td>
                        <td className="py-2 pr-3 font-mono text-navy-400">{r.first}</td>
                        <td className="py-2 font-mono text-navy-400">{r.last}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Visual Flow for Rule 2 */}
            {rule.id === 'RULE-02' && (
              <div className="mt-5 pt-4 border-t border-navy-800/50">
                <h4 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3">
                  Detection Pattern
                </h4>
                <div className="flex items-center gap-3 justify-center flex-wrap">
                  {['FAILED', 'FAILED', 'FAILED', 'SUCCESS'].map((label, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        label === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {label === 'SUCCESS' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {label}
                      </div>
                      {i < 3 && <ArrowDown size={14} className="text-navy-600 rotate-[-90deg]" />}
                    </div>
                  ))}
                  <ArrowDown size={14} className="text-navy-600 rotate-[-90deg]" />
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <AlertTriangle size={12} />
                    🚨 DETECTION
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

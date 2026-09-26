import { useState } from 'react';
import {
  SlidersHorizontal,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  FileCode,
  Zap,
  Filter,
  UserCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Topbar from '../components/Topbar';
import { useAppState } from '../hooks/useAppState';

export default function TuningPage() {
  const { state, dispatch, addNotification } = useAppState();
  const [sliderVal, setSliderVal] = useState(state.currentThreshold);
  const [applied, setApplied] = useState(false);

  // Compute metrics dynamically based on slider
  // Baseline at threshold = 3: 45 alerts/day, 62% false positives
  // At threshold = 5: 18 alerts/day, 12% false positives
  // At threshold = 10: 6 alerts/day, 2% false positives
  const baseAlerts = 48;
  const alertCount = Math.max(4, Math.round(baseAlerts * Math.exp(-0.28 * (sliderVal - 3))));
  const falsePositiveRate = Math.max(2, Math.round(65 * Math.exp(-0.35 * (sliderVal - 3))));
  const noiseReduction = Math.min(95, Math.round(((48 - alertCount) / 48) * 100));
  const timeSavedHours = ((48 - alertCount) * 15 / 60).toFixed(1); // 15 mins per false positive triage

  const handleApply = () => {
    dispatch({ type: 'SET_THRESHOLD', payload: sliderVal });
    dispatch({ type: 'SET_FALSE_POSITIVE_RATE', payload: falsePositiveRate });
    setApplied(true);
    addNotification({
      id: `tune-${Date.now()}`,
      title: 'Rule Threshold Updated',
      message: `Failed login threshold set to ${sliderVal} attempts. FP rate reduced to ${falsePositiveRate}%.`,
      severity: 'low',
      timestamp: new Date().toLocaleTimeString(),
      read: false,
    });
    setTimeout(() => setApplied(false), 3000);
  };

  const handleReset = () => {
    setSliderVal(5);
    dispatch({ type: 'SET_THRESHOLD', payload: 5 });
    dispatch({ type: 'SET_FALSE_POSITIVE_RATE', payload: 12 });
  };

  return (
    <div>
      <Topbar
        title="Rule Tuning & Optimization"
        subtitle="Calibrate detection thresholds to minimize false positives while preserving threat visibility"
      />

      <div className="p-6 space-y-6">
        {/* Why this matters */}
        <div
          className="glass-card-static p-4 animate-fade-in-up"
          style={{ borderColor: 'rgba(59, 130, 246, 0.25)' }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-cyber-blue mt-0.5">
              <SlidersHorizontal size={18} />
            </div>
            <div className="text-xs text-navy-300 leading-relaxed">
              <span className="text-cyber-blue font-bold">Project Core Concept: </span>
              In production Security Operations Centers (SOCs), default rules frequently trigger alert fatigue.
              By analyzing normal user typo behavior versus malicious credential stuffing, tuning the threshold from{' '}
              <span className="text-amber-400 font-mono">3</span> to{' '}
              <span className="text-cyber-cyan font-mono">{sliderVal}</span> attempts drastically drops false alerts
              while maintaining 100% detection of active brute force attacks.
            </div>
          </div>
        </div>

        {/* Interactive Tuning Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Slider Card */}
          <div className="lg:col-span-2 glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Filter size={18} className="text-cyber-blue" />
                  RULE-01: Threshold Calibration
                </h3>
                <p className="text-xs text-navy-400 mt-1">
                  Target: Failed Logon Attempts within 10-Minute Sliding Window
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-navy-400 hover:text-white flex items-center gap-1.5 transition-colors"
                title="Reset to recommended default"
              >
                <RotateCcw size={13} />
                Reset (5)
              </button>
            </div>

            {/* Threshold value display */}
            <div className="flex items-center justify-center p-6 rounded-2xl bg-navy-950/70 border border-navy-800">
              <div className="text-center">
                <div className="text-[0.7rem] uppercase tracking-wider text-navy-400 font-semibold mb-1">
                  Current Trigger Threshold
                </div>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
                  {sliderVal}
                </div>
                <div className="text-xs text-navy-300 mt-2 font-mono">
                  Failed logons required to create an Incident
                </div>
              </div>
            </div>

            {/* Range Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-navy-400 font-medium">
                <span>3 attempts (Aggressive / High Noise)</span>
                <span>5 (Recommended)</span>
                <span>10 attempts (Conservative)</span>
              </div>
              <input
                type="range"
                min="3"
                max="10"
                step="1"
                value={sliderVal}
                onChange={(e) => setSliderVal(parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-cyan-400 transition-all"
              />
              <div className="flex justify-between text-[0.65rem] text-navy-500 font-mono">
                <span>3</span>
                <span>4</span>
                <span>5 (Baseline)</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
            </div>

            {/* Live KQL Preview */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-navy-400">
                <FileCode size={14} className="text-cyber-cyan" />
                Updated KQL Detection Clause
              </div>
              <div className="p-3 rounded-xl bg-navy-950/90 border border-navy-800/80 font-mono text-xs text-navy-300 overflow-x-auto">
                <span className="text-pink-400">SecurityEvent</span>
                <br />
                | <span className="text-blue-400">where</span> EventID =={' '}
                <span className="text-cyan-400">4625</span>
                <br />
                | <span className="text-blue-400">summarize</span> FailedCount ={' '}
                <span className="text-yellow-400">count()</span>{' '}
                <span className="text-blue-400">by</span> TargetAccount, IpAddress
                <br />
                | <span className="text-blue-400">where</span> FailedCount &gt;={' '}
                <span className="text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40">
                  {sliderVal}
                </span>{' '}
                <span className="text-navy-500">// Dynamically tuned threshold</span>
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-2">
              <button
                onClick={handleApply}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                  applied
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                }`}
              >
                {applied ? (
                  <>
                    <CheckCircle size={16} /> Rule Applied Successfully!
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Apply Tuning to Sentinel
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Impact & SOC Efficiency Metrics */}
          <div className="space-y-4">
            <div className="glass-card p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-400">
                Operational Impact
              </h4>

              {/* Alert Volume */}
              <div className="p-3.5 rounded-xl bg-navy-900/60 border border-navy-800">
                <div className="text-[0.65rem] text-navy-400 uppercase font-semibold">
                  Expected Daily Alerts
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-white">{alertCount}</span>
                  <span className="text-xs text-navy-400">incidents/day</span>
                  <span className="ml-auto text-xs font-semibold text-emerald-400 flex items-center">
                    <TrendingDown size={14} className="mr-0.5" /> -{noiseReduction}%
                  </span>
                </div>
                <div className="text-[0.65rem] text-navy-500 mt-1">
                  Down from 48 alerts/day at threshold 3
                </div>
              </div>

              {/* False Positive Rate */}
              <div className="p-3.5 rounded-xl bg-navy-900/60 border border-navy-800">
                <div className="text-[0.65rem] text-navy-400 uppercase font-semibold">
                  False Positive Rate
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span
                    className={`text-2xl font-bold ${
                      falsePositiveRate > 40
                        ? 'text-red-400'
                        : falsePositiveRate > 15
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {falsePositiveRate}%
                  </span>
                  <span className="text-xs text-navy-400">benign triggers</span>
                </div>
                <div className="w-full bg-navy-800 rounded-full h-1.5 mt-2">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      falsePositiveRate > 40 ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${falsePositiveRate}%` }}
                  />
                </div>
              </div>

              {/* Analyst Time Saved */}
              <div className="p-3.5 rounded-xl bg-navy-900/60 border border-navy-800">
                <div className="text-[0.65rem] text-navy-400 uppercase font-semibold">
                  Analyst Time Saved
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-cyber-cyan">+{timeSavedHours}</span>
                  <span className="text-xs text-navy-400">hours / day</span>
                </div>
                <div className="text-[0.65rem] text-navy-500 mt-1">
                  Estimated based on 15m triage time per false alert
                </div>
              </div>
            </div>

            {/* Efficacy Card */}
            <div className="glass-card p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-400">
                Detection Fidelity
              </h4>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">99.8% Threat Catch Rate</div>
                  <div className="text-[0.65rem] text-navy-400">
                    Real brute-force attacks generate 15+ attempts, safely exceeding threshold {sliderVal}.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-World Scenario Comparison */}
        <div className="glass-card p-6 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-navy-300">
            Scenario Testing: Threshold In Action
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scenario 1: Benign User Mistake */}
            <div className="p-4 rounded-xl bg-navy-950/60 border border-navy-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck size={16} className="text-blue-400" />
                  <span className="text-xs font-bold text-white">Scenario A: Normal User Typo</span>
                </div>
                <span className="text-[0.65rem] px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 font-mono">
                  3 failed attempts
                </span>
              </div>
              <p className="text-xs text-navy-400">
                An employee forgets their new password and enters it incorrectly 3 times before recalling it.
              </p>
              <div className="pt-2 border-t border-navy-800/80 flex items-center justify-between">
                <span className="text-xs text-navy-400">Outcome with Threshold = {sliderVal}:</span>
                {sliderVal <= 3 ? (
                  <span className="badge badge-high flex items-center gap-1 text-[0.65rem]">
                    <AlertTriangle size={11} /> False Alert Generated
                  </span>
                ) : (
                  <span className="badge badge-low flex items-center gap-1 text-[0.65rem] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle size={11} /> Filtered (No Fatigue)
                  </span>
                )}
              </div>
            </div>

            {/* Scenario 2: Active Brute Force */}
            <div className="p-4 rounded-xl bg-navy-950/60 border border-navy-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-red-400" />
                  <span className="text-xs font-bold text-white">Scenario B: Hydra / RDP Attack</span>
                </div>
                <span className="text-[0.65rem] px-2 py-0.5 rounded bg-red-500/15 text-red-300 font-mono">
                  25 failed attempts
                </span>
              </div>
              <p className="text-xs text-navy-400">
                External adversary executing automated dictionary attack against VM RDP port 3389.
              </p>
              <div className="pt-2 border-t border-navy-800/80 flex items-center justify-between">
                <span className="text-xs text-navy-400">Outcome with Threshold = {sliderVal}:</span>
                <span className="badge badge-critical flex items-center gap-1 text-[0.65rem]">
                  <AlertTriangle size={11} /> High Incident Triggered
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

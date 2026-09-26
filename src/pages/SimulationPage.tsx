import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  ShieldAlert,
  UserCheck,
  XCircle,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ArrowRight,
  Play,
} from 'lucide-react';
import Topbar from '../components/Topbar';
import { useAppState } from '../hooks/useAppState';
import type { Incident, SecurityEvent } from '../types';

interface SimEvent {
  id: string;
  timestamp: string;
  message: string;
  status: 'failed' | 'success' | 'info' | 'alert' | 'detection';
}

function getNow() {
  const d = new Date();
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function SimulationPage() {
  const { state, dispatch, addIncident, addNotification } = useAppState();
  const [events, setEvents] = useState<SimEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationType, setSimulationType] = useState<string | null>(null);
  const [createdIncidentId, setCreatedIncidentId] = useState<string | null>(null);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const eventListRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const addEvent = useCallback((evt: SimEvent) => {
    setEvents((prev) => [...prev, evt]);
    setTimeout(() => {
      eventListRef.current?.scrollTo({ top: eventListRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
  }, []);

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // ===== FAILED LOGIN ATTACK =====
  const simulateFailedLogin = useCallback(async () => {
    setIsRunning(true);
    setSimulationType('failed-login');
    setEvents([]);
    setCreatedIncidentId(null);
    setPipelineStep(-1);

    addEvent({ id: 'start', timestamp: getNow(), message: 'ATTACK SIMULATION STARTED', status: 'info' });
    await delay(600);

    const threshold = state.currentThreshold;
    const newEvents: SecurityEvent[] = [];

    for (let i = 1; i <= threshold; i++) {
      await delay(700);
      const ts = getNow();
      addEvent({
        id: `fail-${i}`,
        timestamp: ts,
        message: `Attempt ${i} — ❌ Authentication Failed (Event ID 4625)`,
        status: 'failed',
      });
      const evt: SecurityEvent = {
        id: `sim-fail-${Date.now()}-${i}`,
        timestamp: ts,
        eventId: 4625,
        account: 'test-user',
        sourceIp: '192.168.1.24',
        host: 'SENTINEL-TEST-VM',
        status: 'failed',
      };
      newEvents.push(evt);
      dispatch({ type: 'ADD_EVENT', payload: evt });
      dispatch({ type: 'INCREMENT_FAILED_LOGINS' });
    }

    await delay(600);
    addEvent({
      id: 'threshold',
      timestamp: getNow(),
      message: `⚠ THRESHOLD REACHED — ${threshold} failed attempts detected within 10 minutes`,
      status: 'alert',
    });

    // Pipeline animation
    const steps = ['EVENT', 'KQL RULE', 'ALERT', 'INCIDENT'];
    for (let i = 0; i < steps.length; i++) {
      await delay(500);
      setPipelineStep(i);
      addEvent({
        id: `pipeline-${i}`,
        timestamp: getNow(),
        message: `▶ ${steps[i]} ${i < steps.length - 1 ? '→' : '— Created!'}`,
        status: 'detection',
      });
    }

    await delay(400);

    // Create incident
    const incId = `INC-${String(state.incidents.length + 1).padStart(3, '0')}`;
    const incident: Incident = {
      id: incId,
      title: 'Repeated Failed Authentication',
      severity: 'high',
      account: 'test-user',
      sourceIp: '192.168.1.24',
      host: 'SENTINEL-TEST-VM',
      detectionRule: 'Repeated Failed Authentication',
      timestamp: 'Just now',
      failedAttempts: threshold,
      status: 'open',
      description: `Multiple authentication failures (${threshold}) were detected from the same source IP within the configured threshold window. This pattern indicates potential brute-force activity.`,
      events: newEvents,
      timeWindow: '10 minutes',
    };

    addIncident(incident);
    dispatch({ type: 'INCREMENT_DETECTIONS' });
    setCreatedIncidentId(incId);
    dispatch({ type: 'SELECT_INCIDENT', payload: incId });

    addNotification({
      id: `notif-sim-${Date.now()}`,
      title: '🚨 New Security Incident',
      message: `Repeated Failed Authentication — ${threshold} attempts detected`,
      severity: 'high',
      timestamp: 'Just now',
      read: false,
      incidentId: incId,
    });

    setIsRunning(false);
  }, [state.currentThreshold, state.incidents.length, addEvent, addIncident, addNotification, dispatch]);

  // ===== FAILED → SUCCESSFUL =====
  const simulateFailedThenSuccess = useCallback(async () => {
    setIsRunning(true);
    setSimulationType('failed-then-success');
    setEvents([]);
    setCreatedIncidentId(null);
    setPipelineStep(-1);

    addEvent({ id: 'start', timestamp: getNow(), message: 'CORRELATION SIMULATION STARTED', status: 'info' });
    await delay(600);

    const failedEvents: SecurityEvent[] = [];

    for (let i = 1; i <= 3; i++) {
      await delay(700);
      const ts = getNow();
      addEvent({
        id: `fail-${i}`,
        timestamp: ts,
        message: `Attempt ${i} — ❌ Authentication Failed (Event ID 4625)`,
        status: 'failed',
      });
      const evt: SecurityEvent = {
        id: `sim-fc-${Date.now()}-${i}`,
        timestamp: ts,
        eventId: 4625,
        account: 'test-user',
        sourceIp: '192.168.1.24',
        host: 'SENTINEL-TEST-VM',
        status: 'failed',
      };
      failedEvents.push(evt);
      dispatch({ type: 'ADD_EVENT', payload: evt });
      dispatch({ type: 'INCREMENT_FAILED_LOGINS' });
    }

    await delay(800);
    const successTs = getNow();
    addEvent({
      id: 'success',
      timestamp: successTs,
      message: 'Attempt 4 — ✅ Authentication Successful (Event ID 4624)',
      status: 'success',
    });
    const successEvt: SecurityEvent = {
      id: `sim-sc-${Date.now()}`,
      timestamp: successTs,
      eventId: 4624,
      account: 'test-user',
      sourceIp: '192.168.1.24',
      host: 'SENTINEL-TEST-VM',
      status: 'success',
    };
    dispatch({ type: 'ADD_EVENT', payload: successEvt });
    dispatch({ type: 'INCREMENT_SUCCESSFUL_LOGINS' });

    await delay(600);
    addEvent({
      id: 'corr',
      timestamp: getNow(),
      message: '🔗 CORRELATION DETECTED — Repeated failures followed by successful login',
      status: 'alert',
    });

    // Pipeline
    const steps = ['EVENT', 'KQL RULE', 'ALERT', 'INCIDENT'];
    for (let i = 0; i < steps.length; i++) {
      await delay(500);
      setPipelineStep(i);
      addEvent({
        id: `pipeline-${i}`,
        timestamp: getNow(),
        message: `▶ ${steps[i]} ${i < steps.length - 1 ? '→' : '— Created!'}`,
        status: 'detection',
      });
    }

    await delay(400);

    const incId = `INC-${String(state.incidents.length + 1).padStart(3, '0')}`;
    const incident: Incident = {
      id: incId,
      title: 'Suspicious Authentication Sequence',
      severity: 'high',
      account: 'test-user',
      sourceIp: '192.168.1.24',
      host: 'SENTINEL-TEST-VM',
      detectionRule: 'Failed Authentication Followed By Successful Login',
      timestamp: 'Just now',
      failedAttempts: 3,
      successfulLogin: true,
      status: 'open',
      description:
        'Repeated authentication failures followed by a successful login were detected. This pattern may indicate a successful credential compromise.',
      events: [...failedEvents, successEvt],
      timeWindow: '15 minutes',
    };

    addIncident(incident);
    dispatch({ type: 'INCREMENT_DETECTIONS' });
    setCreatedIncidentId(incId);
    dispatch({ type: 'SELECT_INCIDENT', payload: incId });

    addNotification({
      id: `notif-sim-${Date.now()}`,
      title: '🚨 New Security Incident',
      message: 'Suspicious Authentication Sequence — Failed → Successful',
      severity: 'high',
      timestamp: 'Just now',
      read: false,
      incidentId: incId,
    });

    setIsRunning(false);
  }, [state.incidents.length, addEvent, addIncident, addNotification, dispatch]);

  // ===== NORMAL ACTIVITY =====
  const simulateNormal = useCallback(async () => {
    setIsRunning(true);
    setSimulationType('normal');
    setEvents([]);
    setCreatedIncidentId(null);
    setPipelineStep(-1);

    addEvent({ id: 'start', timestamp: getNow(), message: 'NORMAL ACTIVITY SIMULATION', status: 'info' });
    await delay(700);

    addEvent({
      id: 'n1',
      timestamp: getNow(),
      message: 'Login attempt — ✅ Successful (Event ID 4624)',
      status: 'success',
    });
    dispatch({ type: 'INCREMENT_SUCCESSFUL_LOGINS' });

    await delay(700);
    addEvent({
      id: 'n2',
      timestamp: getNow(),
      message: 'Login attempt — ✅ Successful (Event ID 4624)',
      status: 'success',
    });
    dispatch({ type: 'INCREMENT_SUCCESSFUL_LOGINS' });

    await delay(700);
    addEvent({
      id: 'n3',
      timestamp: getNow(),
      message: 'Login attempt — ⚠ Failed (wrong password) (Event ID 4625)',
      status: 'failed',
    });
    dispatch({ type: 'INCREMENT_FAILED_LOGINS' });

    await delay(700);
    addEvent({
      id: 'n4',
      timestamp: getNow(),
      message: 'Login attempt — ✅ Successful (Event ID 4624)',
      status: 'success',
    });
    dispatch({ type: 'INCREMENT_SUCCESSFUL_LOGINS' });

    await delay(800);
    addEvent({
      id: 'result',
      timestamp: getNow(),
      message: '✅ NO INCIDENT CREATED — Activity remained below the configured detection threshold.',
      status: 'info',
    });

    await delay(400);
    addEvent({
      id: 'explain',
      timestamp: getNow(),
      message: 'ℹ A single failed login is common (e.g., password typo) and does not trigger an alert. This is why threshold tuning matters.',
      status: 'info',
    });

    setIsRunning(false);
  }, [addEvent, dispatch]);

  const pipelineLabels = ['EVENT', 'KQL RULE', 'ALERT', 'INCIDENT'];

  return (
    <div>
      <Topbar title="Attack Simulation" subtitle="Generate controlled authentication events and observe how Sentinel detects suspicious activity" />

      <div className="p-6 space-y-6">
        {/* Why this matters */}
        <div className="glass-card-static p-4 animate-fade-in-up" style={{ borderColor: 'rgba(139, 92, 246, 0.2)' }}>
          <p className="text-xs text-navy-300">
            <span className="text-cyber-purple font-semibold">Why this matters:</span> Live simulation demonstrates how KQL analytics rules detect attack patterns in real time and generate incidents for investigation.
          </p>
        </div>

        {/* Simulation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Failed Login */}
          <button
            onClick={simulateFailedLogin}
            disabled={isRunning}
            className={`glass-card p-6 text-left transition-all hover:border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed group animate-fade-in-up ${
              isRunning && simulationType === 'failed-login' ? 'border-red-500 ring-1 ring-red-500' : ''
            }`}
            style={{ animationDelay: '100ms' }}
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
              <ShieldAlert size={24} className="text-red-400" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Simulate Failed Login Attack</h3>
            <p className="text-[0.7rem] text-navy-400">
              Generate {state.currentThreshold} consecutive failed login attempts to trigger the brute-force detection rule.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-red-400 font-medium">
              <Play size={13} /> {isRunning && simulationType === 'failed-login' ? 'Simulating...' : 'Run Simulation'}
            </div>
          </button>

          {/* Failed → Success */}
          <button
            onClick={simulateFailedThenSuccess}
            disabled={isRunning}
            className={`glass-card p-6 text-left transition-all hover:border-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed group animate-fade-in-up ${
              isRunning && simulationType === 'failed-then-success' ? 'border-amber-500 ring-1 ring-amber-500' : ''
            }`}
            style={{ animationDelay: '200ms' }}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
              <AlertTriangle size={24} className="text-amber-400" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Simulate Failed → Successful Login</h3>
            <p className="text-[0.7rem] text-navy-400">
              Generate failed attempts followed by a successful login to trigger the credential compromise detection.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
              <Play size={13} /> {isRunning && simulationType === 'failed-then-success' ? 'Simulating...' : 'Run Simulation'}
            </div>
          </button>

          {/* Normal */}
          <button
            onClick={simulateNormal}
            disabled={isRunning}
            className={`glass-card p-6 text-left transition-all hover:border-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed group animate-fade-in-up ${
              isRunning && simulationType === 'normal-activity' ? 'border-emerald-500 ring-1 ring-emerald-500' : ''
            }`}
            style={{ animationDelay: '300ms' }}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
              <UserCheck size={24} className="text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Simulate Normal User Activity</h3>
            <p className="text-[0.7rem] text-navy-400">
              Generate typical user login behavior to demonstrate that normal activity does not trigger false positives.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <Play size={13} /> {isRunning && simulationType === 'normal-activity' ? 'Simulating...' : 'Run Simulation'}
            </div>
          </button>
        </div>

        {/* Event Stream */}
        {events.length > 0 && (
          <div className="glass-card p-5 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Event Stream</h3>
                <p className="text-[0.7rem] text-navy-400 mt-0.5">Real-time simulation output</p>
              </div>
              {isRunning && (
                <span className="flex items-center gap-2 text-xs text-cyber-cyan">
                  <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
                  Processing...
                </span>
              )}
            </div>

            <div ref={eventListRef} className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {events.map((evt) => (
                <div key={evt.id} className={`event-stream-item ${evt.status}`}>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {evt.status === 'failed' && <XCircle size={16} className="text-red-400" />}
                      {evt.status === 'success' && <CheckCircle size={16} className="text-emerald-400" />}
                      {evt.status === 'info' && <Zap size={16} className="text-cyber-blue" />}
                      {evt.status === 'alert' && <AlertTriangle size={16} className="text-amber-400" />}
                      {evt.status === 'detection' && <ChevronDown size={16} className="text-purple-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-white">{evt.message}</div>
                    </div>
                    <span className="text-[0.65rem] text-navy-500 shrink-0 font-mono">{evt.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pipeline Visualization */}
            {pipelineStep >= 0 && (
              <div className="mt-5 pt-4 border-t border-navy-800/50">
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {pipelineLabels.map((label, i) => (
                    <div key={label} className="flex items-center gap-3">
                      <div
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          i <= pipelineStep
                            ? 'bg-cyber-blue/15 text-cyber-blue border border-cyber-blue/30'
                            : 'bg-navy-800/50 text-navy-500 border border-navy-700/30'
                        }`}
                      >
                        {label}
                      </div>
                      {i < pipelineLabels.length - 1 && (
                        <ArrowRight
                          size={14}
                          className={i < pipelineStep ? 'text-cyber-blue' : 'text-navy-600'}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Created Incident Card */}
        {createdIncidentId && !isRunning && (
          <div
            className="glass-card p-6 animate-fade-in-up animate-incident-pulse"
            style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🚨</span>
              <div>
                <h3 className="text-base font-bold text-white">INCIDENT CREATED</h3>
                <p className="text-xs text-navy-400">{createdIncidentId}</p>
              </div>
              <span className="badge badge-high ml-auto">HIGH</span>
            </div>

            {(() => {
              const inc = state.incidents.find((i) => i.id === createdIncidentId);
              if (!inc) return null;
              return (
                <>
                  <h4 className="text-sm font-semibold text-white mb-3">{inc.title}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div>
                      <div className="text-[0.65rem] text-navy-500 uppercase tracking-wider mb-0.5">Account</div>
                      <div className="text-xs font-mono text-white">{inc.account}</div>
                    </div>
                    <div>
                      <div className="text-[0.65rem] text-navy-500 uppercase tracking-wider mb-0.5">Source IP</div>
                      <div className="text-xs font-mono text-white">{inc.sourceIp}</div>
                    </div>
                    <div>
                      <div className="text-[0.65rem] text-navy-500 uppercase tracking-wider mb-0.5">Failed Attempts</div>
                      <div className="text-xs font-mono text-white">{inc.failedAttempts}</div>
                    </div>
                    <div>
                      <div className="text-[0.65rem] text-navy-500 uppercase tracking-wider mb-0.5">
                        {inc.successfulLogin ? 'Successful Login' : 'Status'}
                      </div>
                      <div className="text-xs font-mono text-white">
                        {inc.successfulLogin ? 'Detected' : 'OPEN'}
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      dispatch({ type: 'SELECT_INCIDENT', payload: createdIncidentId });
                      navigate('/investigation');
                    }}
                  >
                    <Zap size={15} />
                    Investigate Incident
                  </button>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

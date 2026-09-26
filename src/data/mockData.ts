import type { SecurityEvent, Incident, DetectionRule, ChartDataPoint, Notification } from '../types';

// ===== Mock Security Events =====
export const initialEvents: SecurityEvent[] = [
  {
    id: 'evt-001',
    timestamp: '2026-09-26T10:15:02',
    eventId: 4625,
    account: 'admin',
    sourceIp: '192.168.1.24',
    host: 'SENTINEL-TEST-VM',
    status: 'failed',
    description: 'Authentication failed for admin account',
  },
  {
    id: 'evt-002',
    timestamp: '2026-09-26T10:15:05',
    eventId: 4625,
    account: 'admin',
    sourceIp: '192.168.1.24',
    host: 'SENTINEL-TEST-VM',
    status: 'failed',
    description: 'Authentication failed for admin account',
  },
  {
    id: 'evt-003',
    timestamp: '2026-09-26T10:15:08',
    eventId: 4625,
    account: 'admin',
    sourceIp: '192.168.1.24',
    host: 'SENTINEL-TEST-VM',
    status: 'failed',
    description: 'Authentication failed for admin account',
  },
  {
    id: 'evt-004',
    timestamp: '2026-09-26T10:15:11',
    eventId: 4625,
    account: 'admin',
    sourceIp: '192.168.1.24',
    host: 'SENTINEL-TEST-VM',
    status: 'failed',
    description: 'Authentication failed for admin account',
  },
  {
    id: 'evt-005',
    timestamp: '2026-09-26T10:15:14',
    eventId: 4625,
    account: 'admin',
    sourceIp: '192.168.1.24',
    host: 'SENTINEL-TEST-VM',
    status: 'failed',
    description: 'Authentication failed for admin account',
  },
  {
    id: 'evt-006',
    timestamp: '2026-09-26T10:20:30',
    eventId: 4625,
    account: 'test-user',
    sourceIp: '192.168.1.18',
    host: 'SENTINEL-TEST-VM',
    status: 'failed',
    description: 'Authentication failed for test-user',
  },
  {
    id: 'evt-007',
    timestamp: '2026-09-26T10:20:35',
    eventId: 4625,
    account: 'test-user',
    sourceIp: '192.168.1.18',
    host: 'SENTINEL-TEST-VM',
    status: 'failed',
    description: 'Authentication failed for test-user',
  },
  {
    id: 'evt-008',
    timestamp: '2026-09-26T10:20:40',
    eventId: 4625,
    account: 'test-user',
    sourceIp: '192.168.1.18',
    host: 'SENTINEL-TEST-VM',
    status: 'failed',
    description: 'Authentication failed for test-user',
  },
  {
    id: 'evt-009',
    timestamp: '2026-09-26T10:20:50',
    eventId: 4624,
    account: 'test-user',
    sourceIp: '192.168.1.18',
    host: 'SENTINEL-TEST-VM',
    status: 'success',
    description: 'Successful authentication after failures',
  },
  {
    id: 'evt-010',
    timestamp: '2026-09-26T10:30:00',
    eventId: 4624,
    account: 'user01',
    sourceIp: '192.168.1.32',
    host: 'SENTINEL-TEST-VM',
    status: 'success',
    description: 'Normal successful authentication',
  },
  {
    id: 'evt-011',
    timestamp: '2026-09-26T10:35:12',
    eventId: 4625,
    account: 'user01',
    sourceIp: '192.168.1.32',
    host: 'SENTINEL-TEST-VM',
    status: 'failed',
    description: 'Single failed authentication - possible typo',
  },
  {
    id: 'evt-012',
    timestamp: '2026-09-26T10:35:20',
    eventId: 4624,
    account: 'user01',
    sourceIp: '192.168.1.32',
    host: 'SENTINEL-TEST-VM',
    status: 'success',
    description: 'Successful authentication after single failure',
  },
];

// ===== Mock Incidents =====
export const initialIncidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'Repeated Failed Authentication',
    severity: 'critical',
    account: 'admin',
    sourceIp: '192.168.1.24',
    host: 'SENTINEL-TEST-VM',
    detectionRule: 'Repeated Failed Authentication',
    timestamp: '2 min ago',
    failedAttempts: 5,
    status: 'open',
    description:
      'Multiple authentication failures were detected from the same source IP within the configured threshold window. This pattern typically indicates a brute-force or credential-stuffing attack.',
    events: [
      {
        id: 'evt-001',
        timestamp: '10:31:02',
        eventId: 4625,
        account: 'admin',
        sourceIp: '192.168.1.24',
        host: 'SENTINEL-TEST-VM',
        status: 'failed',
      },
      {
        id: 'evt-002',
        timestamp: '10:31:05',
        eventId: 4625,
        account: 'admin',
        sourceIp: '192.168.1.24',
        host: 'SENTINEL-TEST-VM',
        status: 'failed',
      },
      {
        id: 'evt-003',
        timestamp: '10:31:08',
        eventId: 4625,
        account: 'admin',
        sourceIp: '192.168.1.24',
        host: 'SENTINEL-TEST-VM',
        status: 'failed',
      },
      {
        id: 'evt-004',
        timestamp: '10:31:11',
        eventId: 4625,
        account: 'admin',
        sourceIp: '192.168.1.24',
        host: 'SENTINEL-TEST-VM',
        status: 'failed',
      },
      {
        id: 'evt-005',
        timestamp: '10:31:14',
        eventId: 4625,
        account: 'admin',
        sourceIp: '192.168.1.24',
        host: 'SENTINEL-TEST-VM',
        status: 'failed',
      },
    ],
    timeWindow: '10 minutes',
  },
  {
    id: 'INC-002',
    title: 'Failed → Successful Authentication',
    severity: 'high',
    account: 'test-user',
    sourceIp: '192.168.1.18',
    host: 'SENTINEL-TEST-VM',
    detectionRule: 'Failed Authentication Followed By Successful Login',
    timestamp: '8 min ago',
    failedAttempts: 3,
    successfulLogin: true,
    status: 'investigating',
    description:
      'Repeated authentication failures followed by a successful login were detected. This pattern may indicate a successful brute-force attack where the attacker eventually guessed the correct credentials.',
    events: [
      {
        id: 'evt-006',
        timestamp: '10:20:30',
        eventId: 4625,
        account: 'test-user',
        sourceIp: '192.168.1.18',
        host: 'SENTINEL-TEST-VM',
        status: 'failed',
      },
      {
        id: 'evt-007',
        timestamp: '10:20:35',
        eventId: 4625,
        account: 'test-user',
        sourceIp: '192.168.1.18',
        host: 'SENTINEL-TEST-VM',
        status: 'failed',
      },
      {
        id: 'evt-008',
        timestamp: '10:20:40',
        eventId: 4625,
        account: 'test-user',
        sourceIp: '192.168.1.18',
        host: 'SENTINEL-TEST-VM',
        status: 'failed',
      },
      {
        id: 'evt-009',
        timestamp: '10:20:50',
        eventId: 4624,
        account: 'test-user',
        sourceIp: '192.168.1.18',
        host: 'SENTINEL-TEST-VM',
        status: 'success',
      },
    ],
    timeWindow: '15 minutes',
  },
  {
    id: 'INC-003',
    title: 'Multiple Authentication Failures',
    severity: 'medium',
    account: 'user01',
    sourceIp: '192.168.1.32',
    host: 'SENTINEL-TEST-VM',
    detectionRule: 'Repeated Failed Authentication',
    timestamp: '20 min ago',
    failedAttempts: 3,
    status: 'resolved',
    description:
      'Authentication failures from user01 were detected but remained below the incident threshold after tuning. Resolved as expected user behavior.',
    events: [
      {
        id: 'evt-010',
        timestamp: '10:30:00',
        eventId: 4624,
        account: 'user01',
        sourceIp: '192.168.1.32',
        host: 'SENTINEL-TEST-VM',
        status: 'success',
      },
      {
        id: 'evt-011',
        timestamp: '10:35:12',
        eventId: 4625,
        account: 'user01',
        sourceIp: '192.168.1.32',
        host: 'SENTINEL-TEST-VM',
        status: 'failed',
      },
      {
        id: 'evt-012',
        timestamp: '10:35:20',
        eventId: 4624,
        account: 'user01',
        sourceIp: '192.168.1.32',
        host: 'SENTINEL-TEST-VM',
        status: 'success',
      },
    ],
    timeWindow: '10 minutes',
  },
];

// ===== Detection Rules =====
export const initialRules: DetectionRule[] = [
  {
    id: 'RULE-01',
    name: 'Repeated Failed Authentication',
    description:
      'Detects when multiple failed authentication attempts occur from the same source within a configured time window, indicating potential brute-force activity.',
    severity: 'medium',
    status: 'active',
    eventIds: [4625],
    threshold: 5,
    timeWindow: '10 min',
    condition: '5+ failed authentication attempts within 10 minutes',
    kqlQuery: `SecurityEvent
| where EventID == 4625
| where TimeGenerated > ago(10m)
| summarize
    FailedAttempts = count(),
    FirstAttempt = min(TimeGenerated),
    LastAttempt = max(TimeGenerated),
    Accounts = make_set(Account)
    by IpAddress, Account, Computer
| where FailedAttempts >= 5
| project
    IpAddress,
    Account,
    Computer,
    FailedAttempts,
    FirstAttempt,
    LastAttempt,
    TimeSpan = LastAttempt - FirstAttempt`,
  },
  {
    id: 'RULE-02',
    name: 'Failed Authentication Followed By Successful Login',
    description:
      'Detects when a series of failed authentication attempts is followed by a successful login, potentially indicating a successful credential compromise.',
    severity: 'high',
    status: 'active',
    eventIds: [4625, 4624],
    threshold: 3,
    timeWindow: '15 min',
    condition: '3+ failures followed by successful login within 15 minutes',
    kqlQuery: `let FailedLogins = SecurityEvent
| where EventID == 4625
| where TimeGenerated > ago(15m)
| summarize
    FailedCount = count(),
    FailedTimes = make_list(TimeGenerated)
    by IpAddress, Account, Computer;

let SuccessfulLogins = SecurityEvent
| where EventID == 4624
| where TimeGenerated > ago(15m)
| project
    SuccessTime = TimeGenerated,
    IpAddress, Account, Computer;

FailedLogins
| join kind=inner SuccessfulLogins
    on IpAddress, Account, Computer
| where FailedCount >= 3
| project
    IpAddress, Account, Computer,
    FailedCount, SuccessTime`,
  },
];

// ===== Chart Data =====
export const initialChartData: ChartDataPoint[] = [
  { time: '09:00', failed: 2, successful: 45, suspicious: 0 },
  { time: '09:30', failed: 1, successful: 52, suspicious: 0 },
  { time: '10:00', failed: 3, successful: 48, suspicious: 1 },
  { time: '10:15', failed: 8, successful: 40, suspicious: 2 },
  { time: '10:30', failed: 12, successful: 35, suspicious: 3 },
  { time: '10:45', failed: 5, successful: 50, suspicious: 1 },
  { time: '11:00', failed: 3, successful: 55, suspicious: 0 },
  { time: '11:30', failed: 2, successful: 60, suspicious: 0 },
  { time: '12:00', failed: 4, successful: 58, suspicious: 1 },
  { time: '12:30', failed: 1, successful: 62, suspicious: 0 },
  { time: '13:00', failed: 1, successful: 50, suspicious: 0 },
];

// ===== Notifications =====
export const initialNotifications: Notification[] = [
  {
    id: 'notif-001',
    title: 'Security Incident Created',
    message: 'Repeated Failed Authentication - admin account',
    severity: 'critical',
    timestamp: '2 min ago',
    read: false,
    incidentId: 'INC-001',
  },
  {
    id: 'notif-002',
    title: 'Detection Rule Triggered',
    message: 'Failed → Successful Login pattern detected',
    severity: 'high',
    timestamp: '8 min ago',
    read: false,
    incidentId: 'INC-002',
  },
  {
    id: 'notif-003',
    title: 'Incident Resolved',
    message: 'INC-003 resolved as expected behavior',
    severity: 'medium',
    timestamp: '20 min ago',
    read: true,
    incidentId: 'INC-003',
  },
];

// ===== Architecture Nodes =====
export const architectureNodes = [
  {
    id: 'windows-vm',
    title: 'Windows Test VM',
    description: 'Generates authentication events',
    details: [
      'Event ID 4625 — Failed Login',
      'Event ID 4624 — Successful Login',
      'Windows Security Event Log',
      'Generates real-time authentication telemetry',
    ],
    icon: 'Monitor',
    color: '#3b82f6',
    whyItMatters:
      'The Windows VM is the source of all authentication events. Without proper event logging enabled, no detection is possible.',
  },
  {
    id: 'azure-monitor',
    title: 'Azure Monitor Agent',
    description: 'Collects Windows security events',
    details: [
      'Installed on Windows VM',
      'Collects Security Event Logs',
      'Forwards events to Log Analytics',
      'Data Collection Rules (DCR) configuration',
    ],
    icon: 'Radio',
    color: '#0ea5e9',
    whyItMatters:
      'The Azure Monitor Agent bridges on-premises/cloud VMs with cloud-based analytics. It ensures security events are reliably transmitted for analysis.',
  },
  {
    id: 'log-analytics',
    title: 'Log Analytics Workspace',
    description: 'Stores and indexes SecurityEvent data',
    details: [
      'Central log repository',
      'SecurityEvent table',
      'KQL query engine',
      'Retention policies & data indexing',
    ],
    icon: 'Database',
    color: '#6366f1',
    whyItMatters:
      'Log Analytics provides the queryable data store. All KQL detection rules run against this data. It enables historical analysis and threat hunting.',
  },
  {
    id: 'sentinel',
    title: 'Microsoft Sentinel',
    description: 'Centralized security monitoring (SIEM)',
    details: [
      'Cloud-native SIEM',
      'Analytics rules engine',
      'Incident management',
      'Investigation workbooks',
    ],
    icon: 'Shield',
    color: '#8b5cf6',
    whyItMatters:
      'Microsoft Sentinel is the core SIEM that orchestrates detection, alerting, and incident management. It transforms raw events into actionable security insights.',
  },
  {
    id: 'kql-rules',
    title: 'KQL Analytics Rules',
    description: 'Custom detection logic using Kusto Query Language',
    details: [
      'Rule 1: Repeated Failed Login (EventID 4625)',
      'Rule 2: Failed → Successful Login (4625 + 4624)',
      'Configurable thresholds and time windows',
      'Scheduled execution frequency',
    ],
    icon: 'Code',
    color: '#ec4899',
    whyItMatters:
      'KQL rules are the detection brain. They define what patterns to look for and when to raise alerts. Proper rule design directly impacts detection accuracy.',
  },
  {
    id: 'alerts',
    title: 'Alerts',
    description: 'Generated when KQL rules match event patterns',
    details: [
      'Triggered by analytics rule matches',
      'Contain matched event details',
      'Assigned severity levels',
      'Can be grouped into incidents',
    ],
    icon: 'Bell',
    color: '#f59e0b',
    whyItMatters:
      'Alerts are the first signal that something suspicious is happening. They bridge detection logic and human response.',
  },
  {
    id: 'incidents',
    title: 'Incidents',
    description: 'Correlated alerts requiring investigation',
    details: [
      'Group related alerts',
      'Track investigation status',
      'Assign to analysts',
      'Document findings and resolution',
    ],
    icon: 'AlertTriangle',
    color: '#ef4444',
    whyItMatters:
      'Incidents provide the structured workflow for response. They ensure no alert is missed and every detection receives appropriate investigation.',
  },
  {
    id: 'investigation',
    title: 'Investigation',
    description: 'Analyze incident details and determine response',
    details: [
      'Review event timeline',
      'Identify affected accounts',
      'Assess source IP behavior',
      'Determine if threat is real or false positive',
    ],
    icon: 'Search',
    color: '#14b8a6',
    whyItMatters:
      'Investigation is where analysts determine if a detection represents a real threat. It requires understanding the full context of the events.',
  },
  {
    id: 'rule-tuning',
    title: 'Rule Tuning',
    description: 'Adjust detection thresholds to reduce false positives',
    details: [
      'Analyze false positive rate',
      'Adjust thresholds (e.g., 3 → 5 failures)',
      'Modify time windows',
      'Balance sensitivity vs. noise',
    ],
    icon: 'Sliders',
    color: '#f97316',
    whyItMatters:
      'Rule tuning is essential for operational efficiency. Without it, SOC teams are overwhelmed by false positives and may miss real threats.',
  },
  {
    id: 'improved-security',
    title: 'Improved Security',
    description: 'Reduced false positives and better detection accuracy',
    details: [
      'Lower false positive rate',
      'Higher true positive rate',
      'Faster incident response',
      'Continuous improvement cycle',
    ],
    icon: 'CheckCircle',
    color: '#22c55e',
    whyItMatters:
      'The ultimate goal: a security monitoring system that accurately detects real threats while minimizing alert fatigue for the security team.',
  },
];

// ===== Tuning Simulation Data =====
export function getTuningMetrics(threshold: number) {
  const baseAlerts = 20;
  const baseFP = 15;

  // More realistic tuning curve
  const alertMultiplier = Math.max(0.2, 1.5 - threshold * 0.15);
  const fpMultiplier = Math.max(0.05, 1.8 - threshold * 0.22);

  const totalAlerts = Math.round(baseAlerts * alertMultiplier);
  const falsePositives = Math.round(baseFP * fpMultiplier);
  const truePositives = Math.max(1, totalAlerts - falsePositives);

  let sensitivity: 'high' | 'balanced' | 'low';
  if (threshold <= 3) sensitivity = 'high';
  else if (threshold <= 6) sensitivity = 'balanced';
  else sensitivity = 'low';

  return { threshold, totalAlerts, falsePositives, truePositives, sensitivity };
}

// ===== Security Event Types =====
export type EventStatus = 'failed' | 'success' | 'suspicious';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'open' | 'investigating' | 'resolved';
export type SimulationType = 'failed-login' | 'failed-then-success' | 'normal-activity';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  eventId: number; // 4625 = failed, 4624 = success
  account: string;
  sourceIp: string;
  host: string;
  status: EventStatus;
  description?: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  account: string;
  sourceIp: string;
  host: string;
  detectionRule: string;
  timestamp: string;
  failedAttempts: number;
  successfulLogin?: boolean;
  status: IncidentStatus;
  description: string;
  events: SecurityEvent[];
  timeWindow?: string;
}

export interface DetectionRule {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  status: 'active' | 'inactive';
  eventIds: number[];
  threshold: number;
  timeWindow: string;
  kqlQuery: string;
  condition: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  severity: Severity;
  timestamp: string;
  read: boolean;
  incidentId?: string;
}

export interface ChartDataPoint {
  time: string;
  failed: number;
  successful: number;
  suspicious: number;
}

export interface TuningMetrics {
  threshold: number;
  totalAlerts: number;
  falsePositives: number;
  truePositives: number;
  sensitivity: 'high' | 'balanced' | 'low';
}

export interface SimulationStep {
  id: string;
  timestamp: string;
  message: string;
  status: EventStatus | 'info' | 'alert' | 'detection';
  delay: number;
}

export interface ArchitectureNode {
  id: string;
  title: string;
  description: string;
  details: string[];
  icon: string;
  color: string;
}

// ===== App State =====
export interface AppState {
  failedLoginCount: number;
  successfulLoginCount: number;
  incidentCount: number;
  activeIncidents: Incident[];
  detectionsTriggered: number;
  falsePositiveRate: number;
  currentThreshold: number;
  events: SecurityEvent[];
  incidents: Incident[];
  notifications: Notification[];
  rules: DetectionRule[];
  chartData: ChartDataPoint[];
  isSimulating: boolean;
  selectedIncidentId: string | null;
}

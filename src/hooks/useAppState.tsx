import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import {
  type AppState,
  type Incident,
  type SecurityEvent,
  type Notification,
  type ChartDataPoint,
} from '../types';
import {
  initialEvents,
  initialIncidents,
  initialRules,
  initialChartData,
  initialNotifications,
} from '../data/mockData';

// ===== Actions =====
type Action =
  | { type: 'ADD_INCIDENT'; payload: Incident }
  | { type: 'UPDATE_INCIDENT'; payload: { id: string; status: Incident['status'] } }
  | { type: 'ADD_EVENT'; payload: SecurityEvent }
  | { type: 'ADD_EVENTS'; payload: SecurityEvent[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'INCREMENT_FAILED_LOGINS'; payload?: number }
  | { type: 'INCREMENT_SUCCESSFUL_LOGINS'; payload?: number }
  | { type: 'INCREMENT_DETECTIONS' }
  | { type: 'SET_FALSE_POSITIVE_RATE'; payload: number }
  | { type: 'SET_THRESHOLD'; payload: number }
  | { type: 'SET_SIMULATING'; payload: boolean }
  | { type: 'SELECT_INCIDENT'; payload: string | null }
  | { type: 'ADD_CHART_POINT'; payload: ChartDataPoint }
  | { type: 'RESET_DEMO' };

// ===== Initial State =====
const getInitialState = (): AppState => ({
  failedLoginCount: 42,
  successfulLoginCount: 156,
  incidentCount: 3,
  activeIncidents: initialIncidents.filter((i) => i.status !== 'resolved'),
  detectionsTriggered: 8,
  falsePositiveRate: 12,
  currentThreshold: 5,
  events: [...initialEvents],
  incidents: [...initialIncidents],
  notifications: [...initialNotifications],
  rules: [...initialRules],
  chartData: [...initialChartData],
  isSimulating: false,
  selectedIncidentId: null,
});

// ===== Reducer =====
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_INCIDENT': {
      const newIncidents = [action.payload, ...state.incidents];
      return {
        ...state,
        incidents: newIncidents,
        activeIncidents: newIncidents.filter((i) => i.status !== 'resolved'),
        incidentCount: newIncidents.length,
      };
    }
    case 'UPDATE_INCIDENT': {
      const updated = state.incidents.map((inc) =>
        inc.id === action.payload.id ? { ...inc, status: action.payload.status } : inc,
      );
      return {
        ...state,
        incidents: updated,
        activeIncidents: updated.filter((i) => i.status !== 'resolved'),
      };
    }
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'ADD_EVENTS':
      return { ...state, events: [...state.events, ...action.payload] };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n,
        ),
      };
    case 'INCREMENT_FAILED_LOGINS':
      return { ...state, failedLoginCount: state.failedLoginCount + (action.payload || 1) };
    case 'INCREMENT_SUCCESSFUL_LOGINS':
      return { ...state, successfulLoginCount: state.successfulLoginCount + (action.payload || 1) };
    case 'INCREMENT_DETECTIONS':
      return { ...state, detectionsTriggered: state.detectionsTriggered + 1 };
    case 'SET_FALSE_POSITIVE_RATE':
      return { ...state, falsePositiveRate: action.payload };
    case 'SET_THRESHOLD':
      return { ...state, currentThreshold: action.payload };
    case 'SET_SIMULATING':
      return { ...state, isSimulating: action.payload };
    case 'SELECT_INCIDENT':
      return { ...state, selectedIncidentId: action.payload };
    case 'ADD_CHART_POINT':
      return { ...state, chartData: [...state.chartData, action.payload] };
    case 'RESET_DEMO':
      return getInitialState();
    default:
      return state;
  }
}

// ===== Context =====
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addIncident: (incident: Incident) => void;
  updateIncidentStatus: (id: string, status: Incident['status']) => void;
  addNotification: (notification: Notification) => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  const addIncident = useCallback(
    (incident: Incident) => {
      dispatch({ type: 'ADD_INCIDENT', payload: incident });
    },
    [dispatch],
  );

  const updateIncidentStatus = useCallback(
    (id: string, status: Incident['status']) => {
      dispatch({ type: 'UPDATE_INCIDENT', payload: { id, status } });
    },
    [dispatch],
  );

  const addNotification = useCallback(
    (notification: Notification) => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    },
    [dispatch],
  );

  const resetDemo = useCallback(() => {
    dispatch({ type: 'RESET_DEMO' });
  }, [dispatch]);

  return (
    <AppContext.Provider
      value={{ state, dispatch, addIncident, updateIncidentStatus, addNotification, resetDemo }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}

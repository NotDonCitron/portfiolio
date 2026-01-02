export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM';

export interface Problem {
  id: string;
  title: string;
  response: string;
  reason: string;
  severity: Severity;
  tags: string[];
}

export interface Stat {
  value: string;
  label: string;
}

export interface Source {
  badge: string;
  title: string;
  description: string;
}
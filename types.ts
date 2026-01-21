
export type StatusLevel = 'On Track' | 'At Risk' | 'Off Track';

export interface ProjectHealth {
  schedule: StatusLevel;
  scope: StatusLevel;
  quality: StatusLevel;
  resource: StatusLevel;
}

export interface RiskItem {
  id: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export interface ActionItem {
  id: string;
  task: string;
  owner: string;
  dueDate: string;
  status: 'Open' | 'Closed' | 'Blocked';
}

export interface WorkloadItem {
  owner: string;
  loadPercentage: number;
  taskCount: number;
}

export interface Dependency {
  id: string;
  dependency: string;
  impact: string;
  status: 'Waiting' | 'Resolved' | 'Critical';
}

export interface DashboardData {
  id: string;
  title: string;
  projectName: string;
  reportDate: string;
  summary: string;
  overallStatus: StatusLevel;
  health: ProjectHealth;
  highlights: string[];
  upcomingWork: string[];
  risks: RiskItem[];
  actionItems: ActionItem[];
  workload: WorkloadItem[];
  dependencies: Dependency[];
  deliverySentiment: number; // 0-100
  createdAt: number;
}

export interface User {
  email: string;
  name: string;
}

// Common TypeScript types for the Government Performance Management Dashboard

export type ProjectStatus = 'planned' | 'active' | 'at-risk' | 'delayed' | 'completed';
export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RiskStatus = 'identified' | 'monitored' | 'mitigated' | 'resolved';
export type UserRole = 'executive' | 'portfolio_manager' | 'project_officer';
export type PredictionType = 'failure' | 'delay' | 'budget' | 'compliance';

export interface Timeline {
  startDate: number;
  endDate: number;
  milestones: Milestone[];
}

export interface Milestone {
  name: string;
  date: number;
  status: string;
}

export interface BaseEntity {
  _id: string;
  createdAt: number;
  updatedAt: number;
}

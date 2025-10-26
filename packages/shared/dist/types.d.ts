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
export interface Project extends BaseEntity {
    name: string;
    description: string;
    status: ProjectStatus;
    budget: number;
    timeline: Timeline;
    portfolioId?: string;
    ownerId?: string;
    healthScore: number;
    riskLevel: RiskSeverity;
    tags: string[];
}
export interface CreateProjectInput {
    name: string;
    description: string;
    status: ProjectStatus;
    budget: number;
    timeline: Timeline;
    portfolioId?: string;
    ownerId?: string;
    healthScore: number;
    riskLevel: RiskSeverity;
    tags: string[];
}
export interface UpdateProjectInput {
    name?: string;
    description?: string;
    status?: ProjectStatus;
    budget?: number;
    timeline?: Timeline;
    portfolioId?: string;
    ownerId?: string;
    healthScore?: number;
    riskLevel?: RiskSeverity;
    tags?: string[];
}
export interface Portfolio extends BaseEntity {
    name: string;
    description: string;
    ownerId: string;
    healthScore: number;
}
export interface Risk extends BaseEntity {
    projectId: string;
    title: string;
    description: string;
    severity: RiskSeverity;
    status: RiskStatus;
    probability: number;
    impact: number;
    mitigationPlan?: string;
}
export interface User extends BaseEntity {
    name: string;
    email: string;
    role: UserRole;
    department: string;
}
//# sourceMappingURL=types.d.ts.map
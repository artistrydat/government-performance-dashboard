export interface ComplianceCheckResult {
    projectId: string;
    projectName: string;
    standardId: string;
    standardName: string;
    overallScore: number;
    status: 'compliant' | 'partial' | 'non_compliant';
    lastEvaluatedAt: number;
    trend: 'improving' | 'declining' | 'stable';
    missingCriteria: string[];
    alerts: ComplianceAlert[];
}
export interface ComplianceAlert {
    type: 'non_compliant' | 'declining_trend' | 'missing_evidence' | 'overdue_evaluation';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    criteriaId?: string;
    criteriaName?: string;
    threshold?: number;
    currentValue?: number;
}
export interface PortfolioComplianceSummary {
    portfolioId: string;
    portfolioName: string;
    totalProjects: number;
    evaluatedProjects: number;
    averageComplianceScore: number;
    complianceDistribution: {
        compliant: number;
        partial: number;
        non_compliant: number;
    };
    topRisks: ComplianceAlert[];
    trendAnalysis: {
        overallTrend: 'improving' | 'declining' | 'stable';
        scoreChange: number;
        period: string;
    };
}
export declare const scheduleComplianceEvaluations: import("convex/server").RegisteredMutation<"public", {
    portfolioIds?: import("convex/values").GenericId<"portfolios">[] | undefined;
    standardIds?: import("convex/values").GenericId<"pmiStandards">[] | undefined;
    frequency: "daily" | "weekly" | "monthly";
}, Promise<import("convex/values").GenericId<"complianceSchedules">>>;
export declare const getDueSchedules: import("convex/server").RegisteredQuery<"public", {
    currentTime: number;
}, Promise<{
    _id: import("convex/values").GenericId<"complianceSchedules">;
    _creationTime: number;
    createdAt: number;
    updatedAt: number;
    isActive: boolean;
    frequency: "daily" | "weekly" | "monthly";
    portfolioIds: import("convex/values").GenericId<"portfolios">[];
    standardIds: import("convex/values").GenericId<"pmiStandards">[];
    nextEvaluationTime: number;
}[]>>;
export declare const updateScheduleNextRun: import("convex/server").RegisteredMutation<"public", {
    currentTime: number;
    scheduleId: import("convex/values").GenericId<"complianceSchedules">;
}, Promise<void>>;
export declare const executeBulkEvaluation: import("convex/server").RegisteredMutation<"public", {
    evaluatorId: string;
    portfolioIds: import("convex/values").GenericId<"portfolios">[];
    standardIds: import("convex/values").GenericId<"pmiStandards">[];
}, Promise<ComplianceCheckResult[]>>;
export declare const getRealTimeComplianceStatus: import("convex/server").RegisteredQuery<"public", {
    projectId: import("convex/values").GenericId<"projects">;
}, Promise<ComplianceCheckResult[]>>;
export declare const getPortfolioComplianceSummary: import("convex/server").RegisteredQuery<"public", {
    portfolioId: import("convex/values").GenericId<"portfolios">;
}, Promise<PortfolioComplianceSummary>>;
//# sourceMappingURL=automatedCompliance.d.ts.map
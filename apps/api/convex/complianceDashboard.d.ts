export declare const getComplianceStatistics: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    overallCompliance: number;
    compliantProjects: number;
    nonCompliantProjects: number;
    totalProjects: number;
    standardsCoverage: number;
    trend: string;
    trendValue: number;
}>>;
export declare const getPortfolioCompliance: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    portfolioId: import("convex/values").GenericId<"portfolios">;
    portfolioName: string;
    complianceScore: number;
    totalProjects: number;
    evaluatedProjects: number;
    projects: {
        name: string;
        complianceScore: number;
        lastEvaluation: number;
        status: string;
    }[];
}[]>>;
export declare const getComplianceTrends: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    date: string;
    complianceScore: number;
}[]>>;
export declare const getStandardsAdherence: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    standardId: import("convex/values").GenericId<"pmiStandards">;
    standardName: string;
    complianceRate: number;
    totalEvaluations: number;
}[]>>;
export declare const getNonComplianceHeatmap: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    standardId: import("convex/values").GenericId<"pmiStandards">;
    standardName: string;
    nonCompliantProjects: number;
    intensity: number;
}[]>>;
//# sourceMappingURL=complianceDashboard.d.ts.map
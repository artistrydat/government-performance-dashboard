export declare const generateComplianceReportData: import("convex/server").RegisteredQuery<"public", {
    portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
    projectId?: import("convex/values").GenericId<"projects"> | undefined;
    reportType: "executive_summary" | "detailed_breakdown" | "audit_ready";
}, Promise<{
    executiveSummary: {
        overallCompliance: number;
        totalProjects: number;
        compliantProjects: number;
        nonCompliantProjects: number;
        evaluatedProjects: number;
        standardsCoverage: number;
        reportGeneratedAt: number;
        keyFindings: {
            title: string;
            value: string;
            status: string;
        }[];
    };
    detailedBreakdown: {
        projectCompliance: {
            projectId: import("convex/values").GenericId<"projects">;
            projectName: string;
            complianceScore: number;
            status: string;
            lastEvaluation: number;
            evaluator: string;
        }[];
        standardsAdherence: {
            standardId: import("convex/values").GenericId<"pmiStandards">;
            standardName: string;
            category: "portfolio" | "program" | "project";
            complianceRate: number;
            totalEvaluations: number;
        }[];
        evidenceStatistics: {
            totalEvidence: number;
            approvedEvidence: number;
            pendingReview: number;
            rejectedEvidence: number;
        };
        portfolioBreakdown: {
            portfolioId: import("convex/values").GenericId<"portfolios">;
            portfolioName: string;
            complianceScore: number;
            totalProjects: number;
            evaluatedProjects: number;
        }[];
    };
    reportType: "executive_summary" | "detailed_breakdown" | "audit_ready";
    generatedAt: number;
    scope: {
        portfolioId: import("convex/values").GenericId<"portfolios"> | undefined;
        projectId: import("convex/values").GenericId<"projects"> | undefined;
        totalProjects: number;
    };
}>>;
export declare const saveReportRequest: import("convex/server").RegisteredMutation<"public", {
    reportType: string;
    parameters: {
        portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
        projectId?: import("convex/values").GenericId<"projects"> | undefined;
        dateRange?: {
            startDate: number;
            endDate: number;
        } | undefined;
    };
    requestedBy: import("convex/values").GenericId<"users">;
}, Promise<import("convex/values").GenericId<"complianceReportRequests">>>;
export declare const getReportStatus: import("convex/server").RegisteredQuery<"public", {
    reportRequestId: import("convex/values").GenericId<"complianceReportRequests">;
}, Promise<{
    _id: import("convex/values").GenericId<"complianceReportRequests">;
    _creationTime: number;
    reportUrl?: string | undefined;
    errorMessage?: string | undefined;
    status: "completed" | "pending" | "processing" | "failed";
    createdAt: number;
    updatedAt: number;
    reportType: string;
    parameters: {
        portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
        projectId?: import("convex/values").GenericId<"projects"> | undefined;
        dateRange?: {
            startDate: number;
            endDate: number;
        } | undefined;
    };
    requestedBy: import("convex/values").GenericId<"users">;
} | null>>;
export declare const scheduleRecurringReport: import("convex/server").RegisteredMutation<"public", {
    frequency: "daily" | "weekly" | "monthly";
    reportType: string;
    parameters: {
        portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
        projectId?: import("convex/values").GenericId<"projects"> | undefined;
    };
    recipients: import("convex/values").GenericId<"users">[];
    scheduledBy: import("convex/values").GenericId<"users">;
}, Promise<import("convex/values").GenericId<"complianceReportSchedules">>>;
//# sourceMappingURL=complianceReports.d.ts.map
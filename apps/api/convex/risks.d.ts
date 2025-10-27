export declare const create: import("convex/server").RegisteredMutation<"public", {
    mitigationPlan?: string | undefined;
    status: "identified" | "monitored" | "mitigated" | "resolved";
    title: string;
    description: string;
    projectId: import("convex/values").GenericId<"projects">;
    severity: "low" | "medium" | "high" | "critical";
    probability: number;
    impact: number;
}, Promise<import("convex/values").GenericId<"risks">>>;
export declare const get: import("convex/server").RegisteredQuery<"public", {
    riskId: import("convex/values").GenericId<"risks">;
}, Promise<{
    _id: import("convex/values").GenericId<"risks">;
    _creationTime: number;
    mitigationPlan?: string | undefined;
    status: "identified" | "monitored" | "mitigated" | "resolved";
    title: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    projectId: import("convex/values").GenericId<"projects">;
    severity: "low" | "medium" | "high" | "critical";
    probability: number;
    impact: number;
}>>;
export declare const list: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    _id: import("convex/values").GenericId<"risks">;
    _creationTime: number;
    mitigationPlan?: string | undefined;
    status: "identified" | "monitored" | "mitigated" | "resolved";
    title: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    projectId: import("convex/values").GenericId<"projects">;
    severity: "low" | "medium" | "high" | "critical";
    probability: number;
    impact: number;
}[]>>;
export declare const listByProject: import("convex/server").RegisteredQuery<"public", {
    projectId: import("convex/values").GenericId<"projects">;
}, Promise<{
    _id: import("convex/values").GenericId<"risks">;
    _creationTime: number;
    mitigationPlan?: string | undefined;
    status: "identified" | "monitored" | "mitigated" | "resolved";
    title: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    projectId: import("convex/values").GenericId<"projects">;
    severity: "low" | "medium" | "high" | "critical";
    probability: number;
    impact: number;
}[]>>;
export declare const listBySeverity: import("convex/server").RegisteredQuery<"public", {
    severity: "low" | "medium" | "high" | "critical";
}, Promise<{
    _id: import("convex/values").GenericId<"risks">;
    _creationTime: number;
    mitigationPlan?: string | undefined;
    status: "identified" | "monitored" | "mitigated" | "resolved";
    title: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    projectId: import("convex/values").GenericId<"projects">;
    severity: "low" | "medium" | "high" | "critical";
    probability: number;
    impact: number;
}[]>>;
export declare const listByStatus: import("convex/server").RegisteredQuery<"public", {
    status: "identified" | "monitored" | "mitigated" | "resolved";
}, Promise<{
    _id: import("convex/values").GenericId<"risks">;
    _creationTime: number;
    mitigationPlan?: string | undefined;
    status: "identified" | "monitored" | "mitigated" | "resolved";
    title: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    projectId: import("convex/values").GenericId<"projects">;
    severity: "low" | "medium" | "high" | "critical";
    probability: number;
    impact: number;
}[]>>;
export declare const update: import("convex/server").RegisteredMutation<"public", {
    mitigationPlan?: string | undefined;
    status: "identified" | "monitored" | "mitigated" | "resolved";
    title: string;
    description: string;
    projectId: import("convex/values").GenericId<"projects">;
    severity: "low" | "medium" | "high" | "critical";
    probability: number;
    impact: number;
    riskId: import("convex/values").GenericId<"risks">;
}, Promise<import("convex/values").GenericId<"risks">>>;
export declare const remove: import("convex/server").RegisteredMutation<"public", {
    riskId: import("convex/values").GenericId<"risks">;
}, Promise<import("convex/values").GenericId<"risks">>>;
export declare const getProjectRiskStatistics: import("convex/server").RegisteredQuery<"public", {
    projectId: import("convex/values").GenericId<"projects">;
}, Promise<{
    totalRisks: number;
    averageRiskScore: number;
    severityCounts: {
        low: number;
        medium: number;
        high: number;
        critical: number;
    };
    statusCounts: {
        identified: number;
        monitored: number;
        mitigated: number;
        resolved: number;
    };
    highPriorityRisks: number;
}>>;
export declare const calculateRiskScore: (probability: number, impact: number) => number;
export declare const getHighPriorityRisks: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    _id: import("convex/values").GenericId<"risks">;
    _creationTime: number;
    mitigationPlan?: string | undefined;
    status: "identified" | "monitored" | "mitigated" | "resolved";
    title: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    projectId: import("convex/values").GenericId<"projects">;
    severity: "low" | "medium" | "high" | "critical";
    probability: number;
    impact: number;
}[]>>;
export declare const updateStatus: import("convex/server").RegisteredMutation<"public", {
    status: "identified" | "monitored" | "mitigated" | "resolved";
    riskId: import("convex/values").GenericId<"risks">;
}, Promise<import("convex/values").GenericId<"risks">>>;

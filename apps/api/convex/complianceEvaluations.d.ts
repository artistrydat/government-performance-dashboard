export declare const listRecent: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    _id: import("convex/values").GenericId<"complianceEvaluations">;
    _creationTime: number;
    notes?: string | undefined;
    createdAt: number;
    projectId: import("convex/values").GenericId<"projects">;
    standardId: import("convex/values").GenericId<"pmiStandards">;
    overallScore: number;
    evaluatedAt: number;
    evaluatorId: import("convex/values").GenericId<"users">;
}[]>>;
export declare const getByProject: import("convex/server").RegisteredQuery<"public", {
    projectId: import("convex/values").GenericId<"projects">;
}, Promise<{
    _id: import("convex/values").GenericId<"complianceEvaluations">;
    _creationTime: number;
    notes?: string | undefined;
    createdAt: number;
    projectId: import("convex/values").GenericId<"projects">;
    standardId: import("convex/values").GenericId<"pmiStandards">;
    overallScore: number;
    evaluatedAt: number;
    evaluatorId: import("convex/values").GenericId<"users">;
}[]>>;
export declare const getByStandard: import("convex/server").RegisteredQuery<"public", {
    standardId: import("convex/values").GenericId<"pmiStandards">;
}, Promise<{
    _id: import("convex/values").GenericId<"complianceEvaluations">;
    _creationTime: number;
    notes?: string | undefined;
    createdAt: number;
    projectId: import("convex/values").GenericId<"projects">;
    standardId: import("convex/values").GenericId<"pmiStandards">;
    overallScore: number;
    evaluatedAt: number;
    evaluatorId: import("convex/values").GenericId<"users">;
}[]>>;
export declare const create: import("convex/server").RegisteredMutation<"public", {
    notes?: string | undefined;
    projectId: import("convex/values").GenericId<"projects">;
    standardId: import("convex/values").GenericId<"pmiStandards">;
    overallScore: number;
    evaluatorId: import("convex/values").GenericId<"users">;
}, Promise<import("convex/values").GenericId<"complianceEvaluations">>>;
export declare const getProjectStatistics: import("convex/server").RegisteredQuery<"public", {
    projectId: import("convex/values").GenericId<"projects">;
}, Promise<{
    averageScore: number;
    totalEvaluations: number;
    latestEvaluation: null;
    scoreTrend: string;
} | {
    averageScore: number;
    totalEvaluations: number;
    latestEvaluation: {
        _id: import("convex/values").GenericId<"complianceEvaluations">;
        _creationTime: number;
        notes?: string | undefined;
        createdAt: number;
        projectId: import("convex/values").GenericId<"projects">;
        standardId: import("convex/values").GenericId<"pmiStandards">;
        overallScore: number;
        evaluatedAt: number;
        evaluatorId: import("convex/values").GenericId<"users">;
    };
    scoreTrend: string;
}>>;
//# sourceMappingURL=complianceEvaluations.d.ts.map
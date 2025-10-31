export interface EvaluationResult {
    projectId: string;
    standardId: string;
    overallScore: number;
    criteriaResults: CriteriaResult[];
    evaluationDate: number;
    evaluatorId: string;
    status: 'complete' | 'partial' | 'failed';
    notes?: string;
}
export interface CriteriaResult {
    criteriaId: string;
    criteriaName: string;
    score: number;
    maxScore: number;
    status: 'met' | 'partial' | 'not_met' | 'not_applicable';
    evidenceStatus: 'provided' | 'missing' | 'invalid';
    validationNotes?: string;
}
export interface ValidationResult {
    isValid: boolean;
    score: number;
    maxScore: number;
    validationNotes?: string;
    evidenceType: 'document' | 'link' | 'text' | 'file';
}
export declare const evaluateProjectCompliance: import("convex/server").RegisteredMutation<"public", {
    notes?: string | undefined;
    projectId: import("convex/values").GenericId<"projects">;
    standardId: import("convex/values").GenericId<"pmiStandards">;
    evaluatorId: import("convex/values").GenericId<"users">;
}, Promise<EvaluationResult>>;
export declare const getProjectEvaluationResults: import("convex/server").RegisteredQuery<"public", {
    projectId: import("convex/values").GenericId<"projects">;
}, Promise<EvaluationResult[]>>;
export declare const batchEvaluateProjects: import("convex/server").RegisteredMutation<"public", {
    standardId: import("convex/values").GenericId<"pmiStandards">;
    evaluatorId: import("convex/values").GenericId<"users">;
    projectIds: import("convex/values").GenericId<"projects">[];
}, Promise<EvaluationResult[]>>;
export declare const getEvaluationStatistics: import("convex/server").RegisteredQuery<"public", {
    projectId: import("convex/values").GenericId<"projects">;
}, Promise<{
    totalEvaluations: number;
    averageScore: number;
    bestScore: number;
    worstScore: number;
    improvementTrend: string;
    complianceLevel: string;
}>>;
//# sourceMappingURL=evaluationEngine.d.ts.map
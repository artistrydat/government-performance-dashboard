export declare const getById: import("convex/server").RegisteredQuery<"public", {
    complianceId: import("convex/values").GenericId<"projectCompliance">;
}, Promise<{
    _id: import("convex/values").GenericId<"projectCompliance">;
    _creationTime: number;
    evidence?: string | undefined;
    evidenceUrl?: string | undefined;
    reviewerId?: import("convex/values").GenericId<"users"> | undefined;
    reviewedAt?: number | undefined;
    submittedAt?: number | undefined;
    status: "not_started" | "in_progress" | "submitted" | "approved" | "rejected";
    createdAt: number;
    updatedAt: number;
    projectId: import("convex/values").GenericId<"projects">;
    standardId: import("convex/values").GenericId<"pmiStandards">;
    criteriaId: import("convex/values").GenericId<"pmiStandardCriteria">;
    score: number;
}>>;
export declare const listByProject: import("convex/server").RegisteredQuery<"public", {
    projectId: import("convex/values").GenericId<"projects">;
}, Promise<{
    _id: import("convex/values").GenericId<"projectCompliance">;
    _creationTime: number;
    evidence?: string | undefined;
    evidenceUrl?: string | undefined;
    reviewerId?: import("convex/values").GenericId<"users"> | undefined;
    reviewedAt?: number | undefined;
    submittedAt?: number | undefined;
    status: "not_started" | "in_progress" | "submitted" | "approved" | "rejected";
    createdAt: number;
    updatedAt: number;
    projectId: import("convex/values").GenericId<"projects">;
    standardId: import("convex/values").GenericId<"pmiStandards">;
    criteriaId: import("convex/values").GenericId<"pmiStandardCriteria">;
    score: number;
}[]>>;
export declare const submitEvidence: import("convex/server").RegisteredMutation<"public", {
    evidenceUrl?: string | undefined;
    projectId: import("convex/values").GenericId<"projects">;
    standardId: import("convex/values").GenericId<"pmiStandards">;
    criteriaId: import("convex/values").GenericId<"pmiStandardCriteria">;
    evidence: string;
}, Promise<import("convex/values").GenericId<"projectCompliance">>>;
export declare const updateStatus: import("convex/server").RegisteredMutation<"public", {
    score?: number | undefined;
    reviewerId?: import("convex/values").GenericId<"users"> | undefined;
    notes?: string | undefined;
    status: "not_started" | "in_progress" | "submitted" | "approved" | "rejected";
    complianceId: import("convex/values").GenericId<"projectCompliance">;
}, Promise<import("convex/values").GenericId<"projectCompliance">>>;
//# sourceMappingURL=projectCompliance.d.ts.map
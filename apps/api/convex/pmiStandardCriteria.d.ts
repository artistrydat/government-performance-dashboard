export declare const listAll: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    _id: import("convex/values").GenericId<"pmiStandardCriteria">;
    _creationTime: number;
    name: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    standardId: import("convex/values").GenericId<"pmiStandards">;
    requirement: string;
    evidenceType: "document" | "link" | "text" | "file";
    evidenceDescription: string;
    scoringMethod: "binary" | "partial" | "scale";
    maxScore: number;
    isMandatory: boolean;
    order: number;
}[]>>;
export declare const listByStandard: import("convex/server").RegisteredQuery<"public", {
    standardId: import("convex/values").GenericId<"pmiStandards">;
}, Promise<{
    _id: import("convex/values").GenericId<"pmiStandardCriteria">;
    _creationTime: number;
    name: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    standardId: import("convex/values").GenericId<"pmiStandards">;
    requirement: string;
    evidenceType: "document" | "link" | "text" | "file";
    evidenceDescription: string;
    scoringMethod: "binary" | "partial" | "scale";
    maxScore: number;
    isMandatory: boolean;
    order: number;
}[]>>;
export declare const getById: import("convex/server").RegisteredQuery<"public", {
    criteriaId: import("convex/values").GenericId<"pmiStandardCriteria">;
}, Promise<{
    _id: import("convex/values").GenericId<"pmiStandardCriteria">;
    _creationTime: number;
    name: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    standardId: import("convex/values").GenericId<"pmiStandards">;
    requirement: string;
    evidenceType: "document" | "link" | "text" | "file";
    evidenceDescription: string;
    scoringMethod: "binary" | "partial" | "scale";
    maxScore: number;
    isMandatory: boolean;
    order: number;
}>>;
export declare const create: import("convex/server").RegisteredMutation<"public", {
    name: string;
    description: string;
    standardId: import("convex/values").GenericId<"pmiStandards">;
    requirement: string;
    evidenceType: "document" | "link" | "text" | "file";
    evidenceDescription: string;
    scoringMethod: "binary" | "partial" | "scale";
    maxScore: number;
    isMandatory: boolean;
    order: number;
}, Promise<import("convex/values").GenericId<"pmiStandardCriteria">>>;
export declare const update: import("convex/server").RegisteredMutation<"public", {
    name?: string | undefined;
    description?: string | undefined;
    requirement?: string | undefined;
    evidenceType?: "document" | "link" | "text" | "file" | undefined;
    evidenceDescription?: string | undefined;
    scoringMethod?: "binary" | "partial" | "scale" | undefined;
    maxScore?: number | undefined;
    isMandatory?: boolean | undefined;
    order?: number | undefined;
    criteriaId: import("convex/values").GenericId<"pmiStandardCriteria">;
}, Promise<import("convex/values").GenericId<"pmiStandardCriteria">>>;
//# sourceMappingURL=pmiStandardCriteria.d.ts.map
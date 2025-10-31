export declare const listActive: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    _id: import("convex/values").GenericId<"pmiStandards">;
    _creationTime: number;
    name: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    category: "portfolio" | "program" | "project";
    level: "foundational" | "intermediate" | "advanced";
    weight: number;
    version: string;
    isActive: boolean;
}[]>>;
export declare const listByCategory: import("convex/server").RegisteredQuery<"public", {
    category: "portfolio" | "program" | "project";
}, Promise<{
    _id: import("convex/values").GenericId<"pmiStandards">;
    _creationTime: number;
    name: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    category: "portfolio" | "program" | "project";
    level: "foundational" | "intermediate" | "advanced";
    weight: number;
    version: string;
    isActive: boolean;
}[]>>;
export declare const getById: import("convex/server").RegisteredQuery<"public", {
    standardId: import("convex/values").GenericId<"pmiStandards">;
}, Promise<{
    _id: import("convex/values").GenericId<"pmiStandards">;
    _creationTime: number;
    name: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    category: "portfolio" | "program" | "project";
    level: "foundational" | "intermediate" | "advanced";
    weight: number;
    version: string;
    isActive: boolean;
}>>;
export declare const create: import("convex/server").RegisteredMutation<"public", {
    name: string;
    description: string;
    category: "portfolio" | "program" | "project";
    level: "foundational" | "intermediate" | "advanced";
    weight: number;
    version: string;
}, Promise<import("convex/values").GenericId<"pmiStandards">>>;
export declare const update: import("convex/server").RegisteredMutation<"public", {
    name?: string | undefined;
    description?: string | undefined;
    category?: "portfolio" | "program" | "project" | undefined;
    level?: "foundational" | "intermediate" | "advanced" | undefined;
    weight?: number | undefined;
    version?: string | undefined;
    isActive?: boolean | undefined;
    standardId: import("convex/values").GenericId<"pmiStandards">;
}, Promise<import("convex/values").GenericId<"pmiStandards">>>;
export declare const listWithCriteria: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    criteria: {
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
    }[];
    _id: import("convex/values").GenericId<"pmiStandards">;
    _creationTime: number;
    name: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    category: "portfolio" | "program" | "project";
    level: "foundational" | "intermediate" | "advanced";
    weight: number;
    version: string;
    isActive: boolean;
}[]>>;
//# sourceMappingURL=pmiStandards.d.ts.map
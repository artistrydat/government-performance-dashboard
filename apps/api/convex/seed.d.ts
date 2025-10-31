export declare const seedAll: import("convex/server").RegisteredMutation<"public", {}, Promise<{
    users: number;
    portfolios: number;
    projects: number;
    risks: number;
    pmiStandards: number;
    pmiCriteria: number;
    complianceEvaluations: number;
    message: string;
    userMap: {
        mockId: string;
        convexId: string;
    }[];
    riskBreakdown: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
}>>;
export declare const getUserByMockId: import("convex/server").RegisteredMutation<"public", {
    mockId: string;
}, Promise<{
    _id: import("convex/values").GenericId<"users">;
    _creationTime: number;
    name: string;
    createdAt: number;
    updatedAt: number;
    email: string;
    role: "executive" | "portfolio_manager" | "project_officer";
    department: string;
}>>;
//# sourceMappingURL=seed.d.ts.map
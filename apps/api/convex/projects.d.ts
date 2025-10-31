export declare const create: import("convex/server").RegisteredMutation<"public", {
    portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
    ownerId?: import("convex/values").GenericId<"users"> | undefined;
    name: string;
    description: string;
    status: "planned" | "active" | "at-risk" | "delayed" | "completed";
    budget: number;
    spentBudget: number;
    timeline: {
        startDate: number;
        endDate: number;
        milestones: {
            name: string;
            status: string;
            date: number;
        }[];
    };
    teamMembers: import("convex/values").GenericId<"users">[];
    healthScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    tags: string[];
}, Promise<import("convex/values").GenericId<"projects">>>;
export declare const get: import("convex/server").RegisteredQuery<"public", {
    projectId: import("convex/values").GenericId<"projects">;
}, Promise<{
    _id: import("convex/values").GenericId<"projects">;
    _creationTime: number;
    portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
    ownerId?: import("convex/values").GenericId<"users"> | undefined;
    name: string;
    description: string;
    status: "planned" | "active" | "at-risk" | "delayed" | "completed";
    budget: number;
    spentBudget: number;
    timeline: {
        startDate: number;
        endDate: number;
        milestones: {
            name: string;
            status: string;
            date: number;
        }[];
    };
    teamMembers: import("convex/values").GenericId<"users">[];
    healthScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    tags: string[];
    createdAt: number;
    updatedAt: number;
}>>;
export declare const list: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    _id: import("convex/values").GenericId<"projects">;
    _creationTime: number;
    portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
    ownerId?: import("convex/values").GenericId<"users"> | undefined;
    name: string;
    description: string;
    status: "planned" | "active" | "at-risk" | "delayed" | "completed";
    budget: number;
    spentBudget: number;
    timeline: {
        startDate: number;
        endDate: number;
        milestones: {
            name: string;
            status: string;
            date: number;
        }[];
    };
    teamMembers: import("convex/values").GenericId<"users">[];
    healthScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    tags: string[];
    createdAt: number;
    updatedAt: number;
}[]>>;
export declare const listByStatus: import("convex/server").RegisteredQuery<"public", {
    status: "planned" | "active" | "at-risk" | "delayed" | "completed";
}, Promise<{
    _id: import("convex/values").GenericId<"projects">;
    _creationTime: number;
    portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
    ownerId?: import("convex/values").GenericId<"users"> | undefined;
    name: string;
    description: string;
    status: "planned" | "active" | "at-risk" | "delayed" | "completed";
    budget: number;
    spentBudget: number;
    timeline: {
        startDate: number;
        endDate: number;
        milestones: {
            name: string;
            status: string;
            date: number;
        }[];
    };
    teamMembers: import("convex/values").GenericId<"users">[];
    healthScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    tags: string[];
    createdAt: number;
    updatedAt: number;
}[]>>;
export declare const listByPortfolio: import("convex/server").RegisteredQuery<"public", {
    portfolioId: import("convex/values").GenericId<"portfolios">;
}, Promise<{
    _id: import("convex/values").GenericId<"projects">;
    _creationTime: number;
    portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
    ownerId?: import("convex/values").GenericId<"users"> | undefined;
    name: string;
    description: string;
    status: "planned" | "active" | "at-risk" | "delayed" | "completed";
    budget: number;
    spentBudget: number;
    timeline: {
        startDate: number;
        endDate: number;
        milestones: {
            name: string;
            status: string;
            date: number;
        }[];
    };
    teamMembers: import("convex/values").GenericId<"users">[];
    healthScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    tags: string[];
    createdAt: number;
    updatedAt: number;
}[]>>;
export declare const update: import("convex/server").RegisteredMutation<"public", {
    portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
    ownerId?: import("convex/values").GenericId<"users"> | undefined;
    name: string;
    description: string;
    status: "planned" | "active" | "at-risk" | "delayed" | "completed";
    budget: number;
    spentBudget: number;
    timeline: {
        startDate: number;
        endDate: number;
        milestones: {
            name: string;
            status: string;
            date: number;
        }[];
    };
    teamMembers: import("convex/values").GenericId<"users">[];
    healthScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    tags: string[];
    projectId: import("convex/values").GenericId<"projects">;
}, Promise<import("convex/values").GenericId<"projects">>>;
export declare const updatePortfolioAssignment: import("convex/server").RegisteredMutation<"public", {
    portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
    projectId: import("convex/values").GenericId<"projects">;
}, Promise<import("convex/values").GenericId<"projects">>>;
export declare const remove: import("convex/server").RegisteredMutation<"public", {
    projectId: import("convex/values").GenericId<"projects">;
}, Promise<import("convex/values").GenericId<"projects">>>;
export declare const getStatistics: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    totalProjects: number;
    totalBudget: number;
    averageHealthScore: number;
    statusCounts: {
        planned: number;
        active: number;
        'at-risk': number;
        delayed: number;
        completed: number;
    };
    riskLevelCounts: {
        low: number;
        medium: number;
        high: number;
        critical: number;
    };
}>>;
//# sourceMappingURL=projects.d.ts.map
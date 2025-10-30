export declare const create: import("convex/server").RegisteredMutation<"public", {
    name: string;
    description: string;
    ownerId: import("convex/values").GenericId<"users">;
    healthScore: number;
    totalBudget: number;
    allocatedBudget: number;
    resourceAllocation: {
        teamMembers: number;
        budgetUtilization: number;
        projectCount: number;
    };
}, Promise<import("convex/values").GenericId<"portfolios">>>;
export declare const get: import("convex/server").RegisteredQuery<"public", {
    portfolioId: import("convex/values").GenericId<"portfolios">;
}, Promise<{
    _id: import("convex/values").GenericId<"portfolios">;
    _creationTime: number;
    name: string;
    description: string;
    ownerId: import("convex/values").GenericId<"users">;
    healthScore: number;
    createdAt: number;
    updatedAt: number;
    totalBudget: number;
    allocatedBudget: number;
    resourceAllocation: {
        teamMembers: number;
        budgetUtilization: number;
        projectCount: number;
    };
}>>;
export declare const list: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    _id: import("convex/values").GenericId<"portfolios">;
    _creationTime: number;
    name: string;
    description: string;
    ownerId: import("convex/values").GenericId<"users">;
    healthScore: number;
    createdAt: number;
    updatedAt: number;
    totalBudget: number;
    allocatedBudget: number;
    resourceAllocation: {
        teamMembers: number;
        budgetUtilization: number;
        projectCount: number;
    };
}[]>>;
export declare const listByOwner: import("convex/server").RegisteredQuery<"public", {
    ownerId: import("convex/values").GenericId<"users">;
}, Promise<{
    _id: import("convex/values").GenericId<"portfolios">;
    _creationTime: number;
    name: string;
    description: string;
    ownerId: import("convex/values").GenericId<"users">;
    healthScore: number;
    createdAt: number;
    updatedAt: number;
    totalBudget: number;
    allocatedBudget: number;
    resourceAllocation: {
        teamMembers: number;
        budgetUtilization: number;
        projectCount: number;
    };
}[]>>;
export declare const update: import("convex/server").RegisteredMutation<"public", {
    name: string;
    description: string;
    portfolioId: import("convex/values").GenericId<"portfolios">;
    ownerId: import("convex/values").GenericId<"users">;
    healthScore: number;
    totalBudget: number;
    allocatedBudget: number;
    resourceAllocation: {
        teamMembers: number;
        budgetUtilization: number;
        projectCount: number;
    };
}, Promise<import("convex/values").GenericId<"portfolios">>>;
export declare const remove: import("convex/server").RegisteredMutation<"public", {
    portfolioId: import("convex/values").GenericId<"portfolios">;
}, Promise<import("convex/values").GenericId<"portfolios">>>;
export declare const updateHealthScore: import("convex/server").RegisteredMutation<"public", {
    portfolioId: import("convex/values").GenericId<"portfolios">;
}, Promise<{
    portfolioId: import("convex/values").GenericId<"portfolios">;
    healthScore: number;
    projectCount: number;
}>>;
export declare const getStatistics: import("convex/server").RegisteredQuery<"public", {
    portfolioId: import("convex/values").GenericId<"portfolios">;
}, Promise<{
    portfolio: {
        name: string;
        description: string;
        healthScore: number;
    };
    statistics: {
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
    };
}>>;
export declare const getWithProjects: import("convex/server").RegisteredQuery<"public", {
    portfolioId: import("convex/values").GenericId<"portfolios">;
}, Promise<{
    portfolio: {
        _id: import("convex/values").GenericId<"portfolios">;
        _creationTime: number;
        name: string;
        description: string;
        ownerId: import("convex/values").GenericId<"users">;
        healthScore: number;
        createdAt: number;
        updatedAt: number;
        totalBudget: number;
        allocatedBudget: number;
        resourceAllocation: {
            teamMembers: number;
            budgetUtilization: number;
            projectCount: number;
        };
    };
    projects: {
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
    }[];
}>>;
//# sourceMappingURL=portfolios.d.ts.map
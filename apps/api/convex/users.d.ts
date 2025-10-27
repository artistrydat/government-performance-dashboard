export declare const create: import("convex/server").RegisteredMutation<"public", {
    email: string;
    role: "executive" | "portfolio_manager" | "project_officer";
    name: string;
    department: string;
}, Promise<import("convex/values").GenericId<"users">>>;
export declare const get: import("convex/server").RegisteredQuery<"public", {
    userId: import("convex/values").GenericId<"users">;
}, Promise<{
    _id: import("convex/values").GenericId<"users">;
    _creationTime: number;
    email: string;
    role: "executive" | "portfolio_manager" | "project_officer";
    name: string;
    createdAt: number;
    updatedAt: number;
    department: string;
}>>;
export declare const list: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    _id: import("convex/values").GenericId<"users">;
    _creationTime: number;
    email: string;
    role: "executive" | "portfolio_manager" | "project_officer";
    name: string;
    createdAt: number;
    updatedAt: number;
    department: string;
}[]>>;
export declare const getByEmail: import("convex/server").RegisteredQuery<"public", {
    email: string;
}, Promise<{
    _id: import("convex/values").GenericId<"users">;
    _creationTime: number;
    email: string;
    role: "executive" | "portfolio_manager" | "project_officer";
    name: string;
    createdAt: number;
    updatedAt: number;
    department: string;
}>>;
export declare const listByRole: import("convex/server").RegisteredQuery<"public", {
    role: "executive" | "portfolio_manager" | "project_officer";
}, Promise<{
    _id: import("convex/values").GenericId<"users">;
    _creationTime: number;
    email: string;
    role: "executive" | "portfolio_manager" | "project_officer";
    name: string;
    createdAt: number;
    updatedAt: number;
    department: string;
}[]>>;
export declare const update: import("convex/server").RegisteredMutation<"public", {
    email: string;
    role: "executive" | "portfolio_manager" | "project_officer";
    name: string;
    department: string;
    userId: import("convex/values").GenericId<"users">;
}, Promise<import("convex/values").GenericId<"users">>>;
export declare const remove: import("convex/server").RegisteredMutation<"public", {
    userId: import("convex/values").GenericId<"users">;
}, Promise<import("convex/values").GenericId<"users">>>;
export declare const getStatistics: import("convex/server").RegisteredQuery<"public", {}, Promise<{
    totalUsers: number;
    roleCounts: {
        executive: number;
        portfolio_manager: number;
        project_officer: number;
    };
    departmentCounts: Record<string, number>;
}>>;
export declare const getWithDetails: import("convex/server").RegisteredQuery<"public", {
    userId: import("convex/values").GenericId<"users">;
}, Promise<{
    user: {
        _id: import("convex/values").GenericId<"users">;
        _creationTime: number;
        email: string;
        role: "executive" | "portfolio_manager" | "project_officer";
        name: string;
        createdAt: number;
        updatedAt: number;
        department: string;
    };
    projects: {
        _id: import("convex/values").GenericId<"projects">;
        _creationTime: number;
        portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
        ownerId?: import("convex/values").GenericId<"users"> | undefined;
        status: "active" | "planned" | "at-risk" | "delayed" | "completed";
        name: string;
        description: string;
        budget: number;
        timeline: {
            startDate: number;
            endDate: number;
            milestones: {
                date: number;
                status: string;
                name: string;
            }[];
        };
        healthScore: number;
        riskLevel: "low" | "medium" | "high" | "critical";
        tags: string[];
        createdAt: number;
        updatedAt: number;
    }[];
    portfolios: {
        _id: import("convex/values").GenericId<"portfolios">;
        _creationTime: number;
        name: string;
        description: string;
        ownerId: import("convex/values").GenericId<"users">;
        healthScore: number;
        createdAt: number;
        updatedAt: number;
    }[];
}>>;
export declare const hasPermission: import("convex/server").RegisteredQuery<"public", {
    requiredRole: "executive" | "portfolio_manager" | "project_officer";
    userId: import("convex/values").GenericId<"users">;
}, Promise<boolean>>;
export declare const canAccessProject: import("convex/server").RegisteredQuery<"public", {
    projectId: import("convex/values").GenericId<"projects">;
    userId: import("convex/values").GenericId<"users">;
}, Promise<boolean>>;
export declare const canAccessPortfolio: import("convex/server").RegisteredQuery<"public", {
    portfolioId: import("convex/values").GenericId<"portfolios">;
    userId: import("convex/values").GenericId<"users">;
}, Promise<boolean>>;

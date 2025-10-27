declare const _default: import("convex/server").SchemaDefinition<{
    projects: import("convex/server").TableDefinition<import("convex/values").VObject<{
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
    }, {
        name: import("convex/values").VString<string, "required">;
        description: import("convex/values").VString<string, "required">;
        status: import("convex/values").VUnion<"active" | "planned" | "at-risk" | "delayed" | "completed", [import("convex/values").VLiteral<"planned", "required">, import("convex/values").VLiteral<"active", "required">, import("convex/values").VLiteral<"at-risk", "required">, import("convex/values").VLiteral<"delayed", "required">, import("convex/values").VLiteral<"completed", "required">], "required", never>;
        budget: import("convex/values").VFloat64<number, "required">;
        timeline: import("convex/values").VObject<{
            startDate: number;
            endDate: number;
            milestones: {
                date: number;
                status: string;
                name: string;
            }[];
        }, {
            startDate: import("convex/values").VFloat64<number, "required">;
            endDate: import("convex/values").VFloat64<number, "required">;
            milestones: import("convex/values").VArray<{
                date: number;
                status: string;
                name: string;
            }[], import("convex/values").VObject<{
                date: number;
                status: string;
                name: string;
            }, {
                name: import("convex/values").VString<string, "required">;
                date: import("convex/values").VFloat64<number, "required">;
                status: import("convex/values").VString<string, "required">;
            }, "required", "date" | "status" | "name">, "required">;
        }, "required", "startDate" | "endDate" | "milestones">;
        portfolioId: import("convex/values").VId<import("convex/values").GenericId<"portfolios"> | undefined, "optional">;
        ownerId: import("convex/values").VId<import("convex/values").GenericId<"users"> | undefined, "optional">;
        healthScore: import("convex/values").VFloat64<number, "required">;
        riskLevel: import("convex/values").VUnion<"low" | "medium" | "high" | "critical", [import("convex/values").VLiteral<"low", "required">, import("convex/values").VLiteral<"medium", "required">, import("convex/values").VLiteral<"high", "required">, import("convex/values").VLiteral<"critical", "required">], "required", never>;
        tags: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "status" | "name" | "description" | "budget" | "timeline" | "portfolioId" | "ownerId" | "healthScore" | "riskLevel" | "tags" | "createdAt" | "updatedAt" | "timeline.startDate" | "timeline.endDate" | "timeline.milestones">, {
        by_status: ["status", "_creationTime"];
        by_portfolio: ["portfolioId", "_creationTime"];
        by_owner: ["ownerId", "_creationTime"];
        by_health_score: ["healthScore", "_creationTime"];
        by_risk_level: ["riskLevel", "_creationTime"];
        by_created_at: ["createdAt", "_creationTime"];
    }, {}, {}>;
    portfolios: import("convex/server").TableDefinition<import("convex/values").VObject<{
        name: string;
        description: string;
        ownerId: import("convex/values").GenericId<"users">;
        healthScore: number;
        createdAt: number;
        updatedAt: number;
    }, {
        name: import("convex/values").VString<string, "required">;
        description: import("convex/values").VString<string, "required">;
        ownerId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        healthScore: import("convex/values").VFloat64<number, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "name" | "description" | "ownerId" | "healthScore" | "createdAt" | "updatedAt">, {
        by_owner: ["ownerId", "_creationTime"];
        by_health_score: ["healthScore", "_creationTime"];
    }, {}, {}>;
    risks: import("convex/server").TableDefinition<import("convex/values").VObject<{
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
    }, {
        projectId: import("convex/values").VId<import("convex/values").GenericId<"projects">, "required">;
        title: import("convex/values").VString<string, "required">;
        description: import("convex/values").VString<string, "required">;
        severity: import("convex/values").VUnion<"low" | "medium" | "high" | "critical", [import("convex/values").VLiteral<"low", "required">, import("convex/values").VLiteral<"medium", "required">, import("convex/values").VLiteral<"high", "required">, import("convex/values").VLiteral<"critical", "required">], "required", never>;
        status: import("convex/values").VUnion<"identified" | "monitored" | "mitigated" | "resolved", [import("convex/values").VLiteral<"identified", "required">, import("convex/values").VLiteral<"monitored", "required">, import("convex/values").VLiteral<"mitigated", "required">, import("convex/values").VLiteral<"resolved", "required">], "required", never>;
        probability: import("convex/values").VFloat64<number, "required">;
        impact: import("convex/values").VFloat64<number, "required">;
        mitigationPlan: import("convex/values").VString<string | undefined, "optional">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "status" | "title" | "description" | "createdAt" | "updatedAt" | "projectId" | "severity" | "probability" | "impact" | "mitigationPlan">, {
        by_project: ["projectId", "_creationTime"];
        by_severity: ["severity", "_creationTime"];
        by_status: ["status", "_creationTime"];
    }, {}, {}>;
    users: import("convex/server").TableDefinition<import("convex/values").VObject<{
        email: string;
        role: "executive" | "portfolio_manager" | "project_officer";
        name: string;
        createdAt: number;
        updatedAt: number;
        department: string;
    }, {
        name: import("convex/values").VString<string, "required">;
        email: import("convex/values").VString<string, "required">;
        role: import("convex/values").VUnion<"executive" | "portfolio_manager" | "project_officer", [import("convex/values").VLiteral<"executive", "required">, import("convex/values").VLiteral<"portfolio_manager", "required">, import("convex/values").VLiteral<"project_officer", "required">], "required", never>;
        department: import("convex/values").VString<string, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "email" | "role" | "name" | "createdAt" | "updatedAt" | "department">, {
        by_email: ["email", "_creationTime"];
        by_role: ["role", "_creationTime"];
    }, {}, {}>;
}, true>;
export default _default;

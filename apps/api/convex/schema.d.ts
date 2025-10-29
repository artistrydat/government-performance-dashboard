declare const _default: import("convex/server").SchemaDefinition<{
    projects: import("convex/server").TableDefinition<import("convex/values").VObject<{
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
                date: number;
                name: string;
                status: string;
            }[];
        };
        teamMembers: import("convex/values").GenericId<"users">[];
        healthScore: number;
        riskLevel: "low" | "medium" | "high" | "critical";
        tags: string[];
        createdAt: number;
        updatedAt: number;
    }, {
        name: import("convex/values").VString<string, "required">;
        description: import("convex/values").VString<string, "required">;
        status: import("convex/values").VUnion<"planned" | "active" | "at-risk" | "delayed" | "completed", [import("convex/values").VLiteral<"planned", "required">, import("convex/values").VLiteral<"active", "required">, import("convex/values").VLiteral<"at-risk", "required">, import("convex/values").VLiteral<"delayed", "required">, import("convex/values").VLiteral<"completed", "required">], "required", never>;
        budget: import("convex/values").VFloat64<number, "required">;
        spentBudget: import("convex/values").VFloat64<number, "required">;
        timeline: import("convex/values").VObject<{
            startDate: number;
            endDate: number;
            milestones: {
                date: number;
                name: string;
                status: string;
            }[];
        }, {
            startDate: import("convex/values").VFloat64<number, "required">;
            endDate: import("convex/values").VFloat64<number, "required">;
            milestones: import("convex/values").VArray<{
                date: number;
                name: string;
                status: string;
            }[], import("convex/values").VObject<{
                date: number;
                name: string;
                status: string;
            }, {
                name: import("convex/values").VString<string, "required">;
                date: import("convex/values").VFloat64<number, "required">;
                status: import("convex/values").VString<string, "required">;
            }, "required", "date" | "name" | "status">, "required">;
        }, "required", "startDate" | "endDate" | "milestones">;
        portfolioId: import("convex/values").VId<import("convex/values").GenericId<"portfolios"> | undefined, "optional">;
        ownerId: import("convex/values").VId<import("convex/values").GenericId<"users"> | undefined, "optional">;
        teamMembers: import("convex/values").VArray<import("convex/values").GenericId<"users">[], import("convex/values").VId<import("convex/values").GenericId<"users">, "required">, "required">;
        healthScore: import("convex/values").VFloat64<number, "required">;
        riskLevel: import("convex/values").VUnion<"low" | "medium" | "high" | "critical", [import("convex/values").VLiteral<"low", "required">, import("convex/values").VLiteral<"medium", "required">, import("convex/values").VLiteral<"high", "required">, import("convex/values").VLiteral<"critical", "required">], "required", never>;
        tags: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "name" | "description" | "status" | "budget" | "spentBudget" | "timeline" | "portfolioId" | "ownerId" | "teamMembers" | "healthScore" | "riskLevel" | "tags" | "createdAt" | "updatedAt" | "timeline.startDate" | "timeline.endDate" | "timeline.milestones">, {
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
        totalBudget: number;
        allocatedBudget: number;
        resourceAllocation: {
            teamMembers: number;
            budgetUtilization: number;
            projectCount: number;
        };
    }, {
        name: import("convex/values").VString<string, "required">;
        description: import("convex/values").VString<string, "required">;
        ownerId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        healthScore: import("convex/values").VFloat64<number, "required">;
        totalBudget: import("convex/values").VFloat64<number, "required">;
        allocatedBudget: import("convex/values").VFloat64<number, "required">;
        resourceAllocation: import("convex/values").VObject<{
            teamMembers: number;
            budgetUtilization: number;
            projectCount: number;
        }, {
            teamMembers: import("convex/values").VFloat64<number, "required">;
            budgetUtilization: import("convex/values").VFloat64<number, "required">;
            projectCount: import("convex/values").VFloat64<number, "required">;
        }, "required", "teamMembers" | "budgetUtilization" | "projectCount">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "name" | "description" | "ownerId" | "healthScore" | "createdAt" | "updatedAt" | "totalBudget" | "allocatedBudget" | "resourceAllocation" | "resourceAllocation.teamMembers" | "resourceAllocation.budgetUtilization" | "resourceAllocation.projectCount">, {
        by_owner: ["ownerId", "_creationTime"];
        by_health_score: ["healthScore", "_creationTime"];
    }, {}, {}>;
    risks: import("convex/server").TableDefinition<import("convex/values").VObject<{
        mitigationPlan?: string | undefined;
        description: string;
        status: "identified" | "monitored" | "mitigated" | "resolved";
        createdAt: number;
        updatedAt: number;
        projectId: import("convex/values").GenericId<"projects">;
        title: string;
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
    }, "required", "description" | "status" | "createdAt" | "updatedAt" | "projectId" | "title" | "severity" | "probability" | "impact" | "mitigationPlan">, {
        by_project: ["projectId", "_creationTime"];
        by_severity: ["severity", "_creationTime"];
        by_status: ["status", "_creationTime"];
    }, {}, {}>;
    users: import("convex/server").TableDefinition<import("convex/values").VObject<{
        email: string;
        name: string;
        createdAt: number;
        updatedAt: number;
        role: "executive" | "portfolio_manager" | "project_officer";
        department: string;
    }, {
        name: import("convex/values").VString<string, "required">;
        email: import("convex/values").VString<string, "required">;
        role: import("convex/values").VUnion<"executive" | "portfolio_manager" | "project_officer", [import("convex/values").VLiteral<"executive", "required">, import("convex/values").VLiteral<"portfolio_manager", "required">, import("convex/values").VLiteral<"project_officer", "required">], "required", never>;
        department: import("convex/values").VString<string, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "email" | "name" | "createdAt" | "updatedAt" | "role" | "department">, {
        by_email: ["email", "_creationTime"];
        by_role: ["role", "_creationTime"];
    }, {}, {}>;
}, true>;
export default _default;
//# sourceMappingURL=schema.d.ts.map
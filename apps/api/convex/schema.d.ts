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
                name: string;
                status: string;
                date: number;
            }[];
        }, {
            startDate: import("convex/values").VFloat64<number, "required">;
            endDate: import("convex/values").VFloat64<number, "required">;
            milestones: import("convex/values").VArray<{
                name: string;
                status: string;
                date: number;
            }[], import("convex/values").VObject<{
                name: string;
                status: string;
                date: number;
            }, {
                name: import("convex/values").VString<string, "required">;
                date: import("convex/values").VFloat64<number, "required">;
                status: import("convex/values").VString<string, "required">;
            }, "required", "name" | "status" | "date">, "required">;
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
        name: string;
        createdAt: number;
        updatedAt: number;
        email: string;
        role: "executive" | "portfolio_manager" | "project_officer";
        department: string;
    }, {
        name: import("convex/values").VString<string, "required">;
        email: import("convex/values").VString<string, "required">;
        role: import("convex/values").VUnion<"executive" | "portfolio_manager" | "project_officer", [import("convex/values").VLiteral<"executive", "required">, import("convex/values").VLiteral<"portfolio_manager", "required">, import("convex/values").VLiteral<"project_officer", "required">], "required", never>;
        department: import("convex/values").VString<string, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "name" | "createdAt" | "updatedAt" | "email" | "role" | "department">, {
        by_email: ["email", "_creationTime"];
        by_role: ["role", "_creationTime"];
    }, {}, {}>;
    pmiStandards: import("convex/server").TableDefinition<import("convex/values").VObject<{
        name: string;
        description: string;
        createdAt: number;
        updatedAt: number;
        category: "portfolio" | "program" | "project";
        level: "foundational" | "intermediate" | "advanced";
        weight: number;
        version: string;
        isActive: boolean;
    }, {
        name: import("convex/values").VString<string, "required">;
        description: import("convex/values").VString<string, "required">;
        category: import("convex/values").VUnion<"portfolio" | "program" | "project", [import("convex/values").VLiteral<"portfolio", "required">, import("convex/values").VLiteral<"program", "required">, import("convex/values").VLiteral<"project", "required">], "required", never>;
        level: import("convex/values").VUnion<"foundational" | "intermediate" | "advanced", [import("convex/values").VLiteral<"foundational", "required">, import("convex/values").VLiteral<"intermediate", "required">, import("convex/values").VLiteral<"advanced", "required">], "required", never>;
        weight: import("convex/values").VFloat64<number, "required">;
        version: import("convex/values").VString<string, "required">;
        isActive: import("convex/values").VBoolean<boolean, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "name" | "description" | "createdAt" | "updatedAt" | "category" | "level" | "weight" | "version" | "isActive">, {
        by_category: ["category", "_creationTime"];
        by_level: ["level", "_creationTime"];
        by_active: ["isActive", "_creationTime"];
        by_version: ["version", "_creationTime"];
    }, {}, {}>;
    pmiStandardCriteria: import("convex/server").TableDefinition<import("convex/values").VObject<{
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
    }, {
        standardId: import("convex/values").VId<import("convex/values").GenericId<"pmiStandards">, "required">;
        name: import("convex/values").VString<string, "required">;
        description: import("convex/values").VString<string, "required">;
        requirement: import("convex/values").VString<string, "required">;
        evidenceType: import("convex/values").VUnion<"document" | "link" | "text" | "file", [import("convex/values").VLiteral<"document", "required">, import("convex/values").VLiteral<"link", "required">, import("convex/values").VLiteral<"text", "required">, import("convex/values").VLiteral<"file", "required">], "required", never>;
        evidenceDescription: import("convex/values").VString<string, "required">;
        scoringMethod: import("convex/values").VUnion<"binary" | "partial" | "scale", [import("convex/values").VLiteral<"binary", "required">, import("convex/values").VLiteral<"partial", "required">, import("convex/values").VLiteral<"scale", "required">], "required", never>;
        maxScore: import("convex/values").VFloat64<number, "required">;
        isMandatory: import("convex/values").VBoolean<boolean, "required">;
        order: import("convex/values").VFloat64<number, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "name" | "description" | "createdAt" | "updatedAt" | "standardId" | "requirement" | "evidenceType" | "evidenceDescription" | "scoringMethod" | "maxScore" | "isMandatory" | "order">, {
        by_standard: ["standardId", "_creationTime"];
        by_order: ["order", "_creationTime"];
        by_mandatory: ["isMandatory", "_creationTime"];
    }, {}, {}>;
    projectCompliance: import("convex/server").TableDefinition<import("convex/values").VObject<{
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
    }, {
        projectId: import("convex/values").VId<import("convex/values").GenericId<"projects">, "required">;
        standardId: import("convex/values").VId<import("convex/values").GenericId<"pmiStandards">, "required">;
        criteriaId: import("convex/values").VId<import("convex/values").GenericId<"pmiStandardCriteria">, "required">;
        status: import("convex/values").VUnion<"not_started" | "in_progress" | "submitted" | "approved" | "rejected", [import("convex/values").VLiteral<"not_started", "required">, import("convex/values").VLiteral<"in_progress", "required">, import("convex/values").VLiteral<"submitted", "required">, import("convex/values").VLiteral<"approved", "required">, import("convex/values").VLiteral<"rejected", "required">], "required", never>;
        score: import("convex/values").VFloat64<number, "required">;
        evidence: import("convex/values").VString<string | undefined, "optional">;
        evidenceUrl: import("convex/values").VString<string | undefined, "optional">;
        reviewerId: import("convex/values").VId<import("convex/values").GenericId<"users"> | undefined, "optional">;
        reviewedAt: import("convex/values").VFloat64<number | undefined, "optional">;
        submittedAt: import("convex/values").VFloat64<number | undefined, "optional">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "status" | "createdAt" | "updatedAt" | "projectId" | "standardId" | "criteriaId" | "score" | "evidence" | "evidenceUrl" | "reviewerId" | "reviewedAt" | "submittedAt">, {
        by_project: ["projectId", "_creationTime"];
        by_standard: ["standardId", "_creationTime"];
        by_criteria: ["criteriaId", "_creationTime"];
        by_status: ["status", "_creationTime"];
        by_reviewer: ["reviewerId", "_creationTime"];
    }, {}, {}>;
    complianceEvaluations: import("convex/server").TableDefinition<import("convex/values").VObject<{
        notes?: string | undefined;
        createdAt: number;
        projectId: import("convex/values").GenericId<"projects">;
        standardId: import("convex/values").GenericId<"pmiStandards">;
        overallScore: number;
        evaluatedAt: number;
        evaluatorId: import("convex/values").GenericId<"users">;
    }, {
        projectId: import("convex/values").VId<import("convex/values").GenericId<"projects">, "required">;
        standardId: import("convex/values").VId<import("convex/values").GenericId<"pmiStandards">, "required">;
        overallScore: import("convex/values").VFloat64<number, "required">;
        evaluatedAt: import("convex/values").VFloat64<number, "required">;
        evaluatorId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        notes: import("convex/values").VString<string | undefined, "optional">;
        createdAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "createdAt" | "projectId" | "standardId" | "overallScore" | "evaluatedAt" | "evaluatorId" | "notes">, {
        by_project: ["projectId", "_creationTime"];
        by_standard: ["standardId", "_creationTime"];
        by_evaluated_at: ["evaluatedAt", "_creationTime"];
    }, {}, {}>;
    complianceSchedules: import("convex/server").TableDefinition<import("convex/values").VObject<{
        createdAt: number;
        updatedAt: number;
        isActive: boolean;
        frequency: "daily" | "weekly" | "monthly";
        portfolioIds: import("convex/values").GenericId<"portfolios">[];
        standardIds: import("convex/values").GenericId<"pmiStandards">[];
        nextEvaluationTime: number;
    }, {
        frequency: import("convex/values").VUnion<"daily" | "weekly" | "monthly", [import("convex/values").VLiteral<"daily", "required">, import("convex/values").VLiteral<"weekly", "required">, import("convex/values").VLiteral<"monthly", "required">], "required", never>;
        portfolioIds: import("convex/values").VArray<import("convex/values").GenericId<"portfolios">[], import("convex/values").VId<import("convex/values").GenericId<"portfolios">, "required">, "required">;
        standardIds: import("convex/values").VArray<import("convex/values").GenericId<"pmiStandards">[], import("convex/values").VId<import("convex/values").GenericId<"pmiStandards">, "required">, "required">;
        nextEvaluationTime: import("convex/values").VFloat64<number, "required">;
        isActive: import("convex/values").VBoolean<boolean, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "createdAt" | "updatedAt" | "isActive" | "frequency" | "portfolioIds" | "standardIds" | "nextEvaluationTime">, {
        by_next_evaluation: ["nextEvaluationTime", "_creationTime"];
        by_active: ["isActive", "_creationTime"];
    }, {}, {}>;
    complianceNotifications: import("convex/server").TableDefinition<import("convex/values").VObject<{
        createdAt: number;
        projectId: import("convex/values").GenericId<"projects">;
        severity: "low" | "medium" | "high" | "critical";
        standardId: import("convex/values").GenericId<"pmiStandards">;
        recipientId: import("convex/values").GenericId<"users">;
        alertType: "non_compliant" | "declining_trend" | "missing_evidence" | "overdue_evaluation";
        message: string;
        isRead: boolean;
    }, {
        recipientId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        projectId: import("convex/values").VId<import("convex/values").GenericId<"projects">, "required">;
        standardId: import("convex/values").VId<import("convex/values").GenericId<"pmiStandards">, "required">;
        alertType: import("convex/values").VUnion<"non_compliant" | "declining_trend" | "missing_evidence" | "overdue_evaluation", [import("convex/values").VLiteral<"non_compliant", "required">, import("convex/values").VLiteral<"declining_trend", "required">, import("convex/values").VLiteral<"missing_evidence", "required">, import("convex/values").VLiteral<"overdue_evaluation", "required">], "required", never>;
        severity: import("convex/values").VUnion<"low" | "medium" | "high" | "critical", [import("convex/values").VLiteral<"low", "required">, import("convex/values").VLiteral<"medium", "required">, import("convex/values").VLiteral<"high", "required">, import("convex/values").VLiteral<"critical", "required">], "required", never>;
        message: import("convex/values").VString<string, "required">;
        isRead: import("convex/values").VBoolean<boolean, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "createdAt" | "projectId" | "severity" | "standardId" | "recipientId" | "alertType" | "message" | "isRead">, {
        by_recipient: ["recipientId", "_creationTime"];
        by_project: ["projectId", "_creationTime"];
        by_created_at: ["createdAt", "_creationTime"];
        by_read_status: ["isRead", "_creationTime"];
    }, {}, {}>;
    evidence: import("convex/server").TableDefinition<import("convex/values").VObject<{
        description?: string | undefined;
        reviewedAt?: number | undefined;
        submittedAt?: number | undefined;
        fileSize?: number | undefined;
        mimeType?: string | undefined;
        parentEvidenceId?: import("convex/values").GenericId<"evidence"> | undefined;
        reviewedBy?: import("convex/values").GenericId<"users"> | undefined;
        reviewNotes?: string | undefined;
        status: "submitted" | "approved" | "rejected" | "draft" | "under_review" | "archived";
        tags: string[];
        createdAt: number;
        updatedAt: number;
        projectId: import("convex/values").GenericId<"projects">;
        title: string;
        version: number;
        standardId: import("convex/values").GenericId<"pmiStandards">;
        evidenceType: "document" | "link" | "text" | "file";
        criteriaId: import("convex/values").GenericId<"pmiStandardCriteria">;
        content: string;
        submittedBy: import("convex/values").GenericId<"users">;
        isLatest: boolean;
    }, {
        projectId: import("convex/values").VId<import("convex/values").GenericId<"projects">, "required">;
        criteriaId: import("convex/values").VId<import("convex/values").GenericId<"pmiStandardCriteria">, "required">;
        standardId: import("convex/values").VId<import("convex/values").GenericId<"pmiStandards">, "required">;
        title: import("convex/values").VString<string, "required">;
        description: import("convex/values").VString<string | undefined, "optional">;
        evidenceType: import("convex/values").VUnion<"document" | "link" | "text" | "file", [import("convex/values").VLiteral<"document", "required">, import("convex/values").VLiteral<"link", "required">, import("convex/values").VLiteral<"text", "required">, import("convex/values").VLiteral<"file", "required">], "required", never>;
        content: import("convex/values").VString<string, "required">;
        fileSize: import("convex/values").VFloat64<number | undefined, "optional">;
        mimeType: import("convex/values").VString<string | undefined, "optional">;
        status: import("convex/values").VUnion<"submitted" | "approved" | "rejected" | "draft" | "under_review" | "archived", [import("convex/values").VLiteral<"draft", "required">, import("convex/values").VLiteral<"submitted", "required">, import("convex/values").VLiteral<"under_review", "required">, import("convex/values").VLiteral<"approved", "required">, import("convex/values").VLiteral<"rejected", "required">, import("convex/values").VLiteral<"archived", "required">], "required", never>;
        version: import("convex/values").VFloat64<number, "required">;
        parentEvidenceId: import("convex/values").VId<import("convex/values").GenericId<"evidence"> | undefined, "optional">;
        submittedBy: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        submittedAt: import("convex/values").VFloat64<number | undefined, "optional">;
        reviewedBy: import("convex/values").VId<import("convex/values").GenericId<"users"> | undefined, "optional">;
        reviewedAt: import("convex/values").VFloat64<number | undefined, "optional">;
        reviewNotes: import("convex/values").VString<string | undefined, "optional">;
        tags: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
        isLatest: import("convex/values").VBoolean<boolean, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "description" | "status" | "tags" | "createdAt" | "updatedAt" | "projectId" | "title" | "version" | "standardId" | "evidenceType" | "criteriaId" | "reviewedAt" | "submittedAt" | "content" | "fileSize" | "mimeType" | "parentEvidenceId" | "submittedBy" | "reviewedBy" | "reviewNotes" | "isLatest">, {
        by_project: ["projectId", "_creationTime"];
        by_criteria: ["criteriaId", "_creationTime"];
        by_standard: ["standardId", "_creationTime"];
        by_status: ["status", "_creationTime"];
        by_submitted_by: ["submittedBy", "_creationTime"];
        by_reviewed_by: ["reviewedBy", "_creationTime"];
        by_version: ["version", "_creationTime"];
        by_latest: ["isLatest", "_creationTime"];
        by_created_at: ["createdAt", "_creationTime"];
    }, {}, {}>;
    evidenceBulkOperations: import("convex/server").TableDefinition<import("convex/values").VObject<{
        results?: {
            error?: string | undefined;
            status: string;
            evidenceId: import("convex/values").GenericId<"evidence">;
        }[] | undefined;
        completedAt?: number | undefined;
        status: "completed" | "pending" | "processing" | "failed";
        createdAt: number;
        projectId: import("convex/values").GenericId<"projects">;
        operationId: string;
        operationType: "upload" | "status_update" | "delete" | "archive";
        totalItems: number;
        processedItems: number;
        failedItems: number;
        initiatedBy: import("convex/values").GenericId<"users">;
        startedAt: number;
    }, {
        operationId: import("convex/values").VString<string, "required">;
        projectId: import("convex/values").VId<import("convex/values").GenericId<"projects">, "required">;
        operationType: import("convex/values").VUnion<"upload" | "status_update" | "delete" | "archive", [import("convex/values").VLiteral<"upload", "required">, import("convex/values").VLiteral<"status_update", "required">, import("convex/values").VLiteral<"delete", "required">, import("convex/values").VLiteral<"archive", "required">], "required", never>;
        status: import("convex/values").VUnion<"completed" | "pending" | "processing" | "failed", [import("convex/values").VLiteral<"pending", "required">, import("convex/values").VLiteral<"processing", "required">, import("convex/values").VLiteral<"completed", "required">, import("convex/values").VLiteral<"failed", "required">], "required", never>;
        totalItems: import("convex/values").VFloat64<number, "required">;
        processedItems: import("convex/values").VFloat64<number, "required">;
        failedItems: import("convex/values").VFloat64<number, "required">;
        results: import("convex/values").VArray<{
            error?: string | undefined;
            status: string;
            evidenceId: import("convex/values").GenericId<"evidence">;
        }[] | undefined, import("convex/values").VObject<{
            error?: string | undefined;
            status: string;
            evidenceId: import("convex/values").GenericId<"evidence">;
        }, {
            evidenceId: import("convex/values").VId<import("convex/values").GenericId<"evidence">, "required">;
            status: import("convex/values").VString<string, "required">;
            error: import("convex/values").VString<string | undefined, "optional">;
        }, "required", "status" | "evidenceId" | "error">, "optional">;
        initiatedBy: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        startedAt: import("convex/values").VFloat64<number, "required">;
        completedAt: import("convex/values").VFloat64<number | undefined, "optional">;
        createdAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "status" | "createdAt" | "projectId" | "operationId" | "operationType" | "totalItems" | "processedItems" | "failedItems" | "results" | "initiatedBy" | "startedAt" | "completedAt">, {
        by_operation_id: ["operationId", "_creationTime"];
        by_project: ["projectId", "_creationTime"];
        by_status: ["status", "_creationTime"];
        by_initiated_by: ["initiatedBy", "_creationTime"];
        by_created_at: ["createdAt", "_creationTime"];
    }, {}, {}>;
}, true>;
export default _default;
//# sourceMappingURL=schema.d.ts.map
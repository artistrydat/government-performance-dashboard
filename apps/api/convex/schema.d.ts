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
    complianceReportRequests: import("convex/server").TableDefinition<import("convex/values").VObject<{
        reportUrl?: string | undefined;
        errorMessage?: string | undefined;
        status: "completed" | "pending" | "processing" | "failed";
        createdAt: number;
        updatedAt: number;
        reportType: string;
        parameters: {
            portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
            projectId?: import("convex/values").GenericId<"projects"> | undefined;
            dateRange?: {
                startDate: number;
                endDate: number;
            } | undefined;
        };
        requestedBy: import("convex/values").GenericId<"users">;
    }, {
        reportType: import("convex/values").VString<string, "required">;
        parameters: import("convex/values").VObject<{
            portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
            projectId?: import("convex/values").GenericId<"projects"> | undefined;
            dateRange?: {
                startDate: number;
                endDate: number;
            } | undefined;
        }, {
            portfolioId: import("convex/values").VId<import("convex/values").GenericId<"portfolios"> | undefined, "optional">;
            projectId: import("convex/values").VId<import("convex/values").GenericId<"projects"> | undefined, "optional">;
            dateRange: import("convex/values").VObject<{
                startDate: number;
                endDate: number;
            } | undefined, {
                startDate: import("convex/values").VFloat64<number, "required">;
                endDate: import("convex/values").VFloat64<number, "required">;
            }, "optional", "startDate" | "endDate">;
        }, "required", "portfolioId" | "projectId" | "dateRange" | "dateRange.startDate" | "dateRange.endDate">;
        requestedBy: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        status: import("convex/values").VUnion<"completed" | "pending" | "processing" | "failed", [import("convex/values").VLiteral<"pending", "required">, import("convex/values").VLiteral<"processing", "required">, import("convex/values").VLiteral<"completed", "required">, import("convex/values").VLiteral<"failed", "required">], "required", never>;
        reportUrl: import("convex/values").VString<string | undefined, "optional">;
        errorMessage: import("convex/values").VString<string | undefined, "optional">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "status" | "createdAt" | "updatedAt" | "reportType" | "parameters" | "requestedBy" | "reportUrl" | "errorMessage" | "parameters.portfolioId" | "parameters.projectId" | "parameters.dateRange" | "parameters.dateRange.startDate" | "parameters.dateRange.endDate">, {
        by_requested_by: ["requestedBy", "_creationTime"];
        by_status: ["status", "_creationTime"];
        by_created_at: ["createdAt", "_creationTime"];
    }, {}, {}>;
    complianceReportSchedules: import("convex/server").TableDefinition<import("convex/values").VObject<{
        createdAt: number;
        updatedAt: number;
        isActive: boolean;
        frequency: "daily" | "weekly" | "monthly";
        reportType: string;
        parameters: {
            portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
            projectId?: import("convex/values").GenericId<"projects"> | undefined;
        };
        recipients: import("convex/values").GenericId<"users">[];
        nextRunTime: number;
        scheduledBy: import("convex/values").GenericId<"users">;
    }, {
        reportType: import("convex/values").VString<string, "required">;
        frequency: import("convex/values").VUnion<"daily" | "weekly" | "monthly", [import("convex/values").VLiteral<"daily", "required">, import("convex/values").VLiteral<"weekly", "required">, import("convex/values").VLiteral<"monthly", "required">], "required", never>;
        recipients: import("convex/values").VArray<import("convex/values").GenericId<"users">[], import("convex/values").VId<import("convex/values").GenericId<"users">, "required">, "required">;
        parameters: import("convex/values").VObject<{
            portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
            projectId?: import("convex/values").GenericId<"projects"> | undefined;
        }, {
            portfolioId: import("convex/values").VId<import("convex/values").GenericId<"portfolios"> | undefined, "optional">;
            projectId: import("convex/values").VId<import("convex/values").GenericId<"projects"> | undefined, "optional">;
        }, "required", "portfolioId" | "projectId">;
        nextRunTime: import("convex/values").VFloat64<number, "required">;
        isActive: import("convex/values").VBoolean<boolean, "required">;
        scheduledBy: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "createdAt" | "updatedAt" | "isActive" | "frequency" | "reportType" | "parameters" | "parameters.portfolioId" | "parameters.projectId" | "recipients" | "nextRunTime" | "scheduledBy">, {
        by_next_run_time: ["nextRunTime", "_creationTime"];
        by_active: ["isActive", "_creationTime"];
        by_scheduled_by: ["scheduledBy", "_creationTime"];
    }, {}, {}>;
    customRules: import("convex/server").TableDefinition<import("convex/values").VObject<{
        templateId?: string | undefined;
        name: string;
        description: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        isActive: boolean;
        ruleType: "validation" | "scoring" | "workflow";
        condition: {
            logicalOperator?: "and" | "or" | undefined;
            conditions?: any[] | undefined;
            field: string;
            operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "in" | "not_in";
            value: any;
        };
        action: {
            type: "set_score" | "set_status" | "send_notification" | "trigger_workflow" | "log_event";
            parameters: {
                status?: string | undefined;
                score?: number | undefined;
                message?: string | undefined;
                notificationType?: string | undefined;
                workflowId?: string | undefined;
            };
        };
        targetEntity: "portfolio" | "project" | "evidence" | "standard";
        createdBy: import("convex/values").GenericId<"users">;
    }, {
        name: import("convex/values").VString<string, "required">;
        description: import("convex/values").VString<string, "required">;
        ruleType: import("convex/values").VUnion<"validation" | "scoring" | "workflow", [import("convex/values").VLiteral<"validation", "required">, import("convex/values").VLiteral<"scoring", "required">, import("convex/values").VLiteral<"workflow", "required">], "required", never>;
        condition: import("convex/values").VObject<{
            logicalOperator?: "and" | "or" | undefined;
            conditions?: any[] | undefined;
            field: string;
            operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "in" | "not_in";
            value: any;
        }, {
            field: import("convex/values").VString<string, "required">;
            operator: import("convex/values").VUnion<"equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "in" | "not_in", [import("convex/values").VLiteral<"equals", "required">, import("convex/values").VLiteral<"not_equals", "required">, import("convex/values").VLiteral<"contains", "required">, import("convex/values").VLiteral<"greater_than", "required">, import("convex/values").VLiteral<"less_than", "required">, import("convex/values").VLiteral<"in", "required">, import("convex/values").VLiteral<"not_in", "required">], "required", never>;
            value: import("convex/values").VAny<any, "required", string>;
            logicalOperator: import("convex/values").VUnion<"and" | "or" | undefined, [import("convex/values").VLiteral<"and", "required">, import("convex/values").VLiteral<"or", "required">], "optional", never>;
            conditions: import("convex/values").VArray<any[] | undefined, import("convex/values").VAny<any, "required", string>, "optional">;
        }, "required", "field" | "operator" | "value" | "logicalOperator" | "conditions" | `value.${string}`>;
        action: import("convex/values").VObject<{
            type: "set_score" | "set_status" | "send_notification" | "trigger_workflow" | "log_event";
            parameters: {
                status?: string | undefined;
                score?: number | undefined;
                message?: string | undefined;
                notificationType?: string | undefined;
                workflowId?: string | undefined;
            };
        }, {
            type: import("convex/values").VUnion<"set_score" | "set_status" | "send_notification" | "trigger_workflow" | "log_event", [import("convex/values").VLiteral<"set_score", "required">, import("convex/values").VLiteral<"set_status", "required">, import("convex/values").VLiteral<"send_notification", "required">, import("convex/values").VLiteral<"trigger_workflow", "required">, import("convex/values").VLiteral<"log_event", "required">], "required", never>;
            parameters: import("convex/values").VObject<{
                status?: string | undefined;
                score?: number | undefined;
                message?: string | undefined;
                notificationType?: string | undefined;
                workflowId?: string | undefined;
            }, {
                score: import("convex/values").VFloat64<number | undefined, "optional">;
                status: import("convex/values").VString<string | undefined, "optional">;
                notificationType: import("convex/values").VString<string | undefined, "optional">;
                workflowId: import("convex/values").VString<string | undefined, "optional">;
                message: import("convex/values").VString<string | undefined, "optional">;
            }, "required", "status" | "score" | "message" | "notificationType" | "workflowId">;
        }, "required", "type" | "parameters" | "parameters.status" | "parameters.score" | "parameters.message" | "parameters.notificationType" | "parameters.workflowId">;
        targetEntity: import("convex/values").VUnion<"portfolio" | "project" | "evidence" | "standard", [import("convex/values").VLiteral<"project", "required">, import("convex/values").VLiteral<"portfolio", "required">, import("convex/values").VLiteral<"standard", "required">, import("convex/values").VLiteral<"evidence", "required">], "required", never>;
        isActive: import("convex/values").VBoolean<boolean, "required">;
        version: import("convex/values").VFloat64<number, "required">;
        templateId: import("convex/values").VString<string | undefined, "optional">;
        createdBy: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "name" | "description" | "createdAt" | "updatedAt" | "version" | "isActive" | "ruleType" | "condition" | "action" | "targetEntity" | "templateId" | "createdBy" | "condition.field" | "condition.operator" | "condition.value" | "condition.logicalOperator" | "condition.conditions" | `condition.value.${string}` | "action.type" | "action.parameters" | "action.parameters.status" | "action.parameters.score" | "action.parameters.message" | "action.parameters.notificationType" | "action.parameters.workflowId">, {
        by_target_entity: ["targetEntity", "_creationTime"];
        by_rule_type: ["ruleType", "_creationTime"];
        by_active: ["isActive", "_creationTime"];
        by_created_by: ["createdBy", "_creationTime"];
        by_created_at: ["createdAt", "_creationTime"];
    }, {}, {}>;
    ruleTemplates: import("convex/server").TableDefinition<import("convex/values").VObject<{
        name: string;
        description: string;
        createdAt: number;
        updatedAt: number;
        isActive: boolean;
        ruleType: "validation" | "scoring" | "workflow";
        condition: {
            logicalOperator?: "and" | "or" | undefined;
            conditions?: any[] | undefined;
            field: string;
            operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "in" | "not_in";
            value: any;
        };
        action: {
            type: "set_score" | "set_status" | "send_notification" | "trigger_workflow" | "log_event";
            parameters: {
                status?: string | undefined;
                score?: number | undefined;
                message?: string | undefined;
                notificationType?: string | undefined;
                workflowId?: string | undefined;
            };
        };
        targetEntity: "portfolio" | "project" | "evidence" | "standard";
        createdBy: import("convex/values").GenericId<"users">;
        usageCount: number;
    }, {
        name: import("convex/values").VString<string, "required">;
        description: import("convex/values").VString<string, "required">;
        ruleType: import("convex/values").VUnion<"validation" | "scoring" | "workflow", [import("convex/values").VLiteral<"validation", "required">, import("convex/values").VLiteral<"scoring", "required">, import("convex/values").VLiteral<"workflow", "required">], "required", never>;
        condition: import("convex/values").VObject<{
            logicalOperator?: "and" | "or" | undefined;
            conditions?: any[] | undefined;
            field: string;
            operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "in" | "not_in";
            value: any;
        }, {
            field: import("convex/values").VString<string, "required">;
            operator: import("convex/values").VUnion<"equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "in" | "not_in", [import("convex/values").VLiteral<"equals", "required">, import("convex/values").VLiteral<"not_equals", "required">, import("convex/values").VLiteral<"contains", "required">, import("convex/values").VLiteral<"greater_than", "required">, import("convex/values").VLiteral<"less_than", "required">, import("convex/values").VLiteral<"in", "required">, import("convex/values").VLiteral<"not_in", "required">], "required", never>;
            value: import("convex/values").VAny<any, "required", string>;
            logicalOperator: import("convex/values").VUnion<"and" | "or" | undefined, [import("convex/values").VLiteral<"and", "required">, import("convex/values").VLiteral<"or", "required">], "optional", never>;
            conditions: import("convex/values").VArray<any[] | undefined, import("convex/values").VAny<any, "required", string>, "optional">;
        }, "required", "field" | "operator" | "value" | "logicalOperator" | "conditions" | `value.${string}`>;
        action: import("convex/values").VObject<{
            type: "set_score" | "set_status" | "send_notification" | "trigger_workflow" | "log_event";
            parameters: {
                status?: string | undefined;
                score?: number | undefined;
                message?: string | undefined;
                notificationType?: string | undefined;
                workflowId?: string | undefined;
            };
        }, {
            type: import("convex/values").VUnion<"set_score" | "set_status" | "send_notification" | "trigger_workflow" | "log_event", [import("convex/values").VLiteral<"set_score", "required">, import("convex/values").VLiteral<"set_status", "required">, import("convex/values").VLiteral<"send_notification", "required">, import("convex/values").VLiteral<"trigger_workflow", "required">, import("convex/values").VLiteral<"log_event", "required">], "required", never>;
            parameters: import("convex/values").VObject<{
                status?: string | undefined;
                score?: number | undefined;
                message?: string | undefined;
                notificationType?: string | undefined;
                workflowId?: string | undefined;
            }, {
                score: import("convex/values").VFloat64<number | undefined, "optional">;
                status: import("convex/values").VString<string | undefined, "optional">;
                notificationType: import("convex/values").VString<string | undefined, "optional">;
                workflowId: import("convex/values").VString<string | undefined, "optional">;
                message: import("convex/values").VString<string | undefined, "optional">;
            }, "required", "status" | "score" | "message" | "notificationType" | "workflowId">;
        }, "required", "type" | "parameters" | "parameters.status" | "parameters.score" | "parameters.message" | "parameters.notificationType" | "parameters.workflowId">;
        targetEntity: import("convex/values").VUnion<"portfolio" | "project" | "evidence" | "standard", [import("convex/values").VLiteral<"project", "required">, import("convex/values").VLiteral<"portfolio", "required">, import("convex/values").VLiteral<"standard", "required">, import("convex/values").VLiteral<"evidence", "required">], "required", never>;
        isActive: import("convex/values").VBoolean<boolean, "required">;
        usageCount: import("convex/values").VFloat64<number, "required">;
        createdBy: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "name" | "description" | "createdAt" | "updatedAt" | "isActive" | "ruleType" | "condition" | "action" | "targetEntity" | "createdBy" | "condition.field" | "condition.operator" | "condition.value" | "condition.logicalOperator" | "condition.conditions" | `condition.value.${string}` | "action.type" | "action.parameters" | "action.parameters.status" | "action.parameters.score" | "action.parameters.message" | "action.parameters.notificationType" | "action.parameters.workflowId" | "usageCount">, {
        by_target_entity: ["targetEntity", "_creationTime"];
        by_rule_type: ["ruleType", "_creationTime"];
        by_active: ["isActive", "_creationTime"];
        by_created_by: ["createdBy", "_creationTime"];
    }, {}, {}>;
    complianceWorkflows: import("convex/server").TableDefinition<import("convex/values").VObject<{
        triggerRuleId?: import("convex/values").GenericId<"customRules"> | undefined;
        name: string;
        description: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        isActive: boolean;
        targetEntity: "portfolio" | "project" | "evidence" | "standard";
        createdBy: import("convex/values").GenericId<"users">;
        triggerType: "evidence_submission" | "compliance_evaluation" | "schedule" | "manual";
        steps: {
            conditions?: any[] | undefined;
            assigneeRole?: string | undefined;
            assigneeId?: import("convex/values").GenericId<"users"> | undefined;
            dueDateOffset?: number | undefined;
            escalationAfter?: number | undefined;
            escalationTo?: import("convex/values").GenericId<"users"> | undefined;
            actions?: any[] | undefined;
            nextStepId?: string | undefined;
            name: string;
            type: "evidence_request" | "approval" | "notification" | "escalation" | "condition_check";
            stepId: string;
        }[];
    }, {
        name: import("convex/values").VString<string, "required">;
        description: import("convex/values").VString<string, "required">;
        triggerType: import("convex/values").VUnion<"evidence_submission" | "compliance_evaluation" | "schedule" | "manual", [import("convex/values").VLiteral<"evidence_submission", "required">, import("convex/values").VLiteral<"compliance_evaluation", "required">, import("convex/values").VLiteral<"schedule", "required">, import("convex/values").VLiteral<"manual", "required">], "required", never>;
        triggerRuleId: import("convex/values").VId<import("convex/values").GenericId<"customRules"> | undefined, "optional">;
        targetEntity: import("convex/values").VUnion<"portfolio" | "project" | "evidence" | "standard", [import("convex/values").VLiteral<"project", "required">, import("convex/values").VLiteral<"portfolio", "required">, import("convex/values").VLiteral<"standard", "required">, import("convex/values").VLiteral<"evidence", "required">], "required", never>;
        steps: import("convex/values").VArray<{
            conditions?: any[] | undefined;
            assigneeRole?: string | undefined;
            assigneeId?: import("convex/values").GenericId<"users"> | undefined;
            dueDateOffset?: number | undefined;
            escalationAfter?: number | undefined;
            escalationTo?: import("convex/values").GenericId<"users"> | undefined;
            actions?: any[] | undefined;
            nextStepId?: string | undefined;
            name: string;
            type: "evidence_request" | "approval" | "notification" | "escalation" | "condition_check";
            stepId: string;
        }[], import("convex/values").VObject<{
            conditions?: any[] | undefined;
            assigneeRole?: string | undefined;
            assigneeId?: import("convex/values").GenericId<"users"> | undefined;
            dueDateOffset?: number | undefined;
            escalationAfter?: number | undefined;
            escalationTo?: import("convex/values").GenericId<"users"> | undefined;
            actions?: any[] | undefined;
            nextStepId?: string | undefined;
            name: string;
            type: "evidence_request" | "approval" | "notification" | "escalation" | "condition_check";
            stepId: string;
        }, {
            stepId: import("convex/values").VString<string, "required">;
            name: import("convex/values").VString<string, "required">;
            type: import("convex/values").VUnion<"evidence_request" | "approval" | "notification" | "escalation" | "condition_check", [import("convex/values").VLiteral<"evidence_request", "required">, import("convex/values").VLiteral<"approval", "required">, import("convex/values").VLiteral<"notification", "required">, import("convex/values").VLiteral<"escalation", "required">, import("convex/values").VLiteral<"condition_check", "required">], "required", never>;
            assigneeRole: import("convex/values").VString<string | undefined, "optional">;
            assigneeId: import("convex/values").VId<import("convex/values").GenericId<"users"> | undefined, "optional">;
            dueDateOffset: import("convex/values").VFloat64<number | undefined, "optional">;
            escalationAfter: import("convex/values").VFloat64<number | undefined, "optional">;
            escalationTo: import("convex/values").VId<import("convex/values").GenericId<"users"> | undefined, "optional">;
            conditions: import("convex/values").VArray<any[] | undefined, import("convex/values").VAny<any, "required", string>, "optional">;
            actions: import("convex/values").VArray<any[] | undefined, import("convex/values").VAny<any, "required", string>, "optional">;
            nextStepId: import("convex/values").VString<string | undefined, "optional">;
        }, "required", "name" | "type" | "conditions" | "stepId" | "assigneeRole" | "assigneeId" | "dueDateOffset" | "escalationAfter" | "escalationTo" | "actions" | "nextStepId">, "required">;
        isActive: import("convex/values").VBoolean<boolean, "required">;
        version: import("convex/values").VFloat64<number, "required">;
        createdBy: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "name" | "description" | "createdAt" | "updatedAt" | "version" | "isActive" | "targetEntity" | "createdBy" | "triggerType" | "triggerRuleId" | "steps">, {
        by_trigger_type: ["triggerType", "_creationTime"];
        by_target_entity: ["targetEntity", "_creationTime"];
        by_active: ["isActive", "_creationTime"];
        by_created_by: ["createdBy", "_creationTime"];
        by_created_at: ["createdAt", "_creationTime"];
    }, {}, {}>;
    workflowInstances: import("convex/server").TableDefinition<import("convex/values").VObject<{
        completedAt?: number | undefined;
        currentAssignee?: import("convex/values").GenericId<"users"> | undefined;
        nextDueDate?: number | undefined;
        metadata?: any;
        status: "active" | "completed" | "paused" | "cancelled" | "escalated";
        createdAt: number;
        updatedAt: number;
        startedAt: number;
        workflowId: import("convex/values").GenericId<"complianceWorkflows">;
        entityId: string;
        currentStepId: string;
        startedBy: import("convex/values").GenericId<"users">;
        escalationLevel: number;
    }, {
        workflowId: import("convex/values").VId<import("convex/values").GenericId<"complianceWorkflows">, "required">;
        entityId: import("convex/values").VString<string, "required">;
        currentStepId: import("convex/values").VString<string, "required">;
        status: import("convex/values").VUnion<"active" | "completed" | "paused" | "cancelled" | "escalated", [import("convex/values").VLiteral<"active", "required">, import("convex/values").VLiteral<"paused", "required">, import("convex/values").VLiteral<"completed", "required">, import("convex/values").VLiteral<"cancelled", "required">, import("convex/values").VLiteral<"escalated", "required">], "required", never>;
        startedBy: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        startedAt: import("convex/values").VFloat64<number, "required">;
        completedAt: import("convex/values").VFloat64<number | undefined, "optional">;
        currentAssignee: import("convex/values").VId<import("convex/values").GenericId<"users"> | undefined, "optional">;
        nextDueDate: import("convex/values").VFloat64<number | undefined, "optional">;
        escalationLevel: import("convex/values").VFloat64<number, "required">;
        metadata: import("convex/values").VAny<any, "optional", string>;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "status" | "createdAt" | "updatedAt" | "startedAt" | "completedAt" | "workflowId" | "entityId" | "currentStepId" | "startedBy" | "currentAssignee" | "nextDueDate" | "escalationLevel" | "metadata" | `metadata.${string}`>, {
        by_workflow: ["workflowId", "_creationTime"];
        by_entity: ["entityId", "_creationTime"];
        by_status: ["status", "_creationTime"];
        by_current_assignee: ["currentAssignee", "_creationTime"];
        by_next_due_date: ["nextDueDate", "_creationTime"];
        by_created_at: ["createdAt", "_creationTime"];
    }, {}, {}>;
    workflowSteps: import("convex/server").TableDefinition<import("convex/values").VObject<{
        notes?: string | undefined;
        completedAt?: number | undefined;
        assigneeId?: import("convex/values").GenericId<"users"> | undefined;
        metadata?: any;
        dueDate?: number | undefined;
        completedBy?: import("convex/values").GenericId<"users"> | undefined;
        status: "completed" | "in_progress" | "pending" | "escalated" | "skipped";
        createdAt: number;
        updatedAt: number;
        stepId: string;
        instanceId: import("convex/values").GenericId<"workflowInstances">;
        stepName: string;
        stepType: "evidence_request" | "approval" | "notification" | "escalation" | "condition_check";
    }, {
        instanceId: import("convex/values").VId<import("convex/values").GenericId<"workflowInstances">, "required">;
        stepId: import("convex/values").VString<string, "required">;
        stepName: import("convex/values").VString<string, "required">;
        stepType: import("convex/values").VUnion<"evidence_request" | "approval" | "notification" | "escalation" | "condition_check", [import("convex/values").VLiteral<"evidence_request", "required">, import("convex/values").VLiteral<"approval", "required">, import("convex/values").VLiteral<"notification", "required">, import("convex/values").VLiteral<"escalation", "required">, import("convex/values").VLiteral<"condition_check", "required">], "required", never>;
        assigneeId: import("convex/values").VId<import("convex/values").GenericId<"users"> | undefined, "optional">;
        status: import("convex/values").VUnion<"completed" | "in_progress" | "pending" | "escalated" | "skipped", [import("convex/values").VLiteral<"pending", "required">, import("convex/values").VLiteral<"in_progress", "required">, import("convex/values").VLiteral<"completed", "required">, import("convex/values").VLiteral<"escalated", "required">, import("convex/values").VLiteral<"skipped", "required">], "required", never>;
        dueDate: import("convex/values").VFloat64<number | undefined, "optional">;
        completedAt: import("convex/values").VFloat64<number | undefined, "optional">;
        completedBy: import("convex/values").VId<import("convex/values").GenericId<"users"> | undefined, "optional">;
        notes: import("convex/values").VString<string | undefined, "optional">;
        metadata: import("convex/values").VAny<any, "optional", string>;
        createdAt: import("convex/values").VFloat64<number, "required">;
        updatedAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "status" | "createdAt" | "updatedAt" | "notes" | "completedAt" | "stepId" | "assigneeId" | "metadata" | `metadata.${string}` | "instanceId" | "stepName" | "stepType" | "dueDate" | "completedBy">, {
        by_instance: ["instanceId", "_creationTime"];
        by_step_id: ["stepId", "_creationTime"];
        by_status: ["status", "_creationTime"];
        by_assignee: ["assigneeId", "_creationTime"];
        by_due_date: ["dueDate", "_creationTime"];
    }, {}, {}>;
    workflowEscalations: import("convex/server").TableDefinition<import("convex/values").VObject<{
        createdAt: number;
        stepId: string;
        escalationLevel: number;
        instanceId: import("convex/values").GenericId<"workflowInstances">;
        escalatedFrom: import("convex/values").GenericId<"users">;
        escalatedTo: import("convex/values").GenericId<"users">;
        reason: string;
    }, {
        instanceId: import("convex/values").VId<import("convex/values").GenericId<"workflowInstances">, "required">;
        stepId: import("convex/values").VString<string, "required">;
        escalatedFrom: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        escalatedTo: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
        reason: import("convex/values").VString<string, "required">;
        escalationLevel: import("convex/values").VFloat64<number, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "createdAt" | "stepId" | "escalationLevel" | "instanceId" | "escalatedFrom" | "escalatedTo" | "reason">, {
        by_instance: ["instanceId", "_creationTime"];
        by_step: ["stepId", "_creationTime"];
        by_escalated_to: ["escalatedTo", "_creationTime"];
        by_created_at: ["createdAt", "_creationTime"];
    }, {}, {}>;
    workflowAnalytics: import("convex/server").TableDefinition<import("convex/values").VObject<{
        createdAt: number;
        workflowId: import("convex/values").GenericId<"complianceWorkflows">;
        instanceCount: number;
        averageCompletionTime: number;
        escalationRate: number;
        stepCompletionRates: {
            stepId: string;
            completionRate: number;
            averageTime: number;
        }[];
        periodStart: number;
        periodEnd: number;
    }, {
        workflowId: import("convex/values").VId<import("convex/values").GenericId<"complianceWorkflows">, "required">;
        instanceCount: import("convex/values").VFloat64<number, "required">;
        averageCompletionTime: import("convex/values").VFloat64<number, "required">;
        escalationRate: import("convex/values").VFloat64<number, "required">;
        stepCompletionRates: import("convex/values").VArray<{
            stepId: string;
            completionRate: number;
            averageTime: number;
        }[], import("convex/values").VObject<{
            stepId: string;
            completionRate: number;
            averageTime: number;
        }, {
            stepId: import("convex/values").VString<string, "required">;
            completionRate: import("convex/values").VFloat64<number, "required">;
            averageTime: import("convex/values").VFloat64<number, "required">;
        }, "required", "stepId" | "completionRate" | "averageTime">, "required">;
        periodStart: import("convex/values").VFloat64<number, "required">;
        periodEnd: import("convex/values").VFloat64<number, "required">;
        createdAt: import("convex/values").VFloat64<number, "required">;
    }, "required", "createdAt" | "workflowId" | "instanceCount" | "averageCompletionTime" | "escalationRate" | "stepCompletionRates" | "periodStart" | "periodEnd">, {
        by_workflow: ["workflowId", "_creationTime"];
        by_period: ["periodStart", "periodEnd", "_creationTime"];
    }, {}, {}>;
}, true>;
export default _default;
//# sourceMappingURL=schema.d.ts.map
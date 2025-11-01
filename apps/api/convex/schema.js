import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
export default defineSchema({
    projects: defineTable({
        name: v.string(),
        description: v.string(),
        status: v.union(v.literal('planned'), v.literal('active'), v.literal('at-risk'), v.literal('delayed'), v.literal('completed')),
        budget: v.number(),
        spentBudget: v.number(),
        timeline: v.object({
            startDate: v.number(),
            endDate: v.number(),
            milestones: v.array(v.object({
                name: v.string(),
                date: v.number(),
                status: v.string(),
            })),
        }),
        portfolioId: v.optional(v.id('portfolios')),
        ownerId: v.optional(v.id('users')),
        teamMembers: v.array(v.id('users')),
        healthScore: v.number(),
        riskLevel: v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('critical')),
        tags: v.array(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_status', ['status'])
        .index('by_portfolio', ['portfolioId'])
        .index('by_owner', ['ownerId'])
        .index('by_health_score', ['healthScore'])
        .index('by_risk_level', ['riskLevel'])
        .index('by_created_at', ['createdAt']),
    portfolios: defineTable({
        name: v.string(),
        description: v.string(),
        ownerId: v.id('users'),
        healthScore: v.number(),
        totalBudget: v.number(),
        allocatedBudget: v.number(),
        resourceAllocation: v.object({
            teamMembers: v.number(),
            budgetUtilization: v.number(),
            projectCount: v.number(),
        }),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_owner', ['ownerId'])
        .index('by_health_score', ['healthScore']),
    risks: defineTable({
        projectId: v.id('projects'),
        title: v.string(),
        description: v.string(),
        severity: v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('critical')),
        status: v.union(v.literal('identified'), v.literal('monitored'), v.literal('mitigated'), v.literal('resolved')),
        probability: v.number(),
        impact: v.number(),
        mitigationPlan: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_project', ['projectId'])
        .index('by_severity', ['severity'])
        .index('by_status', ['status']),
    users: defineTable({
        name: v.string(),
        email: v.string(),
        role: v.union(v.literal('executive'), v.literal('portfolio_manager'), v.literal('project_officer')),
        department: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_email', ['email'])
        .index('by_role', ['role']),
    // PMI Standards Database for Epic 3
    pmiStandards: defineTable({
        name: v.string(),
        description: v.string(),
        category: v.union(v.literal('portfolio'), v.literal('program'), v.literal('project')),
        level: v.union(v.literal('foundational'), v.literal('intermediate'), v.literal('advanced')),
        weight: v.number(), // Scoring weight (0-1)
        version: v.string(),
        isActive: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_category', ['category'])
        .index('by_level', ['level'])
        .index('by_active', ['isActive'])
        .index('by_version', ['version']),
    pmiStandardCriteria: defineTable({
        standardId: v.id('pmiStandards'),
        name: v.string(),
        description: v.string(),
        requirement: v.string(),
        evidenceType: v.union(v.literal('document'), v.literal('link'), v.literal('text'), v.literal('file')),
        evidenceDescription: v.string(),
        scoringMethod: v.union(v.literal('binary'), v.literal('partial'), v.literal('scale')),
        maxScore: v.number(),
        isMandatory: v.boolean(),
        order: v.number(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_standard', ['standardId'])
        .index('by_order', ['order'])
        .index('by_mandatory', ['isMandatory']),
    projectCompliance: defineTable({
        projectId: v.id('projects'),
        standardId: v.id('pmiStandards'),
        criteriaId: v.id('pmiStandardCriteria'),
        status: v.union(v.literal('not_started'), v.literal('in_progress'), v.literal('submitted'), v.literal('approved'), v.literal('rejected')),
        score: v.number(),
        evidence: v.optional(v.string()),
        evidenceUrl: v.optional(v.string()),
        reviewerId: v.optional(v.id('users')),
        reviewedAt: v.optional(v.number()),
        submittedAt: v.optional(v.number()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_project', ['projectId'])
        .index('by_standard', ['standardId'])
        .index('by_criteria', ['criteriaId'])
        .index('by_status', ['status'])
        .index('by_reviewer', ['reviewerId']),
    complianceEvaluations: defineTable({
        projectId: v.id('projects'),
        standardId: v.id('pmiStandards'),
        overallScore: v.number(),
        evaluatedAt: v.number(),
        evaluatorId: v.id('users'),
        notes: v.optional(v.string()),
        createdAt: v.number(),
    })
        .index('by_project', ['projectId'])
        .index('by_standard', ['standardId'])
        .index('by_evaluated_at', ['evaluatedAt']),
    // Automated compliance checking tables for Story 3.2.1
    complianceSchedules: defineTable({
        frequency: v.union(v.literal('daily'), v.literal('weekly'), v.literal('monthly')),
        portfolioIds: v.array(v.id('portfolios')),
        standardIds: v.array(v.id('pmiStandards')),
        nextEvaluationTime: v.number(),
        isActive: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_next_evaluation', ['nextEvaluationTime'])
        .index('by_active', ['isActive']),
    complianceNotifications: defineTable({
        recipientId: v.id('users'),
        projectId: v.id('projects'),
        standardId: v.id('pmiStandards'),
        alertType: v.union(v.literal('non_compliant'), v.literal('declining_trend'), v.literal('missing_evidence'), v.literal('overdue_evaluation')),
        severity: v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('critical')),
        message: v.string(),
        isRead: v.boolean(),
        createdAt: v.number(),
    })
        .index('by_recipient', ['recipientId'])
        .index('by_project', ['projectId'])
        .index('by_created_at', ['createdAt'])
        .index('by_read_status', ['isRead']),
    // Evidence Management tables for Story 3.2.2
    evidence: defineTable({
        projectId: v.id('projects'),
        criteriaId: v.id('pmiStandardCriteria'),
        standardId: v.id('pmiStandards'),
        title: v.string(),
        description: v.optional(v.string()),
        evidenceType: v.union(v.literal('document'), v.literal('link'), v.literal('text'), v.literal('file')),
        content: v.string(), // URL, file path, or text content
        fileSize: v.optional(v.number()),
        mimeType: v.optional(v.string()),
        status: v.union(v.literal('draft'), v.literal('submitted'), v.literal('under_review'), v.literal('approved'), v.literal('rejected'), v.literal('archived')),
        version: v.number(),
        parentEvidenceId: v.optional(v.id('evidence')), // For version control
        submittedBy: v.id('users'),
        submittedAt: v.optional(v.number()),
        reviewedBy: v.optional(v.id('users')),
        reviewedAt: v.optional(v.number()),
        reviewNotes: v.optional(v.string()),
        tags: v.array(v.string()),
        isLatest: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_project', ['projectId'])
        .index('by_criteria', ['criteriaId'])
        .index('by_standard', ['standardId'])
        .index('by_status', ['status'])
        .index('by_submitted_by', ['submittedBy'])
        .index('by_reviewed_by', ['reviewedBy'])
        .index('by_version', ['version'])
        .index('by_latest', ['isLatest'])
        .index('by_created_at', ['createdAt']),
    evidenceBulkOperations: defineTable({
        operationId: v.string(),
        projectId: v.id('projects'),
        operationType: v.union(v.literal('upload'), v.literal('status_update'), v.literal('delete'), v.literal('archive')),
        status: v.union(v.literal('pending'), v.literal('processing'), v.literal('completed'), v.literal('failed')),
        totalItems: v.number(),
        processedItems: v.number(),
        failedItems: v.number(),
        results: v.optional(v.array(v.object({
            evidenceId: v.id('evidence'),
            status: v.string(),
            error: v.optional(v.string()),
        }))),
        initiatedBy: v.id('users'),
        startedAt: v.number(),
        completedAt: v.optional(v.number()),
        createdAt: v.number(),
    })
        .index('by_operation_id', ['operationId'])
        .index('by_project', ['projectId'])
        .index('by_status', ['status'])
        .index('by_initiated_by', ['initiatedBy'])
        .index('by_created_at', ['createdAt']),
    // Report generation tables for Story 3.3.2
    complianceReportRequests: defineTable({
        reportType: v.string(),
        parameters: v.object({
            portfolioId: v.optional(v.id('portfolios')),
            projectId: v.optional(v.id('projects')),
            dateRange: v.optional(v.object({
                startDate: v.number(),
                endDate: v.number(),
            })),
        }),
        requestedBy: v.id('users'),
        status: v.union(v.literal('pending'), v.literal('processing'), v.literal('completed'), v.literal('failed')),
        reportUrl: v.optional(v.string()),
        errorMessage: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_requested_by', ['requestedBy'])
        .index('by_status', ['status'])
        .index('by_created_at', ['createdAt']),
    complianceReportSchedules: defineTable({
        reportType: v.string(),
        frequency: v.union(v.literal('daily'), v.literal('weekly'), v.literal('monthly')),
        recipients: v.array(v.id('users')),
        parameters: v.object({
            portfolioId: v.optional(v.id('portfolios')),
            projectId: v.optional(v.id('projects')),
        }),
        nextRunTime: v.number(),
        isActive: v.boolean(),
        scheduledBy: v.id('users'),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_next_run_time', ['nextRunTime'])
        .index('by_active', ['isActive'])
        .index('by_scheduled_by', ['scheduledBy']),
    // Custom Rules tables for Story 3.5.1
    customRules: defineTable({
        name: v.string(),
        description: v.string(),
        ruleType: v.union(v.literal('validation'), v.literal('scoring'), v.literal('workflow')),
        condition: v.object({
            field: v.string(),
            operator: v.union(v.literal('equals'), v.literal('not_equals'), v.literal('contains'), v.literal('greater_than'), v.literal('less_than'), v.literal('in'), v.literal('not_in')),
            value: v.any(),
            logicalOperator: v.optional(v.union(v.literal('and'), v.literal('or'))),
            conditions: v.optional(v.array(v.any())),
        }),
        action: v.object({
            type: v.union(v.literal('set_score'), v.literal('set_status'), v.literal('send_notification'), v.literal('trigger_workflow'), v.literal('log_event')),
            parameters: v.object({
                score: v.optional(v.number()),
                status: v.optional(v.string()),
                notificationType: v.optional(v.string()),
                workflowId: v.optional(v.string()),
                message: v.optional(v.string()),
            }),
        }),
        targetEntity: v.union(v.literal('project'), v.literal('portfolio'), v.literal('standard'), v.literal('evidence')),
        isActive: v.boolean(),
        version: v.number(),
        templateId: v.optional(v.string()),
        createdBy: v.id('users'),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_target_entity', ['targetEntity'])
        .index('by_rule_type', ['ruleType'])
        .index('by_active', ['isActive'])
        .index('by_created_by', ['createdBy'])
        .index('by_created_at', ['createdAt']),
    ruleTemplates: defineTable({
        name: v.string(),
        description: v.string(),
        ruleType: v.union(v.literal('validation'), v.literal('scoring'), v.literal('workflow')),
        condition: v.object({
            field: v.string(),
            operator: v.union(v.literal('equals'), v.literal('not_equals'), v.literal('contains'), v.literal('greater_than'), v.literal('less_than'), v.literal('in'), v.literal('not_in')),
            value: v.any(),
            logicalOperator: v.optional(v.union(v.literal('and'), v.literal('or'))),
            conditions: v.optional(v.array(v.any())),
        }),
        action: v.object({
            type: v.union(v.literal('set_score'), v.literal('set_status'), v.literal('send_notification'), v.literal('trigger_workflow'), v.literal('log_event')),
            parameters: v.object({
                score: v.optional(v.number()),
                status: v.optional(v.string()),
                notificationType: v.optional(v.string()),
                workflowId: v.optional(v.string()),
                message: v.optional(v.string()),
            }),
        }),
        targetEntity: v.union(v.literal('project'), v.literal('portfolio'), v.literal('standard'), v.literal('evidence')),
        isActive: v.boolean(),
        usageCount: v.number(),
        createdBy: v.id('users'),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_target_entity', ['targetEntity'])
        .index('by_rule_type', ['ruleType'])
        .index('by_active', ['isActive'])
        .index('by_created_by', ['createdBy']),
    // Compliance Workflow Automation tables for Story 3.5.2
    complianceWorkflows: defineTable({
        name: v.string(),
        description: v.string(),
        triggerType: v.union(v.literal('evidence_submission'), v.literal('compliance_evaluation'), v.literal('schedule'), v.literal('manual')),
        triggerRuleId: v.optional(v.id('customRules')),
        targetEntity: v.union(v.literal('project'), v.literal('portfolio'), v.literal('standard'), v.literal('evidence')),
        steps: v.array(v.object({
            stepId: v.string(),
            name: v.string(),
            type: v.union(v.literal('evidence_request'), v.literal('approval'), v.literal('notification'), v.literal('escalation'), v.literal('condition_check')),
            assigneeRole: v.optional(v.string()),
            assigneeId: v.optional(v.id('users')),
            dueDateOffset: v.optional(v.number()), // Days from workflow start
            escalationAfter: v.optional(v.number()), // Days before escalation
            escalationTo: v.optional(v.id('users')),
            conditions: v.optional(v.array(v.any())),
            actions: v.optional(v.array(v.any())),
            nextStepId: v.optional(v.string()),
        })),
        isActive: v.boolean(),
        version: v.number(),
        createdBy: v.id('users'),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_trigger_type', ['triggerType'])
        .index('by_target_entity', ['targetEntity'])
        .index('by_active', ['isActive'])
        .index('by_created_by', ['createdBy'])
        .index('by_created_at', ['createdAt']),
    workflowInstances: defineTable({
        workflowId: v.id('complianceWorkflows'),
        entityId: v.string(), // Project, portfolio, standard, or evidence ID
        currentStepId: v.string(),
        status: v.union(v.literal('active'), v.literal('paused'), v.literal('completed'), v.literal('cancelled'), v.literal('escalated')),
        startedBy: v.id('users'),
        startedAt: v.number(),
        completedAt: v.optional(v.number()),
        currentAssignee: v.optional(v.id('users')),
        nextDueDate: v.optional(v.number()),
        escalationLevel: v.number(),
        metadata: v.optional(v.any()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_workflow', ['workflowId'])
        .index('by_entity', ['entityId'])
        .index('by_status', ['status'])
        .index('by_current_assignee', ['currentAssignee'])
        .index('by_next_due_date', ['nextDueDate'])
        .index('by_created_at', ['createdAt']),
    workflowSteps: defineTable({
        instanceId: v.id('workflowInstances'),
        stepId: v.string(),
        stepName: v.string(),
        stepType: v.union(v.literal('evidence_request'), v.literal('approval'), v.literal('notification'), v.literal('escalation'), v.literal('condition_check')),
        assigneeId: v.optional(v.id('users')),
        status: v.union(v.literal('pending'), v.literal('in_progress'), v.literal('completed'), v.literal('escalated'), v.literal('skipped')),
        dueDate: v.optional(v.number()),
        completedAt: v.optional(v.number()),
        completedBy: v.optional(v.id('users')),
        notes: v.optional(v.string()),
        metadata: v.optional(v.any()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_instance', ['instanceId'])
        .index('by_step_id', ['stepId'])
        .index('by_status', ['status'])
        .index('by_assignee', ['assigneeId'])
        .index('by_due_date', ['dueDate']),
    workflowEscalations: defineTable({
        instanceId: v.id('workflowInstances'),
        stepId: v.string(),
        escalatedFrom: v.id('users'),
        escalatedTo: v.id('users'),
        reason: v.string(),
        escalationLevel: v.number(),
        createdAt: v.number(),
    })
        .index('by_instance', ['instanceId'])
        .index('by_step', ['stepId'])
        .index('by_escalated_to', ['escalatedTo'])
        .index('by_created_at', ['createdAt']),
    workflowAnalytics: defineTable({
        workflowId: v.id('complianceWorkflows'),
        instanceCount: v.number(),
        averageCompletionTime: v.number(),
        escalationRate: v.number(),
        stepCompletionRates: v.array(v.object({
            stepId: v.string(),
            completionRate: v.number(),
            averageTime: v.number(),
        })),
        periodStart: v.number(),
        periodEnd: v.number(),
        createdAt: v.number(),
    })
        .index('by_workflow', ['workflowId'])
        .index('by_period', ['periodStart', 'periodEnd']),
});

import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { Doc, Id } from './_generated/dataModel';

// Types for workflow automation
export interface ComplianceWorkflow {
  _id: Id<'complianceWorkflows'>;
  name: string;
  description: string;
  triggerType: 'evidence_submission' | 'compliance_evaluation' | 'schedule' | 'manual';
  triggerRuleId?: Id<'customRules'>;
  targetEntity: 'project' | 'portfolio' | 'standard' | 'evidence';
  steps: WorkflowStep[];
  isActive: boolean;
  version: number;
  createdBy: Id<'users'>;
  createdAt: number;
  updatedAt: number;
}

export interface WorkflowStep {
  stepId: string;
  name: string;
  type: 'evidence_request' | 'approval' | 'notification' | 'escalation' | 'condition_check';
  assigneeRole?: string;
  assigneeId?: Id<'users'>;
  dueDateOffset?: number;
  escalationAfter?: number;
  escalationTo?: Id<'users'>;
  conditions?: any[];
  actions?: any[];
  nextStepId?: string;
}

export interface WorkflowInstance {
  _id: Id<'workflowInstances'>;
  workflowId: Id<'complianceWorkflows'>;
  entityId: string;
  currentStepId: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled' | 'escalated';
  startedBy: Id<'users'>;
  startedAt: number;
  completedAt?: number;
  currentAssignee?: Id<'users'>;
  nextDueDate?: number;
  escalationLevel: number;
  metadata?: any;
  createdAt: number;
  updatedAt: number;
}

export interface WorkflowStepInstance {
  _id: Id<'workflowSteps'>;
  instanceId: Id<'workflowInstances'>;
  stepId: string;
  stepName: string;
  stepType: 'evidence_request' | 'approval' | 'notification' | 'escalation' | 'condition_check';
  assigneeId?: Id<'users'>;
  status: 'pending' | 'in_progress' | 'completed' | 'escalated' | 'skipped';
  dueDate?: number;
  completedAt?: number;
  completedBy?: Id<'users'>;
  notes?: string;
  metadata?: any;
  createdAt: number;
  updatedAt: number;
}

export interface WorkflowValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface WorkflowAnalytics {
  workflowId: Id<'complianceWorkflows'>;
  instanceCount: number;
  averageCompletionTime: number;
  escalationRate: number;
  stepCompletionRates: Array<{
    stepId: string;
    completionRate: number;
    averageTime: number;
  }>;
  periodStart: number;
  periodEnd: number;
}

// Create a new compliance workflow
export const createComplianceWorkflow = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    triggerType: v.union(
      v.literal('evidence_submission'),
      v.literal('compliance_evaluation'),
      v.literal('schedule'),
      v.literal('manual')
    ),
    triggerRuleId: v.optional(v.id('customRules')),
    targetEntity: v.union(
      v.literal('project'),
      v.literal('portfolio'),
      v.literal('standard'),
      v.literal('evidence')
    ),
    steps: v.array(
      v.object({
        stepId: v.string(),
        name: v.string(),
        type: v.union(
          v.literal('evidence_request'),
          v.literal('approval'),
          v.literal('notification'),
          v.literal('escalation'),
          v.literal('condition_check')
        ),
        assigneeRole: v.optional(v.string()),
        assigneeId: v.optional(v.id('users')),
        dueDateOffset: v.optional(v.number()),
        escalationAfter: v.optional(v.number()),
        escalationTo: v.optional(v.id('users')),
        conditions: v.optional(v.array(v.any())),
        actions: v.optional(v.array(v.any())),
        nextStepId: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args): Promise<string> => {
    const now = Date.now();
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    // Validate workflow structure
    const validation = await validateWorkflowStructure(args);
    if (!validation.isValid) {
      throw new Error(`Invalid workflow structure: ${validation.errors.join(', ')}`);
    }

    // Create the workflow
    const workflowId = await ctx.db.insert('complianceWorkflows', {
      name: args.name,
      description: args.description,
      triggerType: args.triggerType,
      triggerRuleId: args.triggerRuleId,
      targetEntity: args.targetEntity,
      steps: args.steps,
      isActive: true,
      version: 1,
      createdBy: identity.subject as Id<'users'>,
      createdAt: now,
      updatedAt: now,
    });

    return workflowId;
  },
});

// Validate workflow structure
async function validateWorkflowStructure(workflow: any): Promise<WorkflowValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate name
  if (!workflow.name || workflow.name.trim().length === 0) {
    errors.push('Workflow name is required');
  }

  // Validate trigger type
  if (!workflow.triggerType) {
    errors.push('Trigger type is required');
  }

  // Validate target entity
  if (!workflow.targetEntity) {
    errors.push('Target entity is required');
  }

  // Validate steps
  if (!workflow.steps || workflow.steps.length === 0) {
    errors.push('At least one workflow step is required');
  } else {
    workflow.steps.forEach((step: any, index: number) => {
      if (!step.stepId) {
        errors.push(`Step ${index + 1}: stepId is required`);
      }
      if (!step.name) {
        errors.push(`Step ${index + 1}: name is required`);
      }
      if (!step.type) {
        errors.push(`Step ${index + 1}: type is required`);
      }

      // Validate step-specific requirements
      if (step.type === 'approval' && !step.assigneeId && !step.assigneeRole) {
        errors.push(`Step ${index + 1}: approval steps require assigneeId or assigneeRole`);
      }

      if (step.type === 'evidence_request' && !step.dueDateOffset) {
        warnings.push(`Step ${index + 1}: evidence request steps should have a due date offset`);
      }
    });

    // Check for circular references
    const stepIds = new Set(workflow.steps.map((step: any) => step.stepId));
    workflow.steps.forEach((step: any) => {
      if (step.nextStepId && !stepIds.has(step.nextStepId)) {
        errors.push(`Step ${step.stepId}: nextStepId "${step.nextStepId}" does not exist`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Get all compliance workflows
export const getComplianceWorkflows = query({
  args: {
    targetEntity: v.optional(
      v.union(
        v.literal('project'),
        v.literal('portfolio'),
        v.literal('standard'),
        v.literal('evidence')
      )
    ),
    triggerType: v.optional(
      v.union(
        v.literal('evidence_submission'),
        v.literal('compliance_evaluation'),
        v.literal('schedule'),
        v.literal('manual')
      )
    ),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<ComplianceWorkflow[]> => {
    let query = ctx.db.query('complianceWorkflows');

    // Apply filters
    if (args.targetEntity) {
      query = query.filter(q => q.eq(q.field('targetEntity'), args.targetEntity));
    }

    if (args.triggerType) {
      query = query.filter(q => q.eq(q.field('triggerType'), args.triggerType));
    }

    if (args.isActive !== undefined) {
      query = query.filter(q => q.eq(q.field('isActive'), args.isActive));
    }

    const workflows = await query.collect();
    return workflows.map(workflow => ({
      _id: workflow._id,
      name: workflow.name,
      description: workflow.description,
      triggerType: workflow.triggerType,
      triggerRuleId: workflow.triggerRuleId,
      targetEntity: workflow.targetEntity,
      steps: workflow.steps,
      isActive: workflow.isActive,
      version: workflow.version,
      createdBy: workflow.createdBy,
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
    }));
  },
});

// Get a specific compliance workflow
export const getComplianceWorkflow = query({
  args: { workflowId: v.id('complianceWorkflows') },
  handler: async (ctx, args): Promise<ComplianceWorkflow | null> => {
    const workflow = await ctx.db.get(args.workflowId);
    if (!workflow) return null;

    return {
      _id: workflow._id,
      name: workflow.name,
      description: workflow.description,
      triggerType: workflow.triggerType,
      triggerRuleId: workflow.triggerRuleId,
      targetEntity: workflow.targetEntity,
      steps: workflow.steps,
      isActive: workflow.isActive,
      version: workflow.version,
      createdBy: workflow.createdBy,
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
    };
  },
});

// Update a compliance workflow
export const updateComplianceWorkflow = mutation({
  args: {
    workflowId: v.id('complianceWorkflows'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    triggerType: v.optional(
      v.union(
        v.literal('evidence_submission'),
        v.literal('compliance_evaluation'),
        v.literal('schedule'),
        v.literal('manual')
      )
    ),
    triggerRuleId: v.optional(v.id('customRules')),
    steps: v.optional(v.array(v.any())),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<void> => {
    const now = Date.now();
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const workflow = await ctx.db.get(args.workflowId);
    if (!workflow) {
      throw new Error('Compliance workflow not found');
    }

    // Validate updates if provided
    if (args.steps) {
      const validation = await validateWorkflowStructure({
        ...workflow,
        steps: args.steps,
      });
      if (!validation.isValid) {
        throw new Error(`Invalid workflow structure: ${validation.errors.join(', ')}`);
      }
    }

    // Update the workflow
    await ctx.db.patch(args.workflowId, {
      ...(args.name && { name: args.name }),
      ...(args.description && { description: args.description }),
      ...(args.triggerType && { triggerType: args.triggerType }),
      ...(args.triggerRuleId && { triggerRuleId: args.triggerRuleId }),
      ...(args.steps && { steps: args.steps }),
      ...(args.isActive !== undefined && { isActive: args.isActive }),
      version: workflow.version + 1,
      updatedAt: now,
    });
  },
});

// Start a workflow instance
export const startWorkflowInstance = mutation({
  args: {
    workflowId: v.id('complianceWorkflows'),
    entityId: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args): Promise<string> => {
    const now = Date.now();
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const workflow = await ctx.db.get(args.workflowId);
    if (!workflow) {
      throw new Error('Compliance workflow not found');
    }

    if (!workflow.isActive) {
      throw new Error('Workflow is not active');
    }

    // Check if there's already an active instance for this entity
    const existingInstances = await ctx.db
      .query('workflowInstances')
      .withIndex('by_entity', q => q.eq('entityId', args.entityId))
      .filter(q => q.eq(q.field('status'), 'active'))
      .collect();

    if (existingInstances.length > 0) {
      throw new Error('Active workflow instance already exists for this entity');
    }

    // Create workflow instance
    const instanceId = await ctx.db.insert('workflowInstances', {
      workflowId: args.workflowId,
      entityId: args.entityId,
      currentStepId: workflow.steps[0].stepId,
      status: 'active',
      startedBy: identity.subject as Id<'users'>,
      startedAt: now,
      escalationLevel: 0,
      metadata: args.metadata,
      createdAt: now,
      updatedAt: now,
    });

    // Create initial step instances
    for (const step of workflow.steps) {
      const dueDate = step.dueDateOffset
        ? now + step.dueDateOffset * 24 * 60 * 60 * 1000
        : undefined;

      await ctx.db.insert('workflowSteps', {
        instanceId,
        stepId: step.stepId,
        stepName: step.name,
        stepType: step.type,
        assigneeId: step.assigneeId,
        status: step.stepId === workflow.steps[0].stepId ? 'in_progress' : 'pending',
        dueDate,
        metadata: step,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Set current assignee for the first step
    const firstStep = workflow.steps[0];
    if (firstStep.assigneeId) {
      await ctx.db.patch(instanceId, {
        currentAssignee: firstStep.assigneeId,
        nextDueDate: firstStep.dueDateOffset
          ? now + firstStep.dueDateOffset * 24 * 60 * 60 * 1000
          : undefined,
      });
    }

    return instanceId;
  },
});

// Complete a workflow step
export const completeWorkflowStep = mutation({
  args: {
    instanceId: v.id('workflowInstances'),
    stepId: v.string(),
    notes: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args): Promise<void> => {
    const now = Date.now();
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const instance = await ctx.db.get(args.instanceId);
    if (!instance) {
      throw new Error('Workflow instance not found');
    }

    if (instance.status !== 'active') {
      throw new Error('Workflow instance is not active');
    }

    const workflow = await ctx.db.get(instance.workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    // Get current step
    const currentStep = workflow.steps.find(step => step.stepId === instance.currentStepId);
    if (!currentStep) {
      throw new Error('Current step not found');
    }

    // Update step instance
    const stepInstances = await ctx.db
      .query('workflowSteps')
      .withIndex('by_instance', q => q.eq('instanceId', args.instanceId))
      .filter(q => q.eq(q.field('stepId'), args.stepId))
      .collect();

    if (stepInstances.length === 0) {
      throw new Error('Step instance not found');
    }

    const stepInstance = stepInstances[0];
    await ctx.db.patch(stepInstance._id, {
      status: 'completed',
      completedAt: now,
      completedBy: identity.subject as Id<'users'>,
      notes: args.notes,
      ...(args.metadata && { metadata: { ...stepInstance.metadata, ...args.metadata } }),
      updatedAt: now,
    });

    // Determine next step
    const nextStepId = currentStep.nextStepId;
    if (!nextStepId) {
      // Workflow completed
      await ctx.db.patch(args.instanceId, {
        status: 'completed',
        completedAt: now,
        currentAssignee: undefined,
        nextDueDate: undefined,
        updatedAt: now,
      });
    } else {
      // Move to next step
      const nextStep = workflow.steps.find(step => step.stepId === nextStepId);
      if (!nextStep) {
        throw new Error('Next step not found');
      }

      // Update next step instance
      const nextStepInstances = await ctx.db
        .query('workflowSteps')
        .withIndex('by_instance', q => q.eq('instanceId', args.instanceId))
        .filter(q => q.eq(q.field('stepId'), nextStepId))
        .collect();

      if (nextStepInstances.length > 0) {
        await ctx.db.patch(nextStepInstances[0]._id, {
          status: 'in_progress',
          updatedAt: now,
        });
      }

      // Update instance
      await ctx.db.patch(args.instanceId, {
        currentStepId: nextStepId,
        currentAssignee: nextStep.assigneeId,
        nextDueDate: nextStep.dueDateOffset
          ? now + nextStep.dueDateOffset * 24 * 60 * 60 * 1000
          : undefined,
        updatedAt: now,
      });
    }
  },
});

// Escalate a workflow step
export const escalateWorkflowStep = mutation({
  args: {
    instanceId: v.id('workflowInstances'),
    stepId: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    const now = Date.now();
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const instance = await ctx.db.get(args.instanceId);
    if (!instance) {
      throw new Error('Workflow instance not found');
    }

    const workflow = await ctx.db.get(instance.workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const currentStep = workflow.steps.find(step => step.stepId === instance.currentStepId);
    if (!currentStep) {
      throw new Error('Current step not found');
    }

    // Check if escalation is configured
    if (!currentStep.escalationTo) {
      throw new Error('Escalation not configured for this step');
    }

    // Update step instance
    const stepInstances = await ctx.db
      .query('workflowSteps')
      .withIndex('by_instance', q => q.eq('instanceId', args.instanceId))
      .filter(q => q.eq(q.field('stepId'), args.stepId))
      .collect();

    if (stepInstances.length === 0) {
      throw new Error('Step instance not found');
    }

    const stepInstance = stepInstances[0];
    await ctx.db.patch(stepInstance._id, {
      status: 'escalated',
      updatedAt: now,
    });

    // Create escalation record
    await ctx.db.insert('workflowEscalations', {
      instanceId: args.instanceId,
      stepId: args.stepId,
      escalatedFrom: instance.currentAssignee || (identity.subject as Id<'users'>),
      escalatedTo: currentStep.escalationTo,
      reason: args.reason,
      escalationLevel: instance.escalationLevel + 1,
      createdAt: now,
    });

    // Update instance
    await ctx.db.patch(args.instanceId, {
      currentAssignee: currentStep.escalationTo,
      escalationLevel: instance.escalationLevel + 1,
      status: 'escalated',
      updatedAt: now,
    });
  },
});

// Get workflow instances
export const getWorkflowInstances = query({
  args: {
    workflowId: v.optional(v.id('complianceWorkflows')),
    entityId: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal('active'),
        v.literal('paused'),
        v.literal('completed'),
        v.literal('cancelled'),
        v.literal('escalated')
      )
    ),
  },
  handler: async (ctx, args): Promise<WorkflowInstance[]> => {
    let query = ctx.db.query('workflowInstances');

    // Apply filters
    if (args.workflowId) {
      query = query.filter(q => q.eq(q.field('workflowId'), args.workflowId));
    }

    if (args.entityId) {
      query = query.filter(q => q.eq(q.field('entityId'), args.entityId));
    }

    if (args.status) {
      query = query.filter(q => q.eq(q.field('status'), args.status));
    }

    const instances = await query.collect();
    return instances.map(instance => ({
      _id: instance._id,
      workflowId: instance.workflowId,
      entityId: instance.entityId,
      currentStepId: instance.currentStepId,
      status: instance.status,
      startedBy: instance.startedBy,
      startedAt: instance.startedAt,
      completedAt: instance.completedAt,
      currentAssignee: instance.currentAssignee,
      nextDueDate: instance.nextDueDate,
      escalationLevel: instance.escalationLevel,
      metadata: instance.metadata,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    }));
  },
});

// Get workflow step instances
export const getWorkflowStepInstances = query({
  args: { instanceId: v.id('workflowInstances') },
  handler: async (ctx, args): Promise<WorkflowStepInstance[]> => {
    const stepInstances = await ctx.db
      .query('workflowSteps')
      .withIndex('by_instance', q => q.eq('instanceId', args.instanceId))
      .collect();

    return stepInstances.map(step => ({
      _id: step._id,
      instanceId: step.instanceId,
      stepId: step.stepId,
      stepName: step.stepName,
      stepType: step.stepType,
      assigneeId: step.assigneeId,
      status: step.status,
      dueDate: step.dueDate,
      completedAt: step.completedAt,
      completedBy: step.completedBy,
      notes: step.notes,
      metadata: step.metadata,
      createdAt: step.createdAt,
      updatedAt: step.updatedAt,
    }));
  },
});

// Get workflow analytics
export const getWorkflowAnalytics = query({
  args: {
    workflowId: v.id('complianceWorkflows'),
    periodStart: v.number(),
    periodEnd: v.number(),
  },
  handler: async (ctx, args): Promise<WorkflowAnalytics | null> => {
    const analytics = await ctx.db
      .query('workflowAnalytics')
      .withIndex('by_workflow', q => q.eq('workflowId', args.workflowId))
      .filter(q =>
        q.and(
          q.gte(q.field('periodStart'), args.periodStart),
          q.lte(q.field('periodEnd'), args.periodEnd)
        )
      )
      .first();

    if (!analytics) {
      return null;
    }

    return {
      workflowId: analytics.workflowId,
      instanceCount: analytics.instanceCount,
      averageCompletionTime: analytics.averageCompletionTime,
      escalationRate: analytics.escalationRate,
      stepCompletionRates: analytics.stepCompletionRates,
      periodStart: analytics.periodStart,
      periodEnd: analytics.periodEnd,
    };
  },
});

// Automated evidence request function
export const sendAutomatedEvidenceRequest = mutation({
  args: {
    projectId: v.id('projects'),
    criteriaId: v.id('pmiStandardCriteria'),
    dueDateOffset: v.number(),
    assigneeId: v.id('users'),
  },
  handler: async (ctx, args): Promise<void> => {
    const now = Date.now();
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const project = await ctx.db.get(args.projectId);
    const criteria = await ctx.db.get(args.criteriaId);
    const assignee = await ctx.db.get(args.assigneeId);

    if (!project || !criteria || !assignee) {
      throw new Error('Project, criteria, or assignee not found');
    }

    const dueDate = now + args.dueDateOffset * 24 * 60 * 60 * 1000;

    // Create notification for evidence request
    await ctx.db.insert('complianceNotifications', {
      recipientId: args.assigneeId,
      projectId: args.projectId,
      standardId: criteria.standardId,
      alertType: 'missing_evidence',
      severity: 'medium',
      message: `Evidence request for ${criteria.name} in project ${project.name}. Due date: ${new Date(dueDate).toLocaleDateString()}`,
      isRead: false,
      createdAt: now,
    });

    // Log the evidence request
    console.log(`Automated evidence request sent to ${assignee.name} for ${criteria.name}`);
  },
});

// Check for overdue workflow steps
export const checkOverdueWorkflowSteps = mutation({
  args: {},
  handler: async (ctx): Promise<void> => {
    const now = Date.now();

    // Find active workflow instances with overdue steps
    const activeInstances = await ctx.db
      .query('workflowInstances')
      .withIndex('by_status', q => q.eq('status', 'active'))
      .filter(q =>
        q.and(q.neq(q.field('nextDueDate'), undefined), q.lt(q.field('nextDueDate'), now))
      )
      .collect();

    for (const instance of activeInstances) {
      const workflow = await ctx.db.get(instance.workflowId);
      if (!workflow) continue;

      const currentStep = workflow.steps.find(step => step.stepId === instance.currentStepId);
      if (!currentStep || !currentStep.escalationAfter) continue;

      // Check if escalation is due
      const overdueTime = now - (instance.nextDueDate || now);
      const escalationThreshold = currentStep.escalationAfter * 24 * 60 * 60 * 1000;

      if (overdueTime >= escalationThreshold && currentStep.escalationTo) {
        // Auto-escalate the step - implement escalation logic directly
        const now = Date.now();

        // Update step instance
        const stepInstances = await ctx.db
          .query('workflowSteps')
          .withIndex('by_instance', q => q.eq('instanceId', instance._id))
          .filter(q => q.eq(q.field('stepId'), instance.currentStepId))
          .collect();

        if (stepInstances.length > 0) {
          const stepInstance = stepInstances[0];
          await ctx.db.patch(stepInstance._id, {
            status: 'escalated',
            updatedAt: now,
          });
        }

        // Create escalation record
        await ctx.db.insert('workflowEscalations', {
          instanceId: instance._id,
          stepId: instance.currentStepId,
          escalatedFrom: instance.currentAssignee || instance.startedBy,
          escalatedTo: currentStep.escalationTo,
          reason: `Auto-escalated due to overdue step (${Math.round(overdueTime / (24 * 60 * 60 * 1000))} days overdue)`,
          escalationLevel: instance.escalationLevel + 1,
          createdAt: now,
        });

        // Update instance
        await ctx.db.patch(instance._id, {
          currentAssignee: currentStep.escalationTo,
          escalationLevel: instance.escalationLevel + 1,
          status: 'escalated',
          updatedAt: now,
        });
      }
    }
  },
});

// Generate workflow analytics
export const generateWorkflowAnalytics = mutation({
  args: {
    workflowId: v.id('complianceWorkflows'),
    periodStart: v.number(),
    periodEnd: v.number(),
  },
  handler: async (ctx, args): Promise<string> => {
    const now = Date.now();

    // Get completed instances in the period
    const completedInstances = await ctx.db
      .query('workflowInstances')
      .withIndex('by_workflow', q => q.eq('workflowId', args.workflowId))
      .filter(q =>
        q.and(
          q.eq(q.field('status'), 'completed'),
          q.gte(q.field('completedAt'), args.periodStart),
          q.lte(q.field('completedAt'), args.periodEnd)
        )
      )
      .collect();

    // Calculate analytics
    const instanceCount = completedInstances.length;
    let totalCompletionTime = 0;
    let escalationCount = 0;

    const stepCompletionRates: Array<{
      stepId: string;
      completionRate: number;
      averageTime: number;
    }> = [];
    const stepStats = new Map<string, { completed: number; totalTime: number }>();

    for (const instance of completedInstances) {
      const completionTime = (instance.completedAt || now) - instance.startedAt;
      totalCompletionTime += completionTime;

      // Get step instances for this workflow
      const stepInstances = await ctx.db
        .query('workflowSteps')
        .withIndex('by_instance', q => q.eq('instanceId', instance._id))
        .collect();

      // Count escalations
      const escalatedSteps = stepInstances.filter(step => step.status === 'escalated');
      escalationCount += escalatedSteps.length;

      // Calculate step statistics
      for (const step of stepInstances) {
        if (step.status === 'completed' && step.completedAt) {
          const stepTime = step.completedAt - instance.startedAt;
          const existing = stepStats.get(step.stepId) || { completed: 0, totalTime: 0 };
          stepStats.set(step.stepId, {
            completed: existing.completed + 1,
            totalTime: existing.totalTime + stepTime,
          });
        }
      }
    }

    // Calculate step completion rates
    const workflow = await ctx.db.get(args.workflowId);
    if (workflow) {
      for (const step of workflow.steps) {
        const stats = stepStats.get(step.stepId) || { completed: 0, totalTime: 0 };
        const completionRate = instanceCount > 0 ? stats.completed / instanceCount : 0;
        const averageTime = stats.completed > 0 ? stats.totalTime / stats.completed : 0;

        stepCompletionRates.push({
          stepId: step.stepId,
          completionRate,
          averageTime,
        });
      }
    }

    const averageCompletionTime = instanceCount > 0 ? totalCompletionTime / instanceCount : 0;
    const escalationRate = instanceCount > 0 ? escalationCount / instanceCount : 0;

    // Create analytics record
    const analyticsId = await ctx.db.insert('workflowAnalytics', {
      workflowId: args.workflowId,
      instanceCount,
      averageCompletionTime,
      escalationRate,
      stepCompletionRates,
      periodStart: args.periodStart,
      periodEnd: args.periodEnd,
      createdAt: now,
    });

    return analyticsId;
  },
});

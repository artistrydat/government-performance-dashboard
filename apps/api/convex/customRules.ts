import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { Doc, Id } from './_generated/dataModel';

// Types for custom rules
export interface CustomRule {
  _id: Id<'customRules'>;
  name: string;
  description: string;
  ruleType: 'validation' | 'scoring' | 'workflow';
  condition: RuleCondition;
  action: RuleAction;
  targetEntity: 'project' | 'portfolio' | 'standard' | 'evidence';
  isActive: boolean;
  version: number;
  templateId?: string;
  createdBy: Id<'users'>;
  createdAt: number;
  updatedAt: number;
}

export interface RuleCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
  logicalOperator?: 'and' | 'or';
  conditions?: RuleCondition[];
}

export interface RuleAction {
  type: 'set_score' | 'set_status' | 'send_notification' | 'trigger_workflow' | 'log_event';
  parameters: {
    score?: number;
    status?: string;
    notificationType?: string;
    workflowId?: string;
    message?: string;
  };
}

export interface RuleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface RuleTestResult {
  passed: boolean;
  testCase: string;
  actualResult: any;
  expectedResult: any;
  executionTime: number;
  error?: string;
}

// Create a new custom rule
export const createCustomRule = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    ruleType: v.union(v.literal('validation'), v.literal('scoring'), v.literal('workflow')),
    condition: v.object({
      field: v.string(),
      operator: v.union(
        v.literal('equals'),
        v.literal('not_equals'),
        v.literal('contains'),
        v.literal('greater_than'),
        v.literal('less_than'),
        v.literal('in'),
        v.literal('not_in')
      ),
      value: v.any(),
      logicalOperator: v.optional(v.union(v.literal('and'), v.literal('or'))),
      conditions: v.optional(v.array(v.any())),
    }),
    action: v.object({
      type: v.union(
        v.literal('set_score'),
        v.literal('set_status'),
        v.literal('send_notification'),
        v.literal('trigger_workflow'),
        v.literal('log_event')
      ),
      parameters: v.object({
        score: v.optional(v.number()),
        status: v.optional(v.string()),
        notificationType: v.optional(v.string()),
        workflowId: v.optional(v.string()),
        message: v.optional(v.string()),
      }),
    }),
    targetEntity: v.union(
      v.literal('project'),
      v.literal('portfolio'),
      v.literal('standard'),
      v.literal('evidence')
    ),
    templateId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<string> => {
    const now = Date.now();
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    // Validate the rule before creating
    const validation = await validateRuleStructure(args);
    if (!validation.isValid) {
      throw new Error(`Invalid rule structure: ${validation.errors.join(', ')}`);
    }

    // Create the custom rule
    const ruleId = await ctx.db.insert('customRules', {
      name: args.name,
      description: args.description,
      ruleType: args.ruleType,
      condition: args.condition,
      action: args.action,
      targetEntity: args.targetEntity,
      isActive: true,
      version: 1,
      templateId: args.templateId,
      createdBy: identity.subject as Id<'users'>,
      createdAt: now,
      updatedAt: now,
    });

    return ruleId;
  },
});

// Validate rule structure
async function validateRuleStructure(rule: any): Promise<RuleValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate name
  if (!rule.name || rule.name.trim().length === 0) {
    errors.push('Rule name is required');
  }

  // Validate condition structure
  if (!rule.condition) {
    errors.push('Rule condition is required');
  } else {
    if (!rule.condition.field) {
      errors.push('Condition field is required');
    }
    if (!rule.condition.operator) {
      errors.push('Condition operator is required');
    }
    if (rule.condition.value === undefined || rule.condition.value === null) {
      errors.push('Condition value is required');
    }
  }

  // Validate action structure
  if (!rule.action) {
    errors.push('Rule action is required');
  } else {
    if (!rule.action.type) {
      errors.push('Action type is required');
    }
    if (!rule.action.parameters) {
      errors.push('Action parameters are required');
    }
  }

  // Validate target entity
  if (!rule.targetEntity) {
    errors.push('Target entity is required');
  }

  // Check for potential performance issues
  if (rule.condition.conditions && rule.condition.conditions.length > 5) {
    warnings.push('Complex conditions may impact performance');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Get all custom rules
export const getCustomRules = query({
  args: {
    targetEntity: v.optional(
      v.union(
        v.literal('project'),
        v.literal('portfolio'),
        v.literal('standard'),
        v.literal('evidence')
      )
    ),
    ruleType: v.optional(
      v.union(v.literal('validation'), v.literal('scoring'), v.literal('workflow'))
    ),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<CustomRule[]> => {
    let query = ctx.db.query('customRules');

    // Apply filters
    if (args.targetEntity) {
      query = query.filter(q => q.eq(q.field('targetEntity'), args.targetEntity));
    }

    if (args.ruleType) {
      query = query.filter(q => q.eq(q.field('ruleType'), args.ruleType));
    }

    if (args.isActive !== undefined) {
      query = query.filter(q => q.eq(q.field('isActive'), args.isActive));
    }

    const rules = await query.collect();
    return rules.map(rule => ({
      _id: rule._id,
      name: rule.name,
      description: rule.description,
      ruleType: rule.ruleType,
      condition: rule.condition,
      action: rule.action,
      targetEntity: rule.targetEntity,
      isActive: rule.isActive,
      version: rule.version,
      templateId: rule.templateId,
      createdBy: rule.createdBy,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
    }));
  },
});

// Get a specific custom rule
export const getCustomRule = query({
  args: { ruleId: v.id('customRules') },
  handler: async (ctx, args): Promise<CustomRule | null> => {
    const rule = await ctx.db.get(args.ruleId);
    if (!rule) return null;

    return {
      _id: rule._id,
      name: rule.name,
      description: rule.description,
      ruleType: rule.ruleType,
      condition: rule.condition,
      action: rule.action,
      targetEntity: rule.targetEntity,
      isActive: rule.isActive,
      version: rule.version,
      templateId: rule.templateId,
      createdBy: rule.createdBy,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
    };
  },
});

// Update a custom rule
export const updateCustomRule = mutation({
  args: {
    ruleId: v.id('customRules'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    condition: v.optional(v.any()),
    action: v.optional(v.any()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<void> => {
    const now = Date.now();
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const rule = await ctx.db.get(args.ruleId);
    if (!rule) {
      throw new Error('Custom rule not found');
    }

    // Validate updates if provided
    if (args.condition || args.action) {
      const validation = await validateRuleStructure({
        ...rule,
        condition: args.condition || rule.condition,
        action: args.action || rule.action,
      });
      if (!validation.isValid) {
        throw new Error(`Invalid rule structure: ${validation.errors.join(', ')}`);
      }
    }

    // Update the rule
    await ctx.db.patch(args.ruleId, {
      ...(args.name && { name: args.name }),
      ...(args.description && { description: args.description }),
      ...(args.condition && { condition: args.condition }),
      ...(args.action && { action: args.action }),
      ...(args.isActive !== undefined && { isActive: args.isActive }),
      version: rule.version + 1,
      updatedAt: now,
    });
  },
});

// Delete a custom rule
export const deleteCustomRule = mutation({
  args: { ruleId: v.id('customRules') },
  handler: async (ctx, args): Promise<void> => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const rule = await ctx.db.get(args.ruleId);
    if (!rule) {
      throw new Error('Custom rule not found');
    }

    // Check if rule is being used in any evaluations
    const usage = await checkRuleUsage(ctx, args.ruleId);
    if (usage.isUsed) {
      throw new Error(`Cannot delete rule: ${usage.reason}`);
    }

    await ctx.db.delete(args.ruleId);
  },
});

// Check if a rule is being used
async function checkRuleUsage(
  ctx: any,
  ruleId: string
): Promise<{ isUsed: boolean; reason?: string }> {
  // Check if rule is referenced in any evaluations
  const evaluations = await ctx.db
    .query('complianceEvaluations')
    .filter((q: any) => q.eq(q.field('customRuleId'), ruleId))
    .collect();

  if (evaluations.length > 0) {
    return {
      isUsed: true,
      reason: `Rule is used in ${evaluations.length} evaluation(s)`,
    };
  }

  // Check if rule is used in any workflows
  // Note: complianceWorkflows table doesn't exist yet, so skip this check for now
  // const workflows = await ctx.db
  //   .query('complianceWorkflows')
  //   .filter((q: any) => q.eq(q.field('triggerRuleId'), ruleId))
  //   .collect();

  // if (workflows.length > 0) {
  //   return {
  //     isUsed: true,
  //     reason: `Rule triggers ${workflows.length} workflow(s)`,
  //   };
  // }

  return { isUsed: false };
}

// Test a custom rule
export const testCustomRule = mutation({
  args: {
    ruleId: v.id('customRules'),
    testData: v.any(),
  },
  handler: async (ctx, args): Promise<RuleTestResult> => {
    const startTime = Date.now();

    const rule = await ctx.db.get(args.ruleId);
    if (!rule) {
      throw new Error('Custom rule not found');
    }

    try {
      // Execute the rule against test data
      const result = await executeRule(rule, args.testData);
      const executionTime = Date.now() - startTime;

      return {
        passed: true,
        testCase: 'Custom rule execution',
        actualResult: result,
        expectedResult: 'Rule executed successfully',
        executionTime,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      return {
        passed: false,
        testCase: 'Custom rule execution',
        actualResult: null,
        expectedResult: 'Rule executed successfully',
        executionTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

// Execute a custom rule
async function executeRule(rule: Doc<'customRules'>, data: any): Promise<any> {
  // Evaluate condition
  const conditionResult = evaluateCondition(rule.condition, data);

  if (conditionResult) {
    // Execute action if condition is true
    return executeAction(rule.action, data);
  }

  return null;
}

// Evaluate a condition
function evaluateCondition(condition: any, data: any): boolean {
  const { field, operator, value, logicalOperator, conditions } = condition;

  // Handle nested conditions
  if (conditions && conditions.length > 0) {
    const results = conditions.map((cond: any) => evaluateCondition(cond, data));

    if (logicalOperator === 'and') {
      return results.every((result: boolean) => result);
    } else {
      return results.some((result: boolean) => result);
    }
  }

  // Get field value from data
  const fieldValue = getFieldValue(data, field);

  // Apply operator
  switch (operator) {
    case 'equals':
      return fieldValue === value;
    case 'not_equals':
      return fieldValue !== value;
    case 'contains':
      return String(fieldValue).includes(String(value));
    case 'greater_than':
      return Number(fieldValue) > Number(value);
    case 'less_than':
      return Number(fieldValue) < Number(value);
    case 'in':
      return Array.isArray(value) && value.includes(fieldValue);
    case 'not_in':
      return Array.isArray(value) && !value.includes(fieldValue);
    default:
      return false;
  }
}

// Get field value from nested object
function getFieldValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

// Execute an action
function executeAction(action: any, data: any): any {
  const { type, parameters } = action;

  switch (type) {
    case 'set_score':
      return { score: parameters.score, entity: data };
    case 'set_status':
      return { status: parameters.status, entity: data };
    case 'send_notification':
      return { notification: parameters.message, entity: data };
    case 'trigger_workflow':
      return { workflow: parameters.workflowId, entity: data };
    case 'log_event':
      return { event: parameters.message, entity: data };
    default:
      return null;
  }
}

// Get rule templates
export const getRuleTemplates = query({
  args: {},
  handler: async (ctx): Promise<any[]> => {
    const templates = await ctx.db
      .query('ruleTemplates')
      .filter(q => q.eq(q.field('isActive'), true))
      .collect();

    return templates.map(template => ({
      _id: template._id,
      name: template.name,
      description: template.description,
      ruleType: template.ruleType,
      condition: template.condition,
      action: template.action,
      targetEntity: template.targetEntity,
      usageCount: template.usageCount,
      createdAt: template.createdAt,
    }));
  },
});

// Create rule from template
export const createRuleFromTemplate = mutation({
  args: {
    templateId: v.id('ruleTemplates'),
    name: v.string(),
    description: v.optional(v.string()),
    modifications: v.optional(v.any()),
  },
  handler: async (ctx, args): Promise<string> => {
    const now = Date.now();
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const template = await ctx.db.get(args.templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Apply modifications to template
    const ruleData = {
      name: args.name,
      description: args.description || template.description,
      ruleType: template.ruleType,
      condition: args.modifications?.condition || template.condition,
      action: args.modifications?.action || template.action,
      targetEntity: template.targetEntity,
      templateId: args.templateId,
    };

    // Validate the rule before creating
    const validation = await validateRuleStructure(ruleData);
    if (!validation.isValid) {
      throw new Error(`Invalid rule structure: ${validation.errors.join(', ')}`);
    }

    // Create the custom rule
    const ruleId = await ctx.db.insert('customRules', {
      name: ruleData.name,
      description: ruleData.description,
      ruleType: ruleData.ruleType,
      condition: ruleData.condition,
      action: ruleData.action,
      targetEntity: ruleData.targetEntity,
      isActive: true,
      version: 1,
      templateId: ruleData.templateId,
      createdBy: identity.subject as Id<'users'>,
      createdAt: now,
      updatedAt: now,
    });

    // Update template usage count
    await ctx.db.patch(args.templateId, {
      usageCount: (template.usageCount || 0) + 1,
    });

    return ruleId;
  },
});

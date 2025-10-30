import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Types for evaluation results
export interface EvaluationResult {
  projectId: string;
  standardId: string;
  overallScore: number;
  criteriaResults: CriteriaResult[];
  evaluationDate: number;
  evaluatorId: string;
  status: 'complete' | 'partial' | 'failed';
  notes?: string;
}

export interface CriteriaResult {
  criteriaId: string;
  criteriaName: string;
  score: number;
  maxScore: number;
  status: 'met' | 'partial' | 'not_met' | 'not_applicable';
  evidenceStatus: 'provided' | 'missing' | 'invalid';
  validationNotes?: string;
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  maxScore: number;
  validationNotes?: string;
  evidenceType: 'document' | 'link' | 'text' | 'file';
}

// Main evaluation function
export const evaluateProjectCompliance = mutation({
  args: {
    projectId: v.id('projects'),
    standardId: v.id('pmiStandards'),
    evaluatorId: v.id('users'),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<EvaluationResult> => {
    const now = Date.now();

    // Get project, standard, and criteria data
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const standard = await ctx.db.get(args.standardId);
    if (!standard) {
      throw new Error('PMI standard not found');
    }

    const criteria = await ctx.db
      .query('pmiStandardCriteria')
      .withIndex('by_standard', q => q.eq('standardId', args.standardId))
      .collect();

    if (criteria.length === 0) {
      throw new Error('No criteria found for this standard');
    }

    // Get existing compliance records for this project and standard
    const existingCompliance = await ctx.db
      .query('projectCompliance')
      .withIndex('by_project', q => q.eq('projectId', args.projectId))
      .filter(q => q.eq(q.field('standardId'), args.standardId))
      .collect();

    // Evaluate each criteria
    const criteriaResults: CriteriaResult[] = [];
    let totalPossibleScore = 0;
    let totalAchievedScore = 0;

    for (const criterion of criteria) {
      const complianceRecord = existingCompliance.find(
        record => record.criteriaId === criterion._id
      );

      const result = await evaluateCriteria(ctx, criterion, complianceRecord);
      criteriaResults.push(result);

      totalPossibleScore += criterion.maxScore;
      totalAchievedScore += result.score;
    }

    // Calculate overall score (weighted by standard weight)
    const rawScore = totalPossibleScore > 0 ? (totalAchievedScore / totalPossibleScore) * 100 : 0;
    const overallScore = Math.round(rawScore * standard.weight * 100) / 100;

    // Determine evaluation status
    let status: 'complete' | 'partial' | 'failed' = 'complete';
    const mandatoryCriteria = criteria.filter(c => c.isMandatory);
    const unmetMandatory = criteriaResults.filter(
      result =>
        mandatoryCriteria.some(c => c._id === result.criteriaId) && result.status === 'not_met'
    );

    if (unmetMandatory.length > 0) {
      status = 'failed';
    } else if (criteriaResults.some(result => result.status === 'partial')) {
      status = 'partial';
    }

    // Create evaluation result
    const evaluationResult: EvaluationResult = {
      projectId: args.projectId,
      standardId: args.standardId,
      overallScore,
      criteriaResults,
      evaluationDate: now,
      evaluatorId: args.evaluatorId,
      status,
      notes: args.notes,
    };

    // Save evaluation to history
    await ctx.db.insert('complianceEvaluations', {
      projectId: args.projectId,
      standardId: args.standardId,
      overallScore,
      evaluatorId: args.evaluatorId,
      notes: args.notes,
      evaluatedAt: now,
      createdAt: now,
    });

    return evaluationResult;
  },
});

// Evaluate individual criteria
async function evaluateCriteria(
  ctx: any,
  criterion: any,
  complianceRecord: any
): Promise<CriteriaResult> {
  let score = 0;
  let status: 'met' | 'partial' | 'not_met' | 'not_applicable' = 'not_met';
  let evidenceStatus: 'provided' | 'missing' | 'invalid' = 'missing';
  let validationNotes: string | undefined;

  if (complianceRecord) {
    // Validate evidence based on criteria requirements
    const validation = await validateEvidence(complianceRecord, criterion);

    evidenceStatus = validation.isValid ? 'provided' : 'invalid';
    score = validation.score;
    validationNotes = validation.validationNotes;

    // Determine status based on scoring method
    switch (criterion.scoringMethod) {
      case 'binary':
        status = score >= criterion.maxScore ? 'met' : 'not_met';
        break;
      case 'partial':
        if (score >= criterion.maxScore * 0.8) {
          status = 'met';
        } else if (score > 0) {
          status = 'partial';
        } else {
          status = 'not_met';
        }
        break;
      case 'scale':
        if (score >= criterion.maxScore * 0.9) {
          status = 'met';
        } else if (score >= criterion.maxScore * 0.5) {
          status = 'partial';
        } else {
          status = 'not_met';
        }
        break;
    }
  }

  return {
    criteriaId: criterion._id,
    criteriaName: criterion.name,
    score,
    maxScore: criterion.maxScore,
    status,
    evidenceStatus,
    validationNotes,
  };
}

// Validate evidence against criteria requirements
async function validateEvidence(complianceRecord: any, criterion: any): Promise<ValidationResult> {
  const { evidence, evidenceUrl, status } = complianceRecord;
  const { evidenceType, scoringMethod, maxScore } = criterion;

  let isValid = false;
  let score = 0;
  let validationNotes: string | undefined;

  // Basic validation based on evidence type
  switch (evidenceType) {
    case 'document':
    case 'file':
      isValid = !!evidenceUrl && evidenceUrl.length > 0;
      validationNotes = isValid ? 'File URL provided' : 'File URL missing';
      break;

    case 'link':
      isValid = !!evidenceUrl && evidenceUrl.startsWith('http');
      validationNotes = isValid ? 'Valid URL provided' : 'Invalid or missing URL';
      break;

    case 'text':
      isValid = !!evidence && evidence.length > 10; // Minimum text length
      validationNotes = isValid ? 'Text evidence provided' : 'Insufficient text evidence';
      break;
  }

  // Additional validation based on status
  if (status === 'approved') {
    isValid = true;
    score = maxScore; // Approved records get full score
  } else if (status === 'submitted' && isValid) {
    // Submitted but not approved gets partial score based on scoring method
    switch (scoringMethod) {
      case 'binary':
        score = 0; // Binary requires approval for full score
        break;
      case 'partial':
        score = maxScore * 0.5; // Half score for submitted evidence
        break;
      case 'scale':
        score = maxScore * 0.7; // Higher partial score for scale method
        break;
    }
  }

  return {
    isValid,
    score,
    maxScore,
    validationNotes,
    evidenceType,
  };
}

// Get evaluation results for a project
export const getProjectEvaluationResults = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args): Promise<EvaluationResult[]> => {
    const evaluations = await ctx.db
      .query('complianceEvaluations')
      .withIndex('by_project', q => q.eq('projectId', args.projectId))
      .collect();

    // For now, return basic evaluation data
    // In a full implementation, this would reconstruct full evaluation results
    return evaluations.map(evaluation => ({
      projectId: evaluation.projectId,
      standardId: evaluation.standardId,
      overallScore: evaluation.overallScore,
      criteriaResults: [], // Would need to be reconstructed from stored data
      evaluationDate: evaluation.evaluatedAt,
      evaluatorId: evaluation.evaluatorId,
      status: 'complete', // Default status
      notes: evaluation.notes,
    }));
  },
});

// Batch evaluate multiple projects
export const batchEvaluateProjects = mutation({
  args: {
    projectIds: v.array(v.id('projects')),
    standardId: v.id('pmiStandards'),
    evaluatorId: v.id('users'),
  },
  handler: async (ctx, args): Promise<EvaluationResult[]> => {
    const results: EvaluationResult[] = [];

    for (const projectId of args.projectIds) {
      try {
        // Replicate the evaluation logic for each project
        const result = await performEvaluation(ctx, projectId, args.standardId, args.evaluatorId);
        results.push(result);
      } catch (error) {
        console.error(`Failed to evaluate project ${projectId}:`, error);
        // Continue with other projects even if one fails
      }
    }

    return results;
  },
});

// Helper function to perform evaluation (duplicated logic from evaluateProjectCompliance)
async function performEvaluation(
  ctx: any,
  projectId: string,
  standardId: string,
  evaluatorId: string
): Promise<EvaluationResult> {
  const now = Date.now();

  // Get project, standard, and criteria data
  const project = await ctx.db.get(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  const standard = await ctx.db.get(standardId);
  if (!standard) {
    throw new Error('PMI standard not found');
  }

  const criteria = await ctx.db
    .query('pmiStandardCriteria')
    .withIndex('by_standard', (q: any) => q.eq('standardId', standardId))
    .collect();

  if (criteria.length === 0) {
    throw new Error('No criteria found for this standard');
  }

  // Get existing compliance records for this project and standard
  const existingCompliance = await ctx.db
    .query('projectCompliance')
    .withIndex('by_project', (q: any) => q.eq('projectId', projectId))
    .filter((q: any) => q.eq(q.field('standardId'), standardId))
    .collect();

  // Evaluate each criteria
  const criteriaResults: CriteriaResult[] = [];
  let totalPossibleScore = 0;
  let totalAchievedScore = 0;

  for (const criterion of criteria) {
    const complianceRecord = existingCompliance.find(
      (record: any) => record.criteriaId === criterion._id
    );

    const result = await evaluateCriteria(ctx, criterion, complianceRecord);
    criteriaResults.push(result);

    totalPossibleScore += criterion.maxScore;
    totalAchievedScore += result.score;
  }

  // Calculate overall score (weighted by standard weight)
  const rawScore = totalPossibleScore > 0 ? (totalAchievedScore / totalPossibleScore) * 100 : 0;
  const overallScore = Math.round(rawScore * standard.weight * 100) / 100;

  // Determine evaluation status
  let status: 'complete' | 'partial' | 'failed' = 'complete';
  const mandatoryCriteria = criteria.filter((c: any) => c.isMandatory);
  const unmetMandatory = criteriaResults.filter(
    (result: any) =>
      mandatoryCriteria.some((c: any) => c._id === result.criteriaId) && result.status === 'not_met'
  );

  if (unmetMandatory.length > 0) {
    status = 'failed';
  } else if (criteriaResults.some(result => result.status === 'partial')) {
    status = 'partial';
  }

  // Create evaluation result
  const evaluationResult: EvaluationResult = {
    projectId,
    standardId,
    overallScore,
    criteriaResults,
    evaluationDate: now,
    evaluatorId,
    status,
  };

  // Save evaluation to history
  await ctx.db.insert('complianceEvaluations', {
    projectId,
    standardId,
    overallScore,
    evaluatorId,
    evaluatedAt: now,
    createdAt: now,
  });

  return evaluationResult;
}

// Get evaluation statistics
export const getEvaluationStatistics = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const evaluations = await ctx.db
      .query('complianceEvaluations')
      .withIndex('by_project', q => q.eq('projectId', args.projectId))
      .collect();

    if (evaluations.length === 0) {
      return {
        totalEvaluations: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
        improvementTrend: 'no_data',
        complianceLevel: 'unknown',
      };
    }

    const scores = evaluations.map(e => e.overallScore);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);

    // Calculate trend (simple implementation)
    let improvementTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (evaluations.length >= 2) {
      const sorted = evaluations.sort((a, b) => a.evaluatedAt - b.evaluatedAt);
      const firstScore = sorted[0].overallScore;
      const lastScore = sorted[sorted.length - 1].overallScore;

      if (lastScore > firstScore + 5) improvementTrend = 'improving';
      else if (lastScore < firstScore - 5) improvementTrend = 'declining';
    }

    // Determine compliance level
    let complianceLevel: 'excellent' | 'good' | 'fair' | 'poor';
    if (averageScore >= 90) complianceLevel = 'excellent';
    else if (averageScore >= 75) complianceLevel = 'good';
    else if (averageScore >= 60) complianceLevel = 'fair';
    else complianceLevel = 'poor';

    return {
      totalEvaluations: evaluations.length,
      averageScore: Math.round(averageScore * 10) / 10,
      bestScore: Math.round(bestScore * 10) / 10,
      worstScore: Math.round(worstScore * 10) / 10,
      improvementTrend,
      complianceLevel,
    };
  },
});

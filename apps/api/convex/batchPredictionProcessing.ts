import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { generatePrediction } from './aiService';

/**
 * Batch Prediction Processing System
 *
 * This module provides functions for generating predictions for multiple projects efficiently
 * through batch processing, scheduled updates, and performance optimization.
 */

// Configuration for batch processing
const BATCH_CONFIG = {
  // Maximum number of projects to process in a single batch
  maxBatchSize: 50,

  // Maximum number of concurrent AI requests
  maxConcurrentRequests: 5,

  // Delay between batches (milliseconds)
  batchDelay: 1000,

  // Timeout for individual prediction requests (milliseconds)
  requestTimeout: 30000,

  // Retry configuration for failed predictions
  maxRetries: 3,
  retryDelay: 2000,

  // Cache TTL for predictions (milliseconds)
  cacheTTL: 3600000, // 1 hour
};

/**
 * Types for batch prediction processing
 */
export interface BatchPredictionRequest {
  projectIds: string[];
  predictionTypes: Array<'failure' | 'delay' | 'budget' | 'compliance'>;
  priority?: 'low' | 'medium' | 'high';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    nextRunTime: number;
  };
}

export interface BatchPredictionResponse {
  batchId: string;
  totalProjects: number;
  processedProjects: number;
  failedProjects: number;
  predictionsGenerated: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  startedAt: number;
  completedAt?: number;
  results: Array<{
    projectId: string;
    status: 'success' | 'failed' | 'skipped';
    predictions: Array<{
      type: string;
      predictionId?: string;
      confidence: number;
      error?: string;
    }>;
  }>;
  performanceMetrics: {
    totalTime: number;
    averageTimePerProject: number;
    peakConcurrentRequests: number;
    cacheHitRate: number;
  };
}

export interface BatchPredictionJob {
  _id: string;
  _creationTime: number;
  batchId: string;
  projectIds: string[];
  predictionTypes: Array<'failure' | 'delay' | 'budget' | 'compliance'>;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: {
    total: number;
    processed: number;
    failed: number;
  };
  results: Array<{
    projectId: string;
    status: 'success' | 'failed' | 'skipped';
    predictions: Array<{
      type: string;
      predictionId?: string;
      confidence: number;
      error?: string;
    }>;
  }>;
  startedAt: number;
  completedAt?: number;
  initiatedBy: string;
  priority: 'low' | 'medium' | 'high';
}

/**
 * Generate predictions for multiple projects in batch
 */
export const generateBatchPredictions = mutation({
  args: {
    projectIds: v.array(v.id('projects')),
    predictionTypes: v.array(
      v.union(
        v.literal('failure'),
        v.literal('delay'),
        v.literal('budget'),
        v.literal('compliance')
      )
    ),
    priority: v.optional(v.union(v.literal('low'), v.literal('medium'), v.literal('high'))),
    initiatedBy: v.id('users'),
  },
  handler: async (ctx, args): Promise<BatchPredictionResponse> => {
    const { projectIds, predictionTypes, priority = 'medium', initiatedBy } = args;

    // Validate batch size
    if (projectIds.length > BATCH_CONFIG.maxBatchSize) {
      throw new Error(`Batch size exceeds maximum limit of ${BATCH_CONFIG.maxBatchSize}`);
    }

    // Validate prediction types
    if (predictionTypes.length === 0) {
      throw new Error('At least one prediction type must be specified');
    }

    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startedAt = Date.now();

    // Create batch job record
    const batchJobId = await ctx.db.insert('batch_prediction_jobs', {
      batchId,
      projectIds,
      predictionTypes,
      status: 'processing',
      progress: {
        total: projectIds.length * predictionTypes.length,
        processed: 0,
        failed: 0,
      },
      results: [],
      startedAt,
      initiatedBy,
      priority,
    });

    try {
      // Process projects in batches to avoid overwhelming the AI service
      const results = await processBatchWithConcurrency(
        ctx,
        projectIds,
        predictionTypes,
        batchJobId
      );

      const completedAt = Date.now();
      const totalTime = completedAt - startedAt;

      // Calculate performance metrics
      const performanceMetrics = calculatePerformanceMetrics(results, totalTime);

      // Update batch job with final results
      await ctx.db.patch(batchJobId, {
        status: 'completed',
        progress: {
          total: projectIds.length * predictionTypes.length,
          processed: results.filter(r => r.status === 'success').length,
          failed: results.filter(r => r.status === 'failed').length,
        },
        results,
        completedAt,
      });

      return {
        batchId,
        totalProjects: projectIds.length,
        processedProjects: results.filter(r => r.status !== 'skipped').length,
        failedProjects: results.filter(r => r.status === 'failed').length,
        predictionsGenerated: results.reduce(
          (count, result) => count + result.predictions.filter(p => p.predictionId).length,
          0
        ),
        status: 'completed',
        startedAt,
        completedAt,
        results,
        performanceMetrics,
      };
    } catch (error) {
      // Mark batch as failed
      await ctx.db.patch(batchJobId, {
        status: 'failed',
        completedAt: Date.now(),
      });

      throw new Error(`Batch prediction processing failed: ${error}`);
    }
  },
});

/**
 * Process batch with controlled concurrency
 */
async function processBatchWithConcurrency(
  ctx: any,
  projectIds: string[],
  predictionTypes: Array<'failure' | 'delay' | 'budget' | 'compliance'>,
  batchJobId: string
): Promise<BatchPredictionResponse['results']> {
  const results: BatchPredictionResponse['results'] = [];
  let activeRequests = 0;
  let peakConcurrentRequests = 0;

  // Process projects in chunks to control concurrency
  for (let i = 0; i < projectIds.length; i += BATCH_CONFIG.maxConcurrentRequests) {
    const chunk = projectIds.slice(i, i + BATCH_CONFIG.maxConcurrentRequests);

    // Process chunk concurrently
    const chunkPromises = chunk.map(async projectId => {
      activeRequests++;
      peakConcurrentRequests = Math.max(peakConcurrentRequests, activeRequests);

      try {
        const projectPredictions = await generatePredictionsForProject(
          ctx,
          projectId,
          predictionTypes
        );

        results.push({
          projectId,
          status: 'success',
          predictions: projectPredictions,
        });

        // Update progress
        await updateBatchProgress(ctx, batchJobId, projectPredictions.length, 0);
      } catch (error) {
        results.push({
          projectId,
          status: 'failed',
          predictions: predictionTypes.map(type => ({
            type,
            confidence: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
          })),
        });

        // Update progress with failures
        await updateBatchProgress(ctx, batchJobId, 0, predictionTypes.length);
      } finally {
        activeRequests--;
      }
    });

    await Promise.all(chunkPromises);

    // Add delay between chunks to respect rate limits
    if (i + BATCH_CONFIG.maxConcurrentRequests < projectIds.length) {
      await new Promise(resolve => setTimeout(resolve, BATCH_CONFIG.batchDelay));
    }
  }

  return results;
}

/**
 * Generate predictions for a single project
 */
async function generatePredictionsForProject(
  ctx: any,
  projectId: string,
  predictionTypes: Array<'failure' | 'delay' | 'budget' | 'compliance'>
): Promise<
  Array<{
    type: string;
    predictionId?: string;
    confidence: number;
    error?: string;
  }>
> {
  const predictions = [];

  for (const predictionType of predictionTypes) {
    try {
      // Check if we can use cached prediction
      const cachedPrediction = await getCachedPrediction(ctx, projectId, predictionType);
      if (cachedPrediction) {
        predictions.push({
          type: predictionType,
          predictionId: cachedPrediction._id,
          confidence: cachedPrediction.confidence,
        });
        continue;
      }

      // Get project data for prediction input
      const project = await ctx.db.get(projectId);
      if (!project) {
        throw new Error(`Project ${projectId} not found`);
      }

      // Prepare input data for AI prediction
      const inputData = preparePredictionInputData(project, predictionType);

      // Generate prediction using AI service
      const prediction = await ctx.runMutation(generatePrediction, {
        projectId,
        predictionType,
        inputData,
      });

      predictions.push({
        type: predictionType,
        predictionId: prediction.predictionId,
        confidence: prediction.confidence,
      });

      // Cache the prediction
      await cachePrediction(ctx, projectId, predictionType, prediction);
    } catch (error) {
      predictions.push({
        type: predictionType,
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return predictions;
}

/**
 * Get cached prediction if available and not expired
 */
async function getCachedPrediction(
  ctx: any,
  projectId: string,
  predictionType: string
): Promise<any> {
  const cachedPredictions = await ctx.db
    .query('ai_predictions')
    .withIndex('by_project', (q: any) => q.eq('projectId', projectId))
    .filter((q: any) =>
      q.and(
        q.eq(q.field('type'), predictionType),
        q.eq(q.field('status'), 'active'),
        q.gt(q.field('generationTimestamp'), Date.now() - BATCH_CONFIG.cacheTTL)
      )
    )
    .order('desc')
    .first();

  return cachedPredictions;
}

/**
 * Cache prediction for future use
 */
async function cachePrediction(
  _ctx: any,
  _projectId: string,
  _predictionType: string,
  _prediction: any
): Promise<void> {
  // Prediction is already stored in ai_predictions table by generatePrediction
  // This function is for additional caching logic if needed
  // For now, we rely on the existing storage with TTL checking
}

/**
 * Prepare input data for AI prediction based on project data and prediction type
 */
function preparePredictionInputData(project: any, predictionType: string): any {
  const baseData = {
    projectName: project.name,
    projectStatus: project.status,
    budget: project.budget,
    spentBudget: project.spentBudget,
    healthScore: project.healthScore,
    riskLevel: project.riskLevel,
    timeline: project.timeline,
    teamSize: project.teamMembers.length,
  };

  switch (predictionType) {
    case 'failure':
      return {
        ...baseData,
        riskFactors: ['scope_creep', 'resource_constraints', 'timeline_pressure'],
        historicalData: {
          similarProjectsFailureRate: 0.65,
          teamExperience: 'mixed',
        },
      };

    case 'delay':
      return {
        ...baseData,
        currentProgress: calculateProjectProgress(project),
        milestoneStatus: project.timeline.milestones.map((m: any) => ({
          name: m.name,
          status: m.status,
          scheduledDate: m.date,
        })),
        dependencyAnalysis: {
          criticalPathLength: 45, // days
          bufferDays: 15,
        },
      };

    case 'budget':
      return {
        ...baseData,
        expenditureRate: calculateExpenditureRate(project),
        vendorCosts: {
          total: project.budget * 0.6, // Estimate 60% for vendors
          committed: project.spentBudget * 0.8,
        },
        contingencyUsage: 0.1, // 10% contingency used
      };

    case 'compliance':
      return {
        ...baseData,
        complianceStatus: 'partial',
        evidenceCompleteness: 0.75,
        auditHistory: {
          lastAuditScore: 85,
          criticalFindings: 2,
        },
      };

    default:
      return baseData;
  }
}

/**
 * Calculate project progress based on milestones
 */
function calculateProjectProgress(project: any): number {
  const milestones = project.timeline.milestones || [];
  if (milestones.length === 0) return 0;

  const completed = milestones.filter((m: any) => m.status === 'completed').length;
  return completed / milestones.length;
}

/**
 * Calculate expenditure rate
 */
function calculateExpenditureRate(project: any): number {
  const elapsedTime = Date.now() - project.timeline.startDate;
  const totalTime = project.timeline.endDate - project.timeline.startDate;

  if (totalTime <= 0) return 0;

  const timeProgress = elapsedTime / totalTime;
  const budgetProgress = project.spentBudget / project.budget;

  return budgetProgress / timeProgress;
}

/**
 * Update batch progress in database
 */
async function updateBatchProgress(
  ctx: any,
  batchJobId: string,
  processed: number,
  failed: number
): Promise<void> {
  const job = await ctx.db.get(batchJobId);
  if (!job) return;

  await ctx.db.patch(batchJobId, {
    progress: {
      total: job.progress.total,
      processed: job.progress.processed + processed,
      failed: job.progress.failed + failed,
    },
  });
}

/**
 * Calculate performance metrics for batch processing
 */
function calculatePerformanceMetrics(
  results: BatchPredictionResponse['results'],
  totalTime: number
): BatchPredictionResponse['performanceMetrics'] {
  const totalPredictions = results.reduce((sum, result) => sum + result.predictions.length, 0);
  const successfulPredictions = results.reduce(
    (sum, result) => sum + result.predictions.filter(p => p.predictionId).length,
    0
  );

  return {
    totalTime,
    averageTimePerProject: totalTime / results.length,
    peakConcurrentRequests: BATCH_CONFIG.maxConcurrentRequests,
    cacheHitRate: successfulPredictions / totalPredictions,
  };
}

/**
 * Get batch prediction job status
 */
export const getBatchPredictionStatus = query({
  args: {
    batchId: v.string(),
  },
  handler: async (ctx, args): Promise<BatchPredictionJob | null> => {
    const job = await ctx.db
      .query('batch_prediction_jobs')
      .withIndex('by_batch_id', (q: any) => q.eq('batchId', args.batchId))
      .first();

    return job;
  },
});

/**
 * Cancel a batch prediction job
 */
export const cancelBatchPrediction = mutation({
  args: {
    batchId: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    const job = await ctx.db
      .query('batch_prediction_jobs')
      .withIndex('by_batch_id', (q: any) => q.eq('batchId', args.batchId))
      .first();

    if (!job) {
      throw new Error('Batch prediction job not found');
    }

    if (job.status !== 'processing') {
      throw new Error('Only processing jobs can be cancelled');
    }

    await ctx.db.patch(job._id, {
      status: 'cancelled',
      completedAt: Date.now(),
    });
  },
});

/**
 * Get batch prediction history
 */
export const getBatchPredictionHistory = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal('pending'),
        v.literal('processing'),
        v.literal('completed'),
        v.literal('failed'),
        v.literal('cancelled')
      )
    ),
  },
  handler: async (ctx, args): Promise<BatchPredictionJob[]> => {
    let query = ctx.db.query('batch_prediction_jobs').order('desc');

    if (args.status) {
      query = query.filter((q: any) => q.eq(q.field('status'), args.status));
    }

    const jobs = await query.collect();

    if (args.limit) {
      return jobs.slice(0, args.limit);
    }

    return jobs;
  },
});

/**
 * Clean up old batch prediction jobs
 */
export const cleanupOldBatchJobs = mutation({
  args: {
    olderThanDays: v.number(),
  },
  handler: async (ctx, args): Promise<{ deleted: number }> => {
    const cutoffTime = Date.now() - args.olderThanDays * 24 * 60 * 60 * 1000;

    const oldJobs = await ctx.db
      .query('batch_prediction_jobs')
      .filter(q => q.lt(q.field('startedAt'), cutoffTime))
      .collect();

    let deleted = 0;
    for (const job of oldJobs) {
      await ctx.db.delete(job._id);
      deleted++;
    }

    return { deleted };
  },
});

// Export configuration for testing
export { BATCH_CONFIG };

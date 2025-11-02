import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * AI Prediction Management Functions
 *
 * This module provides functions for managing AI predictions including:
 * - Creating new predictions with validation
 * - Updating prediction status and versioning
 * - Querying predictions with filtering
 * - Managing prediction lifecycle
 */

/**
 * Create a new AI prediction
 */
export const createPrediction = mutation({
  args: {
    type: v.union(
      v.literal('failure'),
      v.literal('delay'),
      v.literal('budget'),
      v.literal('compliance')
    ),
    confidence: v.number(),
    predictedValue: v.any(),
    timeHorizon: v.number(),
    reasoning: v.string(),
    recommendations: v.array(v.string()),
    evidenceReferences: v.array(v.string()),
    modelUsed: v.string(),
    modelVersion: v.string(),
    projectId: v.id('projects'),
    createdBy: v.id('users'),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Validate confidence score
    if (args.confidence < 0 || args.confidence > 1) {
      throw new Error('Confidence score must be between 0 and 1');
    }

    // Validate time horizon (must be positive)
    if (args.timeHorizon < 0) {
      throw new Error('Time horizon must be a positive number');
    }

    // Create the prediction
    const predictionId = await ctx.db.insert('ai_predictions', {
      type: args.type,
      confidence: parseFloat(args.confidence.toFixed(2)), // Round to 2 decimal places
      predictedValue: args.predictedValue,
      timeHorizon: args.timeHorizon,
      reasoning: args.reasoning,
      recommendations: args.recommendations,
      evidenceReferences: args.evidenceReferences,
      modelUsed: args.modelUsed,
      modelVersion: args.modelVersion,
      generationTimestamp: Date.now(),
      status: 'active',
      version: 1,
      previousVersionId: undefined,
      projectId: args.projectId,
      createdBy: args.createdBy,
      metadata: args.metadata,
    });

    return predictionId;
  },
});

/**
 * Update an existing prediction (creates a new version)
 */
export const updatePrediction = mutation({
  args: {
    predictionId: v.id('ai_predictions'),
    type: v.optional(
      v.union(
        v.literal('failure'),
        v.literal('delay'),
        v.literal('budget'),
        v.literal('compliance')
      )
    ),
    confidence: v.optional(v.number()),
    predictedValue: v.optional(v.any()),
    timeHorizon: v.optional(v.number()),
    reasoning: v.optional(v.string()),
    recommendations: v.optional(v.array(v.string())),
    evidenceReferences: v.optional(v.array(v.string())),
    modelUsed: v.optional(v.string()),
    modelVersion: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const existingPrediction = await ctx.db.get(args.predictionId);
    if (!existingPrediction) {
      throw new Error('Prediction not found');
    }

    // Validate confidence score if provided
    if (args.confidence !== undefined && (args.confidence < 0 || args.confidence > 1)) {
      throw new Error('Confidence score must be between 0 and 1');
    }

    // Validate time horizon if provided
    if (args.timeHorizon !== undefined && args.timeHorizon < 0) {
      throw new Error('Time horizon must be a positive number');
    }

    // Archive the existing prediction
    await ctx.db.patch(args.predictionId, {
      status: 'inactive',
    });

    // Create new version
    const newPredictionId = await ctx.db.insert('ai_predictions', {
      type: args.type || existingPrediction.type,
      confidence:
        args.confidence !== undefined
          ? parseFloat(args.confidence.toFixed(2))
          : existingPrediction.confidence,
      predictedValue:
        args.predictedValue !== undefined ? args.predictedValue : existingPrediction.predictedValue,
      timeHorizon:
        args.timeHorizon !== undefined ? args.timeHorizon : existingPrediction.timeHorizon,
      reasoning: args.reasoning || existingPrediction.reasoning,
      recommendations: args.recommendations || existingPrediction.recommendations,
      evidenceReferences: args.evidenceReferences || existingPrediction.evidenceReferences,
      modelUsed: args.modelUsed || existingPrediction.modelUsed,
      modelVersion: args.modelVersion || existingPrediction.modelVersion,
      generationTimestamp: Date.now(),
      status: 'active',
      version: existingPrediction.version + 1,
      previousVersionId: args.predictionId,
      projectId: existingPrediction.projectId,
      createdBy: existingPrediction.createdBy,
      metadata: args.metadata !== undefined ? args.metadata : existingPrediction.metadata,
    });

    return newPredictionId;
  },
});

/**
 * Archive a prediction (soft delete)
 */
export const archivePrediction = mutation({
  args: {
    predictionId: v.id('ai_predictions'),
  },
  handler: async (ctx, args) => {
    const prediction = await ctx.db.get(args.predictionId);
    if (!prediction) {
      throw new Error('Prediction not found');
    }

    await ctx.db.patch(args.predictionId, {
      status: 'archived',
    });

    return args.predictionId;
  },
});

/**
 * Get active predictions for a project
 */
export const getActivePredictionsForProject = query({
  args: {
    projectId: v.id('projects'),
    type: v.optional(
      v.union(
        v.literal('failure'),
        v.literal('delay'),
        v.literal('budget'),
        v.literal('compliance')
      )
    ),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query('ai_predictions')
      .withIndex('by_project', q => q.eq('projectId', args.projectId))
      .filter(q => q.eq(q.field('status'), 'active'));

    if (args.type) {
      query = query.filter(q => q.eq(q.field('type'), args.type));
    }

    return query.order('desc').collect();
  },
});

/**
 * Get prediction history for a project
 */
export const getPredictionHistoryForProject = query({
  args: {
    projectId: v.id('projects'),
    type: v.optional(
      v.union(
        v.literal('failure'),
        v.literal('delay'),
        v.literal('budget'),
        v.literal('compliance')
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query('ai_predictions')
      .withIndex('by_project', q => q.eq('projectId', args.projectId))
      .order('desc');

    if (args.type) {
      query = query.filter(q => q.eq(q.field('type'), args.type));
    }

    const predictions = await query.collect();

    if (args.limit) {
      return predictions.slice(0, args.limit);
    }

    return predictions;
  },
});

/**
 * Get predictions by confidence threshold
 */
export const getPredictionsByConfidence = query({
  args: {
    projectId: v.id('projects'),
    minConfidence: v.number(),
    maxConfidence: v.optional(v.number()),
    type: v.optional(
      v.union(
        v.literal('failure'),
        v.literal('delay'),
        v.literal('budget'),
        v.literal('compliance')
      )
    ),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query('ai_predictions')
      .withIndex('by_project', q => q.eq('projectId', args.projectId))
      .filter(q =>
        q.and(q.eq(q.field('status'), 'active'), q.gte(q.field('confidence'), args.minConfidence))
      );

    if (args.maxConfidence !== undefined) {
      query = query.filter(q => q.lte(q.field('confidence'), args.maxConfidence as number));
    }

    if (args.type) {
      query = query.filter(q => q.eq(q.field('type'), args.type));
    }

    return query.order('desc').collect();
  },
});

/**
 * Get prediction statistics for a project
 */
export const getPredictionStatistics = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const predictions = await ctx.db
      .query('ai_predictions')
      .withIndex('by_project', q => q.eq('projectId', args.projectId))
      .collect();

    const activePredictions = predictions.filter(p => p.status === 'active');
    const archivedPredictions = predictions.filter(p => p.status === 'archived');
    const inactivePredictions = predictions.filter(p => p.status === 'inactive');

    const typeStats: Record<string, number> = {};
    const confidenceStats = {
      total: activePredictions.length,
      average: 0,
      highConfidence: activePredictions.filter(p => p.confidence >= 0.8).length,
      mediumConfidence: activePredictions.filter(p => p.confidence >= 0.5 && p.confidence < 0.8)
        .length,
      lowConfidence: activePredictions.filter(p => p.confidence < 0.5).length,
    };

    if (activePredictions.length > 0) {
      confidenceStats.average =
        activePredictions.reduce((sum, p) => sum + p.confidence, 0) / activePredictions.length;
    }

    activePredictions.forEach(prediction => {
      typeStats[prediction.type] = (typeStats[prediction.type] || 0) + 1;
    });

    return {
      totalPredictions: predictions.length,
      activePredictions: activePredictions.length,
      archivedPredictions: archivedPredictions.length,
      inactivePredictions: inactivePredictions.length,
      typeStatistics: typeStats,
      confidenceStatistics: confidenceStats,
      latestPrediction:
        activePredictions.length > 0 ? activePredictions[0].generationTimestamp : null,
    };
  },
});

/**
 * Get prediction version history
 */
export const getPredictionVersionHistory = query({
  args: {
    predictionId: v.id('ai_predictions'),
  },
  handler: async (ctx, args) => {
    const prediction = await ctx.db.get(args.predictionId);
    if (!prediction) {
      throw new Error('Prediction not found');
    }

    const versions = [prediction];
    let currentPrediction = prediction;

    // Follow the version chain backwards
    while (currentPrediction.previousVersionId) {
      const previous = await ctx.db.get(currentPrediction.previousVersionId);
      if (previous) {
        versions.push(previous);
        currentPrediction = previous;
      } else {
        break;
      }
    }

    return versions.reverse(); // Return in chronological order
  },
});

// Standalone validation functions that can be tested without Convex context
export const validateConfidenceScore = (confidence: number): string[] => {
  const errors: string[] = [];
  if (confidence < 0 || confidence > 1) {
    errors.push('Confidence score must be between 0 and 1');
  }
  return errors;
};

export const validateTimeHorizon = (timeHorizon: number): string[] => {
  const errors: string[] = [];
  if (timeHorizon < 0) {
    errors.push('Time horizon must be a positive number');
  }
  return errors;
};

export const validatePredictedValue = (
  type: 'failure' | 'delay' | 'budget' | 'compliance',
  predictedValue: any
): string[] => {
  const errors: string[] = [];

  switch (type) {
    case 'failure':
      if (typeof predictedValue !== 'number' || predictedValue < 0 || predictedValue > 1) {
        errors.push('Failure prediction value must be a probability between 0 and 1');
      }
      break;
    case 'delay':
      if (typeof predictedValue !== 'number' || predictedValue < 0) {
        errors.push('Delay prediction value must be a positive number of days');
      }
      break;
    case 'budget':
      if (typeof predictedValue !== 'number' || predictedValue < 0) {
        errors.push('Budget prediction value must be a positive number');
      }
      break;
    case 'compliance':
      if (typeof predictedValue !== 'number' || predictedValue < 0 || predictedValue > 1) {
        errors.push('Compliance prediction value must be a probability between 0 and 1');
      }
      break;
  }

  return errors;
};

export const validatePredictionInput = (
  type: 'failure' | 'delay' | 'budget' | 'compliance',
  confidence: number,
  predictedValue: any,
  timeHorizon: number
): { isValid: boolean; errors: string[] } => {
  const errors = [
    ...validateConfidenceScore(confidence),
    ...validateTimeHorizon(timeHorizon),
    ...validatePredictedValue(type, predictedValue),
  ];

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate prediction data
 */
export const validatePredictionData = mutation({
  args: {
    type: v.union(
      v.literal('failure'),
      v.literal('delay'),
      v.literal('budget'),
      v.literal('compliance')
    ),
    confidence: v.number(),
    predictedValue: v.any(),
    timeHorizon: v.number(),
  },
  handler: async (_ctx, args) => {
    return validatePredictionInput(
      args.type,
      args.confidence,
      args.predictedValue,
      args.timeHorizon
    );
  },
});

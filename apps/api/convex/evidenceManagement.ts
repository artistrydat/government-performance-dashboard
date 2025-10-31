import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';

/**
 * Evidence Management Functions for Story 3.2.2
 *
 * This module provides comprehensive evidence management capabilities including:
 * - Evidence upload and validation
 * - Status tracking (submitted, reviewed, approved)
 * - Version control
 * - Bulk operations
 * - Search and filtering
 */

// Types for evidence operations

/**
 * Create new evidence record
 */
export const createEvidence = mutation({
  args: {
    projectId: v.id('projects'),
    criteriaId: v.id('pmiStandardCriteria'),
    standardId: v.id('pmiStandards'),
    title: v.string(),
    description: v.optional(v.string()),
    evidenceType: v.union(
      v.literal('document'),
      v.literal('link'),
      v.literal('text'),
      v.literal('file')
    ),
    content: v.string(),
    fileSize: v.optional(v.number()),
    mimeType: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    submittedBy: v.id('users'),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Validate evidence type matches criteria requirements
    const criteria = await ctx.db.get(args.criteriaId);
    if (!criteria) {
      throw new Error('Criteria not found');
    }

    if (criteria.evidenceType !== args.evidenceType) {
      throw new Error(`Evidence type must be ${criteria.evidenceType} for this criteria`);
    }

    // Create the evidence record
    const evidenceId = await ctx.db.insert('evidence', {
      ...args,
      tags: args.tags || [],
      status: 'draft',
      version: 1,
      isLatest: true,
      createdAt: now,
      updatedAt: now,
    });

    return evidenceId;
  },
});

/**
 * Submit evidence for review
 */
export const submitEvidence = mutation({
  args: {
    evidenceId: v.id('evidence'),
  },
  handler: async (ctx, args) => {
    const evidence = await ctx.db.get(args.evidenceId);
    if (!evidence) {
      throw new Error('Evidence not found');
    }

    if (evidence.status !== 'draft') {
      throw new Error('Evidence must be in draft status to submit');
    }

    const now = Date.now();

    // Update evidence status
    await ctx.db.patch(args.evidenceId, {
      status: 'submitted',
      submittedAt: now,
      updatedAt: now,
    });

    return { success: true };
  },
});

/**
 * Review evidence and update status
 */
export const reviewEvidence = mutation({
  args: {
    evidenceId: v.id('evidence'),
    status: v.union(v.literal('approved'), v.literal('rejected')),
    reviewNotes: v.optional(v.string()),
    reviewedBy: v.id('users'),
  },
  handler: async (ctx, args) => {
    const evidence = await ctx.db.get(args.evidenceId);
    if (!evidence) {
      throw new Error('Evidence not found');
    }

    if (evidence.status !== 'submitted' && evidence.status !== 'under_review') {
      throw new Error('Evidence must be submitted or under review to be reviewed');
    }

    const now = Date.now();

    // Update evidence with review results
    await ctx.db.patch(args.evidenceId, {
      status: args.status,
      reviewedBy: args.reviewedBy,
      reviewedAt: now,
      reviewNotes: args.reviewNotes,
      updatedAt: now,
    });

    return { success: true };
  },
});

/**
 * Create new version of evidence
 */
export const createEvidenceVersion = mutation({
  args: {
    evidenceId: v.id('evidence'),
    title: v.string(),
    description: v.optional(v.string()),
    content: v.string(),
    fileSize: v.optional(v.number()),
    mimeType: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    submittedBy: v.id('users'),
  },
  handler: async (ctx, args) => {
    const originalEvidence = await ctx.db.get(args.evidenceId);
    if (!originalEvidence) {
      throw new Error('Original evidence not found');
    }

    // Mark original as not latest
    await ctx.db.patch(args.evidenceId, {
      isLatest: false,
      updatedAt: Date.now(),
    });

    const now = Date.now();

    // Create new version
    const newEvidenceId = await ctx.db.insert('evidence', {
      projectId: originalEvidence.projectId,
      criteriaId: originalEvidence.criteriaId,
      standardId: originalEvidence.standardId,
      title: args.title,
      description: args.description,
      evidenceType: originalEvidence.evidenceType,
      content: args.content,
      fileSize: args.fileSize,
      mimeType: args.mimeType,
      status: 'draft',
      version: originalEvidence.version + 1,
      parentEvidenceId: args.evidenceId,
      submittedBy: args.submittedBy,
      tags: args.tags || originalEvidence.tags,
      isLatest: true,
      createdAt: now,
      updatedAt: now,
    });

    return newEvidenceId;
  },
});

/**
 * Get evidence by ID with full details
 */
export const getEvidence = query({
  args: {
    evidenceId: v.id('evidence'),
  },
  handler: async (ctx, args) => {
    const evidence = await ctx.db.get(args.evidenceId);
    if (!evidence) {
      return null;
    }

    // Get related data
    const [project, criteria, standard, submittedByUser, reviewedByUser] = await Promise.all([
      ctx.db.get(evidence.projectId),
      ctx.db.get(evidence.criteriaId),
      ctx.db.get(evidence.standardId),
      evidence.submittedBy ? ctx.db.get(evidence.submittedBy) : null,
      evidence.reviewedBy ? ctx.db.get(evidence.reviewedBy) : null,
    ]);

    // Get version history if this is not the first version
    const versionHistory = [];
    if (evidence.parentEvidenceId) {
      let currentParentId: Id<'evidence'> | undefined = evidence.parentEvidenceId;
      while (currentParentId) {
        const parentEvidence: any = await ctx.db.get(currentParentId);
        if (parentEvidence) {
          versionHistory.push(parentEvidence);
          currentParentId = parentEvidence.parentEvidenceId;
        } else {
          currentParentId = undefined;
        }
      }
      versionHistory.reverse(); // Show oldest first
    }

    return {
      ...evidence,
      project,
      criteria,
      standard,
      submittedByUser,
      reviewedByUser,
      versionHistory,
    };
  },
});

/**
 * Search and filter evidence
 */
export const searchEvidence = query({
  args: {
    projectId: v.optional(v.id('projects')),
    standardId: v.optional(v.id('pmiStandards')),
    criteriaId: v.optional(v.id('pmiStandardCriteria')),
    status: v.optional(v.array(v.string())),
    evidenceType: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    submittedBy: v.optional(v.id('users')),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const {
      projectId,
      standardId,
      criteriaId,
      status = [],
      evidenceType = [],
      tags = [],
      submittedBy,
      startDate,
      endDate,
      limit = 50,
      offset = 0,
    } = args;

    // Start with base query - use the most specific index first
    let evidenceQuery;
    if (projectId) {
      evidenceQuery = ctx.db
        .query('evidence')
        .withIndex('by_project', q => q.eq('projectId', projectId));
    } else if (standardId) {
      evidenceQuery = ctx.db
        .query('evidence')
        .withIndex('by_standard', q => q.eq('standardId', standardId));
    } else if (criteriaId) {
      evidenceQuery = ctx.db
        .query('evidence')
        .withIndex('by_criteria', q => q.eq('criteriaId', criteriaId));
    } else if (submittedBy) {
      evidenceQuery = ctx.db
        .query('evidence')
        .withIndex('by_submitted_by', q => q.eq('submittedBy', submittedBy));
    } else {
      evidenceQuery = ctx.db.query('evidence');
    }

    // Collect all evidence and apply remaining filters
    let evidenceList = await evidenceQuery.collect();

    // Apply status filter
    if (status.length > 0) {
      evidenceList = evidenceList.filter(evidence => status.includes(evidence.status));
    }

    // Apply evidence type filter
    if (evidenceType.length > 0) {
      evidenceList = evidenceList.filter(evidence => evidenceType.includes(evidence.evidenceType));
    }

    // Apply tags filter
    if (tags.length > 0) {
      evidenceList = evidenceList.filter(evidence => tags.some(tag => evidence.tags.includes(tag)));
    }

    // Apply date range filter
    if (startDate && endDate) {
      evidenceList = evidenceList.filter(
        evidence => evidence.createdAt >= startDate && evidence.createdAt <= endDate
      );
    }

    // Sort by creation date (newest first)
    evidenceList.sort((a, b) => b.createdAt - a.createdAt);

    // Apply pagination
    const paginatedList = evidenceList.slice(offset, offset + limit);

    // Get related data for each evidence item
    const evidenceWithDetails = await Promise.all(
      paginatedList.map(async evidence => {
        const [project, criteria, standard, submittedByUser] = await Promise.all([
          ctx.db.get(evidence.projectId),
          ctx.db.get(evidence.criteriaId),
          ctx.db.get(evidence.standardId),
          ctx.db.get(evidence.submittedBy),
        ]);

        return {
          ...evidence,
          project,
          criteria,
          standard,
          submittedByUser,
        };
      })
    );

    return {
      evidence: evidenceWithDetails,
      totalCount: evidenceList.length,
      hasMore: offset + limit < evidenceList.length,
    };
  },
});

/**
 * Bulk update evidence status
 */
export const bulkUpdateEvidenceStatus = mutation({
  args: {
    evidenceIds: v.array(v.id('evidence')),
    status: v.union(
      v.literal('draft'),
      v.literal('submitted'),
      v.literal('under_review'),
      v.literal('approved'),
      v.literal('rejected'),
      v.literal('archived')
    ),
    initiatedBy: v.id('users'),
  },
  handler: async (ctx, args) => {
    const operationId = `bulk-status-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    // Get first project ID for the bulk operation record
    const firstEvidence = await ctx.db.get(args.evidenceIds[0]);
    if (!firstEvidence) {
      throw new Error('First evidence not found');
    }

    // Create bulk operation record
    const bulkOperationId = await ctx.db.insert('evidenceBulkOperations', {
      operationId,
      projectId: firstEvidence.projectId,
      operationType: 'status_update',
      status: 'processing',
      totalItems: args.evidenceIds.length,
      processedItems: 0,
      failedItems: 0,
      initiatedBy: args.initiatedBy,
      startedAt: now,
      createdAt: now,
    });

    // Process each evidence item
    const results = [];
    for (const evidenceId of args.evidenceIds) {
      try {
        await ctx.db.patch(evidenceId, {
          status: args.status,
          updatedAt: now,
        });

        results.push({
          evidenceId,
          status: 'success',
        });

        // Update progress
        await ctx.db.patch(bulkOperationId, {
          processedItems: results.length,
        });
      } catch (error) {
        results.push({
          evidenceId,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        // Update progress with failure
        await ctx.db.patch(bulkOperationId, {
          processedItems: results.length,
          failedItems: results.filter(r => r.status === 'failed').length,
        });
      }
    }

    // Mark operation as completed
    await ctx.db.patch(bulkOperationId, {
      status: 'completed',
      completedAt: Date.now(),
      results,
    });

    return {
      operationId,
      success: true,
      totalProcessed: results.length,
      failed: results.filter(r => r.status === 'failed').length,
    };
  },
});

/**
 * Get evidence statistics for a project
 */
export const getEvidenceStatistics = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const allEvidence = await ctx.db
      .query('evidence')
      .withIndex('by_project', q => q.eq('projectId', args.projectId))
      .collect();

    const statistics = {
      total: allEvidence.length,
      byStatus: {
        draft: 0,
        submitted: 0,
        under_review: 0,
        approved: 0,
        rejected: 0,
        archived: 0,
      },
      byType: {
        document: 0,
        link: 0,
        text: 0,
        file: 0,
      },
      latestSubmission: 0,
    };

    allEvidence.forEach(evidence => {
      statistics.byStatus[evidence.status]++;
      statistics.byType[evidence.evidenceType]++;

      if (evidence.submittedAt && evidence.submittedAt > statistics.latestSubmission) {
        statistics.latestSubmission = evidence.submittedAt;
      }
    });

    return statistics;
  },
});

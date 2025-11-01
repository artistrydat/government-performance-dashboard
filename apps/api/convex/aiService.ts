import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * AI Service for integrating with Llama AI models
 * Provides prediction generation, model management, and mock services for development
 */

// Types for AI predictions
export interface AIPredictionRequest {
  projectId: string;
  predictionType: 'failure' | 'delay' | 'budget' | 'compliance';
  inputData: any;
  model?: string;
}

export interface AIPredictionResponse {
  predictionId: string;
  type: string;
  confidence: number;
  predictedValue: any;
  timeHorizon: number;
  reasoning: string;
  recommendations: string[];
  generatedAt: number;
  modelUsed: string;
}

export interface AIModelInfo {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  maxTokens: number;
  contextWindow: number;
  rateLimit: number;
}

// Configuration for AI service
const AI_CONFIG = {
  // Default model configuration
  defaultModel: 'llama-3-70b-instruct',

  // Rate limiting (requests per minute)
  rateLimit: 60,

  // Timeout for API calls (milliseconds)
  timeout: 30000,

  // Retry configuration
  maxRetries: 3,
  retryDelay: 1000,

  // Mock mode for development
  useMockService: process.env.NODE_ENV === 'development' || !process.env.LLAMA_API_KEY,
};

/**
 * Generate AI prediction for a project
 */
export const generatePrediction = mutation({
  args: {
    projectId: v.id('projects'),
    predictionType: v.union(
      v.literal('failure'),
      v.literal('delay'),
      v.literal('budget'),
      v.literal('compliance')
    ),
    inputData: v.any(),
    model: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<AIPredictionResponse> => {
    const { projectId, predictionType, inputData, model } = args;

    // Rate limiting check
    await checkRateLimit(ctx);

    // Prepare request data
    const requestData: AIPredictionRequest = {
      projectId,
      predictionType,
      inputData,
      model: model || AI_CONFIG.defaultModel,
    };

    // Generate prediction using real or mock service
    let prediction: AIPredictionResponse;

    if (AI_CONFIG.useMockService) {
      prediction = await generateMockPrediction(requestData);
    } else {
      prediction = await generateRealPrediction(requestData);
    }

    // Store prediction in database
    const predictionId = await ctx.db.insert('ai_predictions', {
      type: predictionType,
      confidence: prediction.confidence,
      predictedValue: prediction.predictedValue,
      timeHorizon: prediction.timeHorizon,
      reasoning: prediction.reasoning,
      recommendations: prediction.recommendations,
      generatedAt: Date.now(),
      isActive: true,
      projectId,
      modelUsed: prediction.modelUsed,
    });

    return {
      ...prediction,
      predictionId,
    };
  },
});

/**
 * Get available AI models
 */
export const getAvailableModels = query({
  args: {},
  handler: async (): Promise<AIModelInfo[]> => {
    if (AI_CONFIG.useMockService) {
      return getMockModels();
    } else {
      return getRealModels();
    }
  },
});

/**
 * Check API health and availability
 */
export const checkAIHealth = query({
  args: {},
  handler: async (): Promise<{ status: string; models: string[]; rateLimit: number }> => {
    if (AI_CONFIG.useMockService) {
      return {
        status: 'mock_mode',
        models: ['llama-3-70b-instruct', 'llama-3-8b-instruct'],
        rateLimit: AI_CONFIG.rateLimit,
      };
    } else {
      return await checkRealAIHealth();
    }
  },
});

// Export helper functions for testing
export { generateMockPrediction, getMockModels, parseAIResponse, AI_CONFIG };

/**
 * Generate prediction using real Llama AI API
 */
async function generateRealPrediction(request: AIPredictionRequest): Promise<AIPredictionResponse> {
  const apiKey = process.env.LLAMA_API_KEY;
  if (!apiKey) {
    throw new Error('LLAMA_API_KEY environment variable is required for real AI service');
  }

  const apiUrl = process.env.LLAMA_API_URL || 'https://api.llama.ai/v1';

  const requestBody = {
    model: request.model,
    messages: [
      {
        role: 'system',
        content: `You are an AI assistant specialized in government project risk assessment. 
        Analyze the provided project data and generate a ${request.predictionType} prediction.
        Provide a confidence score (0-1), reasoning, and actionable recommendations.
        Focus on government project management best practices and PMI standards.`,
      },
      {
        role: 'user',
        content: JSON.stringify(request.inputData),
      },
    ],
    max_tokens: 1000,
    temperature: 0.3,
  };

  let retries = 0;
  while (retries <= AI_CONFIG.maxRetries) {
    try {
      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 429 && retries < AI_CONFIG.maxRetries) {
          // Rate limited, wait and retry
          await new Promise(resolve => setTimeout(resolve, AI_CONFIG.retryDelay * (retries + 1)));
          retries++;
          continue;
        }
        throw new Error(`AI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Parse the AI response to extract structured prediction
      return parseAIResponse(data, request.predictionType);
    } catch (error) {
      if (retries < AI_CONFIG.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, AI_CONFIG.retryDelay * (retries + 1)));
        retries++;
        continue;
      }
      throw new Error(`Failed to generate AI prediction after ${retries} retries: ${error}`);
    }
  }

  throw new Error('Max retries exceeded for AI prediction');
}

/**
 * Generate mock prediction for development
 */
async function generateMockPrediction(request: AIPredictionRequest): Promise<AIPredictionResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  // Generate realistic mock predictions based on prediction type
  const mockPredictions = {
    failure: {
      confidence: 0.75 + Math.random() * 0.2,
      predictedValue: Math.random() > 0.7 ? 'high_risk' : 'medium_risk',
      timeHorizon: 30 + Math.floor(Math.random() * 60),
      reasoning:
        'Project shows signs of scope creep and resource constraints. Historical data indicates similar projects had 65% failure rate.',
      recommendations: [
        'Conduct scope review with stakeholders',
        'Reallocate resources to critical path activities',
        'Implement weekly risk review meetings',
      ],
    },
    delay: {
      confidence: 0.8 + Math.random() * 0.15,
      predictedValue: 15 + Math.floor(Math.random() * 45),
      timeHorizon: 30,
      reasoning:
        'Current velocity suggests 3-6 week delay based on milestone completion rates and dependency analysis.',
      recommendations: [
        'Accelerate critical path activities',
        'Review and optimize resource allocation',
        'Communicate potential delays to stakeholders early',
      ],
    },
    budget: {
      confidence: 0.7 + Math.random() * 0.25,
      predictedValue: 1.1 + Math.random() * 0.3,
      timeHorizon: 90,
      reasoning:
        'Expenditure patterns and vendor costs indicate potential 10-30% budget overrun based on current burn rate.',
      recommendations: [
        'Implement stricter budget controls',
        'Review vendor contracts and negotiate better terms',
        'Identify cost-saving opportunities in non-critical areas',
      ],
    },
    compliance: {
      confidence: 0.85 + Math.random() * 0.1,
      predictedValue: 70 + Math.floor(Math.random() * 25),
      timeHorizon: 60,
      reasoning:
        'Documentation gaps and process deviations indicate potential compliance issues with PMI standards.',
      recommendations: [
        'Conduct compliance audit immediately',
        'Update project documentation to meet standards',
        'Provide team training on compliance requirements',
      ],
    },
  };

  const mockData = mockPredictions[request.predictionType];

  return {
    predictionId: `mock_${Date.now()}`,
    type: request.predictionType,
    confidence: mockData.confidence,
    predictedValue: mockData.predictedValue,
    timeHorizon: mockData.timeHorizon,
    reasoning: mockData.reasoning,
    recommendations: mockData.recommendations,
    generatedAt: Date.now(),
    modelUsed: 'mock-llama-3-70b-instruct',
  };
}

/**
 * Parse AI API response into structured prediction
 */
function parseAIResponse(aiResponse: any, predictionType: string): AIPredictionResponse {
  // Extract the main content from the AI response
  const content = aiResponse.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Invalid AI response: no content found');
  }

  // Parse the structured response (assuming JSON format)
  try {
    const parsed = JSON.parse(content);

    return {
      predictionId: aiResponse.id || `ai_${Date.now()}`,
      type: predictionType,
      confidence: parsed.confidence || 0.5,
      predictedValue: parsed.predictedValue,
      timeHorizon: parsed.timeHorizon || 30,
      reasoning: parsed.reasoning || 'AI analysis based on project data patterns',
      recommendations: parsed.recommendations || ['Review project data for specific insights'],
      generatedAt: Date.now(),
      modelUsed: aiResponse.model || 'unknown',
    };
  } catch (error) {
    // Fallback parsing for non-JSON responses
    return {
      predictionId: aiResponse.id || `ai_${Date.now()}`,
      type: predictionType,
      confidence: 0.5,
      predictedValue: 'analysis_completed',
      timeHorizon: 30,
      reasoning: content,
      recommendations: ['Review AI analysis for specific recommendations'],
      generatedAt: Date.now(),
      modelUsed: aiResponse.model || 'unknown',
    };
  }
}

/**
 * Get available models from real AI service
 */
async function getRealModels(): Promise<AIModelInfo[]> {
  const apiKey = process.env.LLAMA_API_KEY;
  if (!apiKey) {
    throw new Error('LLAMA_API_KEY environment variable is required');
  }

  const apiUrl = process.env.LLAMA_API_URL || 'https://api.llama.ai/v1';

  try {
    const response = await fetch(`${apiUrl}/models`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const data = await response.json();

    return data.data.map((model: any) => ({
      id: model.id,
      name: model.id,
      description: `Llama model ${model.id}`,
      capabilities: ['text-generation', 'risk-prediction'],
      maxTokens: model.context_window || 4096,
      contextWindow: model.context_window || 4096,
      rateLimit: AI_CONFIG.rateLimit,
    }));
  } catch (error) {
    console.error('Failed to fetch real models, falling back to mock:', error);
    return getMockModels();
  }
}

/**
 * Get mock models for development
 */
function getMockModels(): AIModelInfo[] {
  return [
    {
      id: 'llama-3-70b-instruct',
      name: 'Llama 3 70B Instruct',
      description: 'Large language model optimized for instruction following and complex reasoning',
      capabilities: ['risk-prediction', 'root-cause-analysis', 'recommendation-generation'],
      maxTokens: 4096,
      contextWindow: 4096,
      rateLimit: 60,
    },
    {
      id: 'llama-3-8b-instruct',
      name: 'Llama 3 8B Instruct',
      description: 'Efficient language model for fast inference and basic risk assessment',
      capabilities: ['risk-prediction', 'basic-analysis'],
      maxTokens: 4096,
      contextWindow: 4096,
      rateLimit: 120,
    },
  ];
}

/**
 * Check real AI service health
 */
async function checkRealAIHealth(): Promise<{
  status: string;
  models: string[];
  rateLimit: number;
}> {
  try {
    const models = await getRealModels();
    return {
      status: 'healthy',
      models: models.map(m => m.id),
      rateLimit: AI_CONFIG.rateLimit,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      models: [],
      rateLimit: 0,
    };
  }
}

/**
 * Rate limiting implementation
 */
async function checkRateLimit(ctx: any): Promise<void> {
  // Simple in-memory rate limiting for development
  // In production, consider using Redis or similar for distributed rate limiting

  const userId = (await ctx.auth.getUserIdentity())?.subject;
  if (!userId) {
    throw new Error('Authentication required for AI service');
  }

  // TODO: Implement proper rate limiting with persistent storage
  // For now, we'll use a simple approach
  const currentMinute = Math.floor(Date.now() / 60000);
  const userKey = `rate_limit:${userId}:${currentMinute}`;

  // This is a simplified implementation - in production, use a proper rate limiting solution
  console.log(`Rate limit check for user ${userId} at minute ${currentMinute}`);

  // Always allow for now in development
  return;
}

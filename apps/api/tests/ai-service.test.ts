import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock environment variables
vi.stubEnv('NODE_ENV', 'test');
vi.stubEnv('LLAMA_API_KEY', 'test-api-key');

// Mock fetch globally
global.fetch = vi.fn();

describe('AI Service Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('mock prediction generation', () => {
    it('should generate realistic failure predictions', async () => {
      const { generateMockPrediction } = await import('../convex/aiService');

      const request = {
        projectId: 'test-project',
        predictionType: 'failure' as const,
        inputData: {},
      };

      const result = await generateMockPrediction(request);

      expect(result.type).toBe('failure');
      expect(result.confidence).toBeGreaterThan(0.75);
      expect(result.predictedValue).toMatch(/high_risk|medium_risk/);
      expect(result.timeHorizon).toBeGreaterThanOrEqual(30);
      expect(result.timeHorizon).toBeLessThanOrEqual(90);
      expect(result.reasoning).toContain('scope creep');
      expect(result.recommendations.some((rec: string) => rec.includes('scope review'))).toBe(true);
    });

    it('should generate realistic delay predictions', async () => {
      const { generateMockPrediction } = await import('../convex/aiService');

      const request = {
        projectId: 'test-project',
        predictionType: 'delay' as const,
        inputData: {},
      };

      const result = await generateMockPrediction(request);

      expect(result.type).toBe('delay');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.predictedValue).toBeGreaterThanOrEqual(15);
      expect(result.predictedValue).toBeLessThanOrEqual(60);
      expect(result.reasoning).toContain('delay');
      expect(result.recommendations.some((rec: string) => rec.includes('critical path'))).toBe(
        true
      );
    });

    it('should generate realistic budget predictions', async () => {
      const { generateMockPrediction } = await import('../convex/aiService');

      const request = {
        projectId: 'test-project',
        predictionType: 'budget' as const,
        inputData: {},
      };

      const result = await generateMockPrediction(request);

      expect(result.type).toBe('budget');
      expect(result.confidence).toBeGreaterThan(0.7);
      expect(result.predictedValue).toBeGreaterThan(1.1);
      expect(result.predictedValue).toBeLessThan(1.4);
      expect(result.reasoning).toContain('budget');
      expect(result.recommendations.some((rec: string) => rec.includes('budget controls'))).toBe(
        true
      );
    });

    it('should generate realistic compliance predictions', async () => {
      const { generateMockPrediction } = await import('../convex/aiService');

      const request = {
        projectId: 'test-project',
        predictionType: 'compliance' as const,
        inputData: {},
      };

      const result = await generateMockPrediction(request);

      expect(result.type).toBe('compliance');
      expect(result.confidence).toBeGreaterThan(0.85);
      expect(result.predictedValue).toBeGreaterThanOrEqual(70);
      expect(result.predictedValue).toBeLessThanOrEqual(95);
      expect(result.reasoning).toContain('compliance');
      expect(result.recommendations.some((rec: string) => rec.includes('compliance audit'))).toBe(
        true
      );
    });
  });

  describe('model utilities', () => {
    it('should return mock models', async () => {
      const { getMockModels } = await import('../convex/aiService');

      const result = getMockModels();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);

      const model = result[0];
      expect(model).toHaveProperty('id');
      expect(model).toHaveProperty('name');
      expect(model).toHaveProperty('description');
      expect(model).toHaveProperty('capabilities');
      expect(model).toHaveProperty('maxTokens');
      expect(model).toHaveProperty('contextWindow');
      expect(model).toHaveProperty('rateLimit');
    });

    it('should include expected model capabilities', async () => {
      const { getMockModels } = await import('../convex/aiService');

      const result = getMockModels();

      const llama70b = result.find((m: any) => m.id === 'llama-3-70b-instruct');
      expect(llama70b).toBeDefined();
      expect(llama70b?.capabilities).toContain('risk-prediction');
      expect(llama70b?.capabilities).toContain('root-cause-analysis');
      expect(llama70b?.capabilities).toContain('recommendation-generation');
    });
  });

  describe('response parsing', () => {
    it('should parse AI responses correctly', async () => {
      const { parseAIResponse } = await import('../convex/aiService');

      const mockAIResponse = {
        id: 'test-id',
        model: 'llama-3-70b-instruct',
        choices: [
          {
            message: {
              content: JSON.stringify({
                confidence: 0.85,
                predictedValue: 'high_risk',
                timeHorizon: 45,
                reasoning: 'Test reasoning',
                recommendations: ['Test recommendation'],
              }),
            },
          },
        ],
      };

      const result = parseAIResponse(mockAIResponse, 'failure');

      expect(result.type).toBe('failure');
      expect(result.confidence).toBe(0.85);
      expect(result.predictedValue).toBe('high_risk');
      expect(result.timeHorizon).toBe(45);
      expect(result.reasoning).toBe('Test reasoning');
      expect(result.recommendations).toEqual(['Test recommendation']);
      expect(result.modelUsed).toBe('llama-3-70b-instruct');
    });

    it('should handle non-JSON responses gracefully', async () => {
      const { parseAIResponse } = await import('../convex/aiService');

      const mockAIResponse = {
        id: 'test-id',
        model: 'llama-3-70b-instruct',
        choices: [
          {
            message: {
              content: 'This is a plain text response without JSON',
            },
          },
        ],
      };

      const result = parseAIResponse(mockAIResponse, 'failure');

      expect(result.type).toBe('failure');
      expect(result.confidence).toBe(0.5); // Default confidence
      expect(result.predictedValue).toBe('analysis_completed');
      expect(result.timeHorizon).toBe(30); // Default time horizon
      expect(result.reasoning).toBe('This is a plain text response without JSON');
      expect(result.recommendations).toEqual(['Review AI analysis for specific recommendations']);
    });
  });
});

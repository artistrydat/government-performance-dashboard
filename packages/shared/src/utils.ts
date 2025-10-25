// Shared utility functions for the Government Performance Management Dashboard

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Calculate health score based on project status and risks
 */
export function calculateHealthScore(
  status: string,
  risks: Array<{ severity: string; probability: number }>
): number {
  let baseScore = 100;

  // Adjust based on project status
  const statusMultipliers = {
    planned: 1.0,
    active: 0.9,
    'at-risk': 0.7,
    delayed: 0.6,
    completed: 1.0,
  };

  baseScore *= statusMultipliers[status as keyof typeof statusMultipliers] || 1.0;

  // Adjust based on risks
  const riskMultipliers = {
    low: 0.95,
    medium: 0.85,
    high: 0.7,
    critical: 0.5,
  };

  risks.forEach(risk => {
    const multiplier = riskMultipliers[risk.severity as keyof typeof riskMultipliers] || 1.0;
    baseScore *= multiplier * (1 - risk.probability * 0.1);
  });

  return Math.max(0, Math.min(100, Math.round(baseScore)));
}

/**
 * Validate budget input
 */
export function validateBudget(budget: number): boolean {
  return budget >= 0 && budget <= 1000000000; // Max 1 billion
}

/**
 * Generate a unique ID (placeholder for actual ID generation)
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

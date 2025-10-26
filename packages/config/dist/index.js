// Configuration files for the Government Performance Management Dashboard
export const APP_CONFIG = {
    name: 'Government Performance Management Dashboard',
    version: '1.0.0',
    description: 'AI-powered dashboard for government project performance monitoring',
    author: 'Government Digital Services',
    repository: 'https://github.com/gov-digital-services/performance-dashboard',
};
export const API_CONFIG = {
    baseUrl: process.env.CONVEX_URL || 'http://localhost:3000',
    timeout: 30000,
    retryAttempts: 3,
};
export const AI_CONFIG = {
    model: 'llama-3-70b',
    maxTokens: 4096,
    temperature: 0.7,
    apiKey: process.env.AI_API_KEY || '',
};
export const AUTH_CONFIG = {
    ssoProvider: 'government-sso',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
};
//# sourceMappingURL=index.js.map
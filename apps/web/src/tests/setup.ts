import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage for tests
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock Convex client for tests
vi.mock('../lib/convex', () => ({
  default: {
    query: vi.fn(),
    mutation: vi.fn(),
  },
}));

// Mock environment variables
vi.stubEnv('VITE_CONVEX_URL', 'https://mock-convex-url.convex.cloud');

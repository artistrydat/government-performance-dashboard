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
// Mock convex/react hooks and provider used in the app so tests don't require a live Convex client
vi.mock('convex/react', () => {
  return {
    // ConvexProvider simply returns children in tests
    ConvexProvider: ({ children }: any) => children,
    // useQuery returns null by default (no data)
    useQuery: () => null,
    // useMutation returns a stubbed async function
    useMutation: () => {
      return async () => ({});
    },
  };
});

// Mock environment variables
vi.stubEnv('VITE_CONVEX_URL', 'https://dependable-cat-853.convex.cloud');

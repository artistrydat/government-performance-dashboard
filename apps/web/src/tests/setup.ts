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
    // Flexible useQuery mock: inspect the passed function or args and return fixtures
    useQuery: (fn?: any, args?: any) => {
      // Default preferences fixture
      const defaultPrefs = {
        theme: 'light',
        dashboardLayout: {
          widgets: [],
          layoutType: 'grid',
        },
        defaultView: {
          executive: 'ExecutiveDashboard',
          portfolio_manager: 'PortfolioList',
          project_officer: 'ProjectList',
        },
        notifications: {
          email: false,
          push: false,
          riskAlerts: false,
          projectUpdates: false,
        },
        accessibility: {
          fontSize: 'medium',
          highContrast: false,
          reducedMotion: false,
        },
      };

      try {
        const fnString = fn && (fn.name || String(fn));

        // If the query looks like getUserPreferences, return a prefs object;
        // vary by args.userId so tests can exercise different branches.
        if (fnString && /getUserPreferences/i.test(fnString)) {
          const userId = args && args.userId ? String(args.userId) : '';
          if (userId.includes('dark')) {
            return { ...defaultPrefs, theme: 'dark' };
          }
          if (userId.includes('auto')) {
            return { ...defaultPrefs, theme: 'auto' };
          }
          // default
          return defaultPrefs;
        }
      } catch (e) {
        // fallthrough to default null
      }

      // By default return null (no data)
      return null;
    },

    // useMutation returns a stubbed async function which returns sensible values
    useMutation: (fn?: any) => {
      return async () => {
        const fnString = fn && (fn.name || String(fn));
        if (fnString && /resetUserPreferences/i.test(fnString)) {
          // return default prefs on reset
          return {
            theme: 'light',
            dashboardLayout: { widgets: [], layoutType: 'grid' },
            defaultView: {
              executive: 'ExecutiveDashboard',
              portfolio_manager: 'PortfolioList',
              project_officer: 'ProjectList',
            },
            notifications: { email: false, push: false, riskAlerts: false, projectUpdates: false },
            accessibility: { fontSize: 'medium', highContrast: false, reducedMotion: false },
          };
        }
        // for updates, pretend success
        return {};
      };
    },
  };
});

// Mock environment variables
vi.stubEnv('VITE_CONVEX_URL', 'https://dependable-cat-853.convex.cloud');

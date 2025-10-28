import { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../api/convex/_generated/api';
import { Id } from '../../../api/convex/_generated/dataModel';

// Real-time subscription hook with loading states and error handling
export function useRealTimeSubscription<T>(
  query: () => T | undefined,
  options: {
    enabled?: boolean;
    onSuccess?: (data: T) => void;
  } = {}
) {
  const { enabled = true, onSuccess } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const queryData = query();

  useEffect(() => {
    if (!enabled) return;

    setIsLoading(queryData === undefined);

    if (queryData !== undefined) {
      setLastUpdated(new Date());
      onSuccess?.(queryData);
    }
  }, [queryData, enabled, onSuccess]);

  return {
    data: queryData,
    isLoading,
    lastUpdated,
    refetch: () => {
      // Convex automatically refetches on data changes
      setLastUpdated(new Date());
    },
  };
}

// Optimistic update hook
export function useOptimisticMutation<TArgs extends any[], TResult>(
  mutation: (...mutationArgs: TArgs) => Promise<TResult>,
  onSuccess?: () => void,
  onError?: () => void
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...mutationArgs: TArgs) => {
      setIsPending(true);
      setError(null);

      try {
        const result = await mutation(...mutationArgs);
        setIsPending(false);
        onSuccess?.();
        return result;
      } catch (err) {
        setIsPending(false);
        const error = err instanceof Error ? err : new Error('Mutation failed');
        setError(error);
        onError?.();
        throw error;
      }
    },
    [mutation, onSuccess, onError]
  );

  return {
    execute,
    isPending,
    error,
  };
}

// Data refresh indicator hook
export function useDataRefreshIndicator(refreshInterval = 30000) {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    setLastRefresh(new Date());
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  // Auto-refresh at interval
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, refresh]);

  return {
    lastRefresh,
    isRefreshing,
    refresh,
  };
}

// Offline capability hook
export function useOfflineSync<T>(
  query: () => T | undefined,
  mutation: (...mutationArgs: any[]) => Promise<any>,
  storageKey: string
) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingMutations, setPendingMutations] = useState<any[]>([]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load pending mutations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setPendingMutations(JSON.parse(saved));
      } catch {
        setPendingMutations([]);
      }
    }
  }, [storageKey]);

  // Save pending mutations to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(pendingMutations));
  }, [pendingMutations, storageKey]);

  // Execute pending mutations when coming online
  useEffect(() => {
    if (isOnline && pendingMutations.length > 0) {
      const executePending = async () => {
        const successes: any[] = [];
        const failures: any[] = [];

        for (const mutationArgs of pendingMutations) {
          try {
            await mutation(...mutationArgs);
            successes.push(mutationArgs);
          } catch {
            failures.push(mutationArgs);
          }
        }

        // Clear successful mutations, keep failures for retry
        setPendingMutations(failures);
      };

      executePending();
    }
  }, [isOnline, pendingMutations, mutation]);

  const queueMutation = useCallback(
    (...mutationArgs: any[]) => {
      if (isOnline) {
        return mutation(...mutationArgs);
      } else {
        setPendingMutations(prev => [...prev, mutationArgs]);
        return Promise.resolve(); // Return resolved promise for offline
      }
    },
    [isOnline, mutation]
  );

  const data = query();

  return {
    data: isOnline
      ? data
      : data || JSON.parse(localStorage.getItem(`${storageKey}_cache`) || 'null'),
    isOnline,
    isOffline: !isOnline,
    pendingMutationsCount: pendingMutations.length,
    queueMutation,
  };
}

// Performance optimized real-time hook
export function useOptimizedRealTime<T>(
  query: () => T | undefined,
  options: {
    throttleInterval?: number;
    debounceInterval?: number;
    enabled?: boolean;
  } = {}
) {
  const { throttleInterval = 1000, debounceInterval = 500, enabled = true } = options;
  const [optimizedData, setOptimizedData] = useState<T | undefined>(undefined);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  const queryData = enabled ? query() : undefined;

  // Throttle updates to prevent excessive re-renders
  useEffect(() => {
    if (!enabled || queryData === undefined) return;

    const now = Date.now();
    if (now - lastUpdate >= throttleInterval) {
      setOptimizedData(queryData);
      setLastUpdate(now);
    }
  }, [queryData, enabled, lastUpdate, throttleInterval]);

  // Debounce for rapid successive updates
  useEffect(() => {
    if (!enabled || queryData === undefined) return;

    const timeout = setTimeout(() => {
      setOptimizedData(queryData);
      setLastUpdate(Date.now());
    }, debounceInterval);

    return () => clearTimeout(timeout);
  }, [queryData, enabled, debounceInterval]);

  return optimizedData;
}

// Real-time dashboard statistics hook
export function useDashboardStatistics() {
  const portfolios = useQuery(api.portfolios.list);
  const projects = useQuery(api.projects.list);
  const risks = useQuery(api.risks.list);

  const statistics = {
    totalPortfolios: portfolios?.length || 0,
    totalProjects: projects?.length || 0,
    totalRisks: risks?.length || 0,
    criticalRisks: risks?.filter(r => r.severity === 'critical').length || 0,
    totalBudget: projects?.reduce((sum, p) => sum + p.budget, 0) || 0,
    averageHealthScore: portfolios?.length
      ? portfolios.reduce((sum, p) => sum + p.healthScore, 0) / portfolios.length
      : 0,
  };

  return useRealTimeSubscription(() => statistics, {
    enabled: portfolios !== undefined && projects !== undefined && risks !== undefined,
  });
}

// Real-time portfolio health monitoring
export function usePortfolioHealthMonitor(portfolioId: Id<'portfolios'> | null) {
  const portfolio = useQuery(api.portfolios.get, portfolioId ? { portfolioId } : 'skip');
  const projects = useQuery(api.projects.listByPortfolio, portfolioId ? { portfolioId } : 'skip');

  const healthData = {
    portfolio,
    projects: projects || [],
    healthScore: portfolio?.healthScore || 0,
    projectCount: projects?.length || 0,
    riskCount:
      projects?.reduce(
        (sum, p) => sum + (p.riskLevel === 'high' || p.riskLevel === 'critical' ? 1 : 0),
        0
      ) || 0,
  };

  return useRealTimeSubscription(() => healthData, {
    enabled: portfolioId !== null,
  });
}

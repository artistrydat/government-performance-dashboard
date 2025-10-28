import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  useRealTimeSubscription,
  useDataRefreshIndicator,
  useOptimisticMutation,
} from '../../hooks/useRealTime';

// Mock Convex query
const mockQuery = vi.fn();

describe('useRealTimeSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state when data is undefined', () => {
    mockQuery.mockReturnValue(undefined);

    const { result } = renderHook(() => useRealTimeSubscription(mockQuery));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.lastUpdated).toBeNull();
  });

  it('should return data and update loading state when data is available', () => {
    const testData = { items: ['test1', 'test2'] };
    mockQuery.mockReturnValue(testData);

    const { result } = renderHook(() => useRealTimeSubscription(mockQuery));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(testData);
    expect(result.current.lastUpdated).toBeInstanceOf(Date);
  });

  it('should call onSuccess callback when data becomes available', () => {
    const testData = { items: ['test1', 'test2'] };
    const onSuccess = vi.fn();
    mockQuery.mockReturnValue(testData);

    renderHook(() => useRealTimeSubscription(mockQuery, { onSuccess }));

    expect(onSuccess).toHaveBeenCalledWith(testData);
  });

  it('should handle refetch function', () => {
    const testData = { items: ['test1'] };
    mockQuery.mockReturnValue(testData);

    const { result } = renderHook(() => useRealTimeSubscription(mockQuery));

    const initialLastUpdated = result.current.lastUpdated;

    act(() => {
      result.current.refetch();
    });

    expect(result.current.lastUpdated).not.toBe(initialLastUpdated);
  });
});

describe('useDataRefreshIndicator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with current time and not refreshing', () => {
    const { result } = renderHook(() => useDataRefreshIndicator());

    expect(result.current.lastRefresh).toBeInstanceOf(Date);
    expect(result.current.isRefreshing).toBe(false);
  });

  it('should set refreshing state when refresh is called', () => {
    const { result } = renderHook(() => useDataRefreshIndicator());

    act(() => {
      result.current.refresh();
    });

    expect(result.current.isRefreshing).toBe(true);
    expect(result.current.lastRefresh).toBeInstanceOf(Date);
  });

  it('should clear refreshing state after delay', () => {
    const { result } = renderHook(() => useDataRefreshIndicator());

    act(() => {
      result.current.refresh();
    });

    expect(result.current.isRefreshing).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.isRefreshing).toBe(false);
  });

  it('should auto-refresh at specified interval', () => {
    const refreshInterval = 5000;
    const { result } = renderHook(() => useDataRefreshIndicator(refreshInterval));

    const initialLastRefresh = result.current.lastRefresh;

    act(() => {
      vi.advanceTimersByTime(refreshInterval);
    });

    expect(result.current.lastRefresh).not.toBe(initialLastRefresh);
  });
});

describe('useOptimisticMutation', () => {
  const mockMutation = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default states', () => {
    const { result } = renderHook(() =>
      useOptimisticMutation(mockMutation, mockOnSuccess, mockOnError)
    );

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set pending state during mutation execution', async () => {
    mockMutation.mockResolvedValue('success');

    const { result } = renderHook(() =>
      useOptimisticMutation(mockMutation, mockOnSuccess, mockOnError)
    );

    let mutationPromise: Promise<any>;

    act(() => {
      mutationPromise = result.current.execute('arg1', 'arg2');
    });

    expect(result.current.isPending).toBe(true);

    await act(async () => {
      await mutationPromise!;
    });

    expect(result.current.isPending).toBe(false);
  });

  it('should call onSuccess when mutation succeeds', async () => {
    const successResult = { id: '123', name: 'test' };
    mockMutation.mockResolvedValue(successResult);

    const { result } = renderHook(() =>
      useOptimisticMutation(mockMutation, mockOnSuccess, mockOnError)
    );

    await act(async () => {
      await result.current.execute('arg1', 'arg2');
    });

    expect(mockOnSuccess).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('should set error state when mutation fails', async () => {
    const error = new Error('Mutation failed');
    mockMutation.mockRejectedValue(error);

    const { result } = renderHook(() =>
      useOptimisticMutation(mockMutation, mockOnSuccess, mockOnError)
    );

    await act(async () => {
      try {
        await result.current.execute('arg1', 'arg2');
      } catch (e) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Mutation failed');
    expect(mockOnError).toHaveBeenCalled();
  });

  it('should clear error state on new execution', async () => {
    const error = new Error('First attempt failed');
    mockMutation.mockRejectedValueOnce(error).mockResolvedValueOnce('success');

    const { result } = renderHook(() =>
      useOptimisticMutation(mockMutation, mockOnSuccess, mockOnError)
    );

    // First attempt - fails
    await act(async () => {
      try {
        await result.current.execute('arg1');
      } catch (e) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBeInstanceOf(Error);

    // Second attempt - succeeds
    await act(async () => {
      await result.current.execute('arg1');
    });

    expect(result.current.error).toBeNull();
  });
});

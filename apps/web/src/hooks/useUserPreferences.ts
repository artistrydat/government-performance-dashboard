import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../api/convex/_generated/api';
import { useAuth } from '../lib/auth';
import { useState, useEffect } from 'react';

// User preference types (moved from backend to avoid import issues)
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  dashboardLayout: {
    widgets: Array<{
      id: string;
      type: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
      visible: boolean;
    }>;
    layoutType: 'grid' | 'freeform';
  };
  defaultView: {
    executive: string;
    portfolio_manager: string;
    project_officer: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    riskAlerts: boolean;
    projectUpdates: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reducedMotion: boolean;
  };
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const userId = user?.email || '';

  // Query for user preferences
  const preferences = useQuery(api.userPreferences.getUserPreferences, {
    userId,
  });

  // Mutations for updating preferences
  const updatePreferencesMutation = useMutation(api.userPreferences.updateUserPreferences);
  const resetPreferencesMutation = useMutation(api.userPreferences.resetUserPreferences);

  const [localPreferences, setLocalPreferences] = useState<UserPreferences | null>(null);

  // Initialize local preferences when data loads
  useEffect(() => {
    if (preferences && !localPreferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences, localPreferences]);

  // Update theme in document when preferences change
  useEffect(() => {
    if (localPreferences?.theme) {
      const root = document.documentElement;
      const theme =
        localPreferences.theme === 'auto'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          : localPreferences.theme;

      root.setAttribute('data-theme', theme);
    }
  }, [localPreferences?.theme]);

  // Update accessibility settings
  useEffect(() => {
    if (localPreferences?.accessibility) {
      const { fontSize, highContrast, reducedMotion } = localPreferences.accessibility;
      const root = document.documentElement;

      // Set font size
      root.style.fontSize = fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px';

      // Set high contrast
      if (highContrast) {
        root.setAttribute('data-high-contrast', 'true');
      } else {
        root.removeAttribute('data-high-contrast');
      }

      // Set reduced motion
      if (reducedMotion) {
        root.setAttribute('data-reduced-motion', 'true');
      } else {
        root.removeAttribute('data-reduced-motion');
      }
    }
  }, [localPreferences?.accessibility]);

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!localPreferences) return;

    const updatedPreferences = { ...localPreferences, ...newPreferences };
    setLocalPreferences(updatedPreferences);

    try {
      await updatePreferencesMutation({
        userId,
        preferences: updatedPreferences,
      });
    } catch (error) {
      // Revert local state on error
      setLocalPreferences(localPreferences);
    }
  };

  const resetPreferences = async () => {
    try {
      const defaultPrefs = await resetPreferencesMutation({ userId });
      setLocalPreferences(defaultPrefs);
    } catch (error) {
      // Failed to reset preferences
    }
  };

  const updateDashboardLayout = (widgets: UserPreferences['dashboardLayout']['widgets']) => {
    updatePreferences({
      dashboardLayout: {
        ...localPreferences!.dashboardLayout,
        widgets,
      },
    });
  };

  const updateWidgetVisibility = (widgetId: string, visible: boolean) => {
    const updatedWidgets = localPreferences!.dashboardLayout.widgets.map(widget =>
      widget.id === widgetId ? { ...widget, visible } : widget
    );
    updateDashboardLayout(updatedWidgets);
  };

  const updateWidgetPosition = (widgetId: string, position: { x: number; y: number }) => {
    const updatedWidgets = localPreferences!.dashboardLayout.widgets.map(widget =>
      widget.id === widgetId ? { ...widget, position } : widget
    );
    updateDashboardLayout(updatedWidgets);
  };

  const updateWidgetSize = (widgetId: string, size: { width: number; height: number }) => {
    const updatedWidgets = localPreferences!.dashboardLayout.widgets.map(widget =>
      widget.id === widgetId ? { ...widget, size } : widget
    );
    updateDashboardLayout(updatedWidgets);
  };

  const updateTheme = (theme: UserPreferences['theme']) => {
    updatePreferences({ theme });
  };

  const updateNotifications = (notifications: Partial<UserPreferences['notifications']>) => {
    updatePreferences({
      notifications: {
        ...localPreferences!.notifications,
        ...notifications,
      },
    });
  };

  const updateAccessibility = (accessibility: Partial<UserPreferences['accessibility']>) => {
    updatePreferences({
      accessibility: {
        ...localPreferences!.accessibility,
        ...accessibility,
      },
    });
  };

  return {
    preferences: localPreferences,
    isLoading: !preferences && !localPreferences,
    updatePreferences,
    resetPreferences,
    updateDashboardLayout,
    updateWidgetVisibility,
    updateWidgetPosition,
    updateWidgetSize,
    updateTheme,
    updateNotifications,
    updateAccessibility,
  };
};

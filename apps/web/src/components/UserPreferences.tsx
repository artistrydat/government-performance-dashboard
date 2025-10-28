import React, { useState } from 'react';
import { useUserPreferences, type UserPreferences } from '../hooks/useUserPreferences';

interface UserPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserPreferencesModal: React.FC<UserPreferencesModalProps> = ({ isOpen, onClose }) => {
  const {
    preferences,
    updateTheme,
    updateNotifications,
    updateAccessibility,
    resetPreferences,
    isLoading,
  } = useUserPreferences();

  const [activeTab, setActiveTab] = useState<
    'theme' | 'layout' | 'notifications' | 'accessibility'
  >('theme');

  if (!isOpen || !preferences || isLoading) return null;

  const handleThemeChange = (theme: UserPreferences['theme']) => {
    updateTheme(theme);
  };

  const handleNotificationChange = (
    key: keyof UserPreferences['notifications'],
    value: boolean
  ) => {
    updateNotifications({ [key]: value });
  };

  const handleAccessibilityChange = (key: keyof UserPreferences['accessibility'], value: any) => {
    updateAccessibility({ [key]: value });
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all preferences to default?')) {
      resetPreferences();
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">User Preferences</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle"
            aria-label="Close preferences"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="tabs tabs-boxed mb-6">
          <button
            className={`tab ${activeTab === 'theme' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('theme')}
          >
            Theme
          </button>
          <button
            className={`tab ${activeTab === 'layout' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('layout')}
          >
            Layout
          </button>
          <button
            className={`tab ${activeTab === 'notifications' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button
            className={`tab ${activeTab === 'accessibility' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('accessibility')}
          >
            Accessibility
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {/* Theme Settings */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Theme Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`card cursor-pointer border-2 ${
                    preferences.theme === 'light' ? 'border-primary' : 'border-base-300'
                  }`}
                  onClick={() => handleThemeChange('light')}
                >
                  <div className="card-body p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300"></div>
                      <span className="font-medium">Light</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`card cursor-pointer border-2 ${
                    preferences.theme === 'dark' ? 'border-primary' : 'border-base-300'
                  }`}
                  onClick={() => handleThemeChange('dark')}
                >
                  <div className="card-body p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-600"></div>
                      <span className="font-medium">Dark</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`card cursor-pointer border-2 ${
                    preferences.theme === 'auto' ? 'border-primary' : 'border-base-300'
                  }`}
                  onClick={() => handleThemeChange('auto')}
                >
                  <div className="card-body p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-white to-gray-800 border-2 border-gray-300"></div>
                      <span className="font-medium">Auto</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Layout Settings */}
          {activeTab === 'layout' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dashboard Layout</h3>
              <p className="text-sm text-base-content/70">
                Customize your dashboard layout and widget arrangement.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {preferences.dashboardLayout.widgets.map(widget => (
                  <div key={widget.id} className="card bg-base-200">
                    <div className="card-body p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium capitalize">{widget.id.replace('-', ' ')}</h4>
                          <p className="text-sm text-base-content/70 capitalize">{widget.type}</p>
                        </div>
                        <div className="form-control">
                          <label className="label cursor-pointer">
                            <span className="label-text mr-2">Visible</span>
                            <input
                              type="checkbox"
                              className="toggle toggle-primary"
                              checked={widget.visible}
                              onChange={() => {
                                // This would be implemented with drag-and-drop in a real implementation
                                // Widget visibility toggle functionality would go here
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="alert alert-info">
                <div className="flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 mx-2 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <label>
                    Drag and drop functionality will be implemented in the next iteration.
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notification Preferences</h3>
              <div className="space-y-3">
                {Object.entries(preferences.notifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                  >
                    <div>
                      <span className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <p className="text-sm text-base-content/70">
                        {key === 'email' && 'Receive notifications via email'}
                        {key === 'push' && 'Show push notifications in browser'}
                        {key === 'riskAlerts' && 'Get alerts for high-risk items'}
                        {key === 'projectUpdates' && 'Notify about project status changes'}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={value}
                      onChange={e =>
                        handleNotificationChange(
                          key as keyof UserPreferences['notifications'],
                          e.target.checked
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accessibility Settings */}
          {activeTab === 'accessibility' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Accessibility Settings</h3>
              <div className="space-y-4">
                {/* Font Size */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Font Size</span>
                  </label>
                  <div className="flex gap-2">
                    {(['small', 'medium', 'large'] as const).map(size => (
                      <button
                        key={size}
                        className={`btn ${preferences.accessibility.fontSize === size ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => handleAccessibilityChange('fontSize', size)}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* High Contrast */}
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text font-medium">High Contrast Mode</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={preferences.accessibility.highContrast}
                      onChange={e => handleAccessibilityChange('highContrast', e.target.checked)}
                    />
                  </label>
                  <p className="text-sm text-base-content/70 ml-4">
                    Increases color contrast for better readability
                  </p>
                </div>

                {/* Reduced Motion */}
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text font-medium">Reduced Motion</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={preferences.accessibility.reducedMotion}
                      onChange={e => handleAccessibilityChange('reducedMotion', e.target.checked)}
                    />
                  </label>
                  <p className="text-sm text-base-content/70 ml-4">
                    Reduces animations and transitions
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-action mt-6">
          <button className="btn btn-ghost" onClick={handleReset}>
            Reset to Default
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPreferencesModal;

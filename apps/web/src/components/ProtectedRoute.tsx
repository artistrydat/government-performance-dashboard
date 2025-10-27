import React from 'react';
import { useAuth } from '../lib/auth';
import { hasRole } from '../lib/permissions';
import { canAccessRoute } from '../lib/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'executive' | 'portfolio_manager' | 'project_officer';
  routePath?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  routePath,
  fallback = <AccessDenied />,
}) => {
  const { user, isAuthenticated } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
        <div className="card bg-base-100 shadow-xl w-full max-w-md">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="card-title justify-center text-2xl mb-4">Authentication Required</h2>
            <p className="text-base-content/70 mb-6">Please log in to access this page.</p>
            <div className="card-actions justify-center">
              <button className="btn btn-primary" onClick={() => (window.location.href = '/login')}>
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user can access the route (if routePath is provided)
  if (routePath && !canAccessRoute(user.role, routePath)) {
    return <>{fallback}</>;
  }

  // Check if user has required role (legacy support)
  if (requiredRole && !hasRole(user.role, requiredRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export const AccessDenied: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="card-title justify-center text-2xl mb-4">Access Denied</h2>
          <p className="text-base-content/70 mb-6">
            You dont have permission to access this page. Please contact your administrator if you
            believe this is an error.
          </p>
          <div className="card-actions justify-center">
            <button className="btn btn-primary" onClick={() => window.history.back()}>
              Go Back
            </button>
            <button className="btn btn-ghost" onClick={() => (window.location.href = '/')}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

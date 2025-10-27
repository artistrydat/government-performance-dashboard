import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { ProtectedRoute } from './ProtectedRoute';
import MainDashboardLayout from './MainDashboardLayout';
import Dashboard from './Dashboard';

// Placeholder components for routes that don't exist yet
const ExecutiveDashboard: React.FC = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Executive Dashboard</h1>
    <p>High-level portfolio view for executives</p>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Portfolio Health</h2>
          <p>Overall portfolio performance metrics</p>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Risk Overview</h2>
          <p>High-level risk indicators</p>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Compliance Reports</h2>
          <p>Executive compliance summaries</p>
        </div>
      </div>
    </div>
  </div>
);

const PortfolioList: React.FC = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Portfolio Management</h1>
    <p>Manage and monitor project portfolios</p>
    <div className="mt-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Portfolio List</h2>
          <p>View and manage all portfolios</p>
        </div>
      </div>
    </div>
  </div>
);

const ProjectList: React.FC = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Project Management</h1>
    <p>Manage individual projects</p>
    <div className="mt-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Project List</h2>
          <p>View and manage all projects</p>
        </div>
      </div>
    </div>
  </div>
);

const RiskManagement: React.FC = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Risk Management</h1>
    <p>Risk assessment and monitoring</p>
    <div className="mt-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Risk Dashboard</h2>
          <p>Monitor and manage project risks</p>
        </div>
      </div>
    </div>
  </div>
);

const ComplianceReports: React.FC = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Compliance Reports</h1>
    <p>PMI compliance reporting</p>
    <div className="mt-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Compliance Dashboard</h2>
          <p>View compliance metrics and reports</p>
        </div>
      </div>
    </div>
  </div>
);

const AIInsights: React.FC = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">AI Insights</h1>
    <p>AI-generated predictions and insights</p>
    <div className="mt-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">AI Predictions</h2>
          <p>View AI-generated risk predictions and insights</p>
        </div>
      </div>
    </div>
  </div>
);

const UserProfile: React.FC = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">User Profile</h1>
    <p>User settings and preferences</p>
    <div className="mt-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Profile Settings</h2>
          <p>Manage your account settings</p>
        </div>
      </div>
    </div>
  </div>
);

const LogoutPage: React.FC = () => {
  const { logout } = useAuth();

  React.useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="mt-4 text-base-content/70">Logging out...</p>
      </div>
    </div>
  );
};

const AppRouter: React.FC = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Protected routes with dashboard layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainDashboardLayout userRole={user?.role} currentPath="/">
                <Dashboard />
              </MainDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/executive"
          element={
            <ProtectedRoute routePath="/executive">
              <MainDashboardLayout userRole={user?.role} currentPath="/executive">
                <ExecutiveDashboard />
              </MainDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolios"
          element={
            <ProtectedRoute routePath="/portfolios">
              <MainDashboardLayout userRole={user?.role} currentPath="/portfolios">
                <PortfolioList />
              </MainDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute routePath="/projects">
              <MainDashboardLayout userRole={user?.role} currentPath="/projects">
                <ProjectList />
              </MainDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/risks"
          element={
            <ProtectedRoute routePath="/risks">
              <MainDashboardLayout userRole={user?.role} currentPath="/risks">
                <RiskManagement />
              </MainDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/compliance"
          element={
            <ProtectedRoute routePath="/compliance">
              <MainDashboardLayout userRole={user?.role} currentPath="/compliance">
                <ComplianceReports />
              </MainDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/insights"
          element={
            <ProtectedRoute routePath="/insights">
              <MainDashboardLayout userRole={user?.role} currentPath="/insights">
                <AIInsights />
              </MainDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute routePath="/profile">
              <MainDashboardLayout userRole={user?.role} currentPath="/profile">
                <UserProfile />
              </MainDashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/logout"
          element={
            <ProtectedRoute>
              <LogoutPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

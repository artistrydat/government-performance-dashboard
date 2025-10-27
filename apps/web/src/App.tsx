import { Suspense } from 'react';
import { useAuth } from './lib/auth';
import ErrorBoundary from './components/ErrorBoundary';
import { LoginForm } from './components/LoginForm';
import AppRouter from './components/AppRouter';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <ErrorBoundary>
      {isAuthenticated ? (
        <Suspense
          fallback={
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
              <div className="text-center">
                <div className="loading loading-spinner loading-lg text-primary"></div>
                <p className="mt-4 text-base-content/70">Loading dashboard...</p>
              </div>
            </div>
          }
        >
          <AppRouter />
        </Suspense>
      ) : (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
          <LoginForm />
        </div>
      )}
    </ErrorBoundary>
  );
}

export default App;

import React, { useState } from 'react';
import { useAuth } from '../lib/auth';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  const handleMockLogin = (role: 'executive' | 'portfolio_manager' | 'project_officer') => {
    setError('');
    useAuth.getState().mockLogin(role);
  };

  return (
    <div className="card bg-base-100 w-full max-w-md shadow-2xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">Government Dashboard Login</h2>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your government email"
              className="input input-bordered"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="divider">OR</div>

        <div className="space-y-2">
          <p className="text-sm text-center text-base-600 mb-4">Quick login for development:</p>

          <button
            onClick={() => handleMockLogin('executive')}
            className="btn btn-outline w-full justify-start"
          >
            <span className="text-xl mr-2">👨‍💼</span>
            Executive Director
          </button>

          <button
            onClick={() => handleMockLogin('portfolio_manager')}
            className="btn btn-outline w-full justify-start"
          >
            <span className="text-xl mr-2">👩‍💼</span>
            Portfolio Manager
          </button>

          <button
            onClick={() => handleMockLogin('project_officer')}
            className="btn btn-outline w-full justify-start"
          >
            <span className="text-xl mr-2">👨‍🔧</span>
            Project Officer
          </button>
        </div>

        <div className="mt-4 text-xs text-base-500 text-center">
          <p>For demo purposes, use any email and password combination.</p>
          <p>Role is determined by email content.</p>
        </div>
      </div>
    </div>
  );
}

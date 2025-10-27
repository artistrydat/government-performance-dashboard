import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case 'executive':
        return 'Executive Director';
      case 'portfolio_manager':
        return 'Portfolio Manager';
      case 'project_officer':
        return 'Project Officer';
      case 'admin':
        return 'Administrator';
      default:
        return 'User';
    }
  };

  return (
    <header
      className="w-full bg-base-100 border-b border-base-300"
      role="banner"
      aria-label="Dashboard header"
    >
      <div className="navbar px-4 py-2">
        {/* Mobile menu button */}
        <div className="md:hidden">
          <label htmlFor="sidebar-drawer" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
        </div>

        <div className="flex-1">
          <span className="text-lg font-semibold">Government Performance Dashboard</span>
        </div>

        <div className="flex-none gap-2">
          {/* User profile dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              aria-label="User profile menu"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-64 mt-4"
              aria-label="User profile options"
            >
              <li className="menu-title">
                <div className="flex flex-col">
                  <span className="font-semibold">{user?.name || 'User'}</span>
                  <span className="text-xs opacity-70">
                    {getRoleDisplayName(user?.role || 'user')}
                  </span>
                </div>
              </li>
              <li>
                <Link to="/profile" aria-label="View profile">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/profile" aria-label="View settings">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  aria-label="Logout from the application"
                  className="text-error"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

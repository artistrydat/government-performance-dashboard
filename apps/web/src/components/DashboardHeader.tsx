import React from 'react';

const DashboardHeader: React.FC = () => {
  return (
    <header
      className="w-full bg-base-100 border-b border-base-300"
      role="banner"
      aria-label="Dashboard header"
    >
      <div className="navbar px-4 py-2">
        <div className="flex-1">
          <span className="text-lg font-semibold">Dashboard</span>
        </div>
        <div className="flex-none">
          <button aria-label="Open user profile" className="btn btn-ghost btn-circle">
            U
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

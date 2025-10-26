import React from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

export interface MainDashboardLayoutProps {
  children?: React.ReactNode;
  userRole?: string;
}

const MainDashboardLayout: React.FC<MainDashboardLayoutProps> = ({
  children,
  userRole = 'guest',
}) => {
  return (
    <div className="flex h-screen bg-base-100">
      <DashboardSidebar userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="p-4 overflow-auto" aria-label="Main content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainDashboardLayout;

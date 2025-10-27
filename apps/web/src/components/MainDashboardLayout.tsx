import React from 'react';
import { UserRole } from '../lib/auth';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import Breadcrumb from './Breadcrumb';

export interface MainDashboardLayoutProps {
  children?: React.ReactNode;
  userRole?: UserRole;
  currentPath?: string;
}

const MainDashboardLayout: React.FC<MainDashboardLayoutProps> = ({
  children,
  userRole = 'executive',
  currentPath = '/',
}) => {
  return (
    <div className="flex h-screen bg-base-100">
      {/* Sidebar - hidden on mobile, visible on desktop */}
      <div className="hidden md:block">
        <DashboardSidebar userRole={userRole} />
      </div>

      {/* Mobile sidebar toggle */}
      <div className="md:hidden drawer">
        <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader />
            <div className="px-4 pt-2">
              <Breadcrumb currentPath={currentPath} />
            </div>
            <main className="p-4 overflow-auto" aria-label="Main content">
              {children}
            </main>
          </div>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="sidebar-drawer"
            className="drawer-overlay"
            aria-label="Close sidebar"
          ></label>
          <div className="menu p-4 w-80 min-h-full bg-base-200">
            <DashboardSidebar userRole={userRole} />
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <div className="px-4 pt-2">
          <Breadcrumb currentPath={currentPath} />
        </div>
        <main className="p-4 overflow-auto" aria-label="Main content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainDashboardLayout;

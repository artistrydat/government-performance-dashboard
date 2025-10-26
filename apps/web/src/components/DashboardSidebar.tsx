import React from 'react';

export interface DashboardSidebarProps {
  userRole?: string;
}

type MenuItem = {
  label: string;
  path: string;
  icon?: string;
};

const MENU_CONFIG: Record<string, MenuItem[]> = {
  guest: [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
  ],
  user: [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Projects', path: '/projects' },
  ],
  executive: [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Executive', path: '/executive' },
    { label: 'Reports', path: '/reports' },
    { label: 'Settings', path: '/settings' },
  ],
  portfolio_manager: [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Portfolios', path: '/portfolios' },
    { label: 'Risks', path: '/risks' },
  ],
  project_officer: [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Projects', path: '/projects' },
    { label: 'Risks', path: '/risks' },
  ],
  admin: [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Admin', path: '/admin' },
    { label: 'Settings', path: '/settings' },
  ],
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ userRole = 'guest' }) => {
  const menu = MENU_CONFIG[userRole] ?? MENU_CONFIG['guest'];

  return (
    <aside
      className="w-64 bg-base-200 border-r border-base-300"
      aria-label="Main navigation"
      role="navigation"
    >
      <nav className="h-full p-4">
        <ul className="menu menu-compact w-full">
          {menu.map(item => (
            <li key={item.path}>
              <a href={item.path} aria-label={item.label}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;

import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  currentPath?: string;
}

const BREADCRUMB_CONFIG: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/executive': 'Executive Dashboard',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/portfolios': 'Portfolios',
  '/risks': 'Risk Management',
  '/projects': 'Projects',
  '/admin': 'Admin',
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, currentPath = '/' }) => {
  // If items are provided, use them directly
  if (items && items.length > 0) {
    return (
      <nav aria-label="Breadcrumb" className="text-sm breadcrumbs">
        <ol className="flex space-x-2 list-none p-0 m-0">
          {items.map((it, idx) => (
            <li key={idx} className="flex items-center">
              {idx < items.length - 1 ? (
                <a href={it.href ?? '#'} className="link" aria-label={it.label}>
                  {it.label}
                </a>
              ) : (
                <span aria-current="page" className="font-medium">
                  {it.label}
                </span>
              )}
              {idx < items.length - 1 && <span className="mx-1">/</span>}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  // Generate breadcrumb items from current path
  const pathSegments = currentPath.split('/').filter(Boolean);
  const breadcrumbItems: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

  let currentHref = '';
  for (const segment of pathSegments) {
    currentHref += `/${segment}`;
    const label =
      BREADCRUMB_CONFIG[currentHref] ||
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    breadcrumbItems.push({ label, href: currentHref });
  }

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="text-sm breadcrumbs">
      <ol className="flex space-x-2 list-none p-0 m-0">
        {breadcrumbItems.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {idx < breadcrumbItems.length - 1 ? (
              <a href={item.href} className="link" aria-label={item.label}>
                {item.label}
              </a>
            ) : (
              <span aria-current="page" className="font-medium">
                {item.label}
              </span>
            )}
            {idx < breadcrumbItems.length - 1 && <span className="mx-1">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

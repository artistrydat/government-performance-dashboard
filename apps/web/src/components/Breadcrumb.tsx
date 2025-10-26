import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

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
};

export default Breadcrumb;

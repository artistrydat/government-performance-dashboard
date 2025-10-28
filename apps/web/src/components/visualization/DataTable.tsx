import { useState, useMemo } from 'react';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  title?: string;
  searchable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  title,
  searchable = true,
  pagination = true,
  pageSize = 10,
  className = '',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      filtered = data.filter(row =>
        columns.some(column => {
          const value = row[column.key];
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig, columns]);

  const paginatedData = useMemo(() => {
    if (!pagination) return filteredAndSortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

  const handleSort = (key: keyof T) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getSortIcon = (columnKey: keyof T) => {
    if (sortConfig.key !== columnKey) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={`card bg-base-100 shadow-lg ${className}`}>
      <div className="card-body">
        {(title || searchable) && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {title && <h2 className="text-xl font-semibold">{title}</h2>}
            {searchable && (
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Search..."
                  className="input input-bordered w-full sm:w-64"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                {columns.map(column => (
                  <th
                    key={column.key as string}
                    style={{ width: column.width }}
                    className={column.sortable ? 'cursor-pointer hover:bg-base-200' : ''}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && (
                        <span className="text-xs">{getSortIcon(column.key)}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map(row => (
                  <tr key={row[keyField]}>
                    {columns.map(column => (
                      <td key={column.key as string}>{row[column.key]}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8 text-base-content/60">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination && totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="join">
              <button
                className="join-item btn btn-sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                «
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`join-item btn btn-sm ${currentPage === page ? 'btn-active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="join-item btn btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                »
              </button>
            </div>
          </div>
        )}

        <div className="text-sm text-base-content/60 mt-4">
          Showing {paginatedData.length} of {filteredAndSortedData.length} records
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { EmptyState } from './LoadingSpinner';

const DataTable = ({ columns, data, keyField = 'id', emptyMessage = 'No data available' }) => {
  if (!data || data.length === 0) {
    return <EmptyState title="No records found" message={emptyMessage} />;
  }

  return (
    <div className="table-responsive table-custom">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} style={{ width: col.width || 'auto' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={row[keyField] || rowIdx}>
              {columns.map((col, colIdx) => (
                <td key={colIdx}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

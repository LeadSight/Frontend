import React from 'react';

/**
 * TableBase: a small configurable table renderer
 * Props:
 * - columns: [{ key, label, render? }] where render is (row) => JSX or value
 * - data: array of row objects
 * - rowKey: string key for unique id (default 'id')
 * - onRowClick: (row) => void
 */
const TableBase = ({ columns = [], data = [], rowKey = 'id', onRowClick, expandedRow = null, renderExpanded = null }) => {
  return (
    <table className="w-full">
      <thead className="bg-purple-100">
        <tr>
          {columns.map(col => (
            <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">No data</td>
          </tr>
        ) : (
          data.map((row, i) => (
            <React.Fragment key={row[rowKey] ?? i}>
              <tr
                onClick={() => onRowClick && onRowClick(row)}
                className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-4 text-sm align-middle">
                    {col.render ? col.render(row) : (row[col.key] ?? '-')}
                  </td>
                ))}
              </tr>
              {expandedRow && (row[rowKey] === expandedRow) && renderExpanded && (
                <tr className="bg-gray-50">
                  <td colSpan={columns.length} className="px-4 py-4">
                    {renderExpanded(row)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))
        )}
      </tbody>
    </table>
  );
};

export default TableBase;

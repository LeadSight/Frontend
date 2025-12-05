import React from "react";

const TableBase = ({
  columns,
  data,
  rowKey = "id",
  onRowClick,
  expandedRow,
  renderExpanded,
  fit = false,
}) => {
  return (
    <div className={`w-full ${fit ? "overflow-x-hidden" : "overflow-x-auto"}`}>
      <table
        className={`w-full ${
          fit ? "table-fixed" : "table-auto table-responsive-table"
        }`}
      >
        {/* HEADER */}
        <thead className="bg-purple-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-sm font-semibold text-gray-700 select-none ${
                  col.headerClassName ?? ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-gray-500"
              >
                No data
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <React.Fragment key={row[rowKey] ?? i}>
                <tr
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-4 text-sm align-middle max-w-[150px] truncate ${
                        fit ? "text-sm" : ""
                      } ${col.cellClassName ?? ""}`}
                      title={row[col.key]}
                    >
                      {col.render ? col.render(row) : row[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>

                {expandedRow &&
                  row[rowKey] === expandedRow &&
                  renderExpanded && (
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
    </div>
  );
};

export default TableBase;

import React, { useState } from "react";

const DataTable = ({ columns = [], data = [], pageSize = 10 }) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  return (
    <div className="w-full bg-white rounded-lg p-1 ">
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-sm font-semibold text-[#71717A] whitespace-nowrap"
                >
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-t border-[#71717A] hover:bg-gray-50"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-3 text-sm text-[#09090B] whitespace-nowrap"
                    >
                      {col.cell ? col.cell(row) : col.selector(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-4 p-3">
        {currentData.length > 0 ? (
          currentData.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="border border-[#71717A] rounded-lg p-4 shadow-sm"
            >
              {columns.map((col, colIndex) => (
                <div key={colIndex} className="flex justify-between gap-3 py-1">
                  <span className="text-sm font-medium text-[#71717A]">
                    {col.name}
                  </span>
                  <span className="text-sm text-[#09090B] text-right">
                    {col.cell ? col.cell(row) : col.selector(row)}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">No data available</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#71717A]">
          <span className="text-sm text-gray-600"></span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

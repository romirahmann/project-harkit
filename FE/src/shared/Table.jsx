import { useState, useMemo } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

export function Table({
  columns = [],
  data = [],
  actionRenderer,
  rowsPerPage = 10,
}) {
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = useMemo(() => {
    const dataArray = Array.isArray(data) ? data : [];
    if (!sortConfig.key) return dataArray;

    return [...dataArray].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const handleSort = (key) => {
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const totalItems = sortedData.length;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <>
      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={col.key + index}
                  onClick={() => handleSort(col.key)}
                  className="cursor-pointer border-b p-2 text-left text-primary  whitespace-nowrap"
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {sortConfig.key !== col.key && (
                      <FaSort className="text-sm" />
                    )}
                    {sortConfig.key === col.key && (
                      <span className="text-xs">
                        {sortConfig.direction === "asc" ? (
                          <FaSortUp className="text-sm" />
                        ) : (
                          <FaSortDown className="text-sm" />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              ))}
              {actionRenderer && (
                <th className="border-b p-2 text-center text-primary  whitespace-nowrap">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="border-b p-2 text-sm  text-gray-600 whitespace-nowrap"
                    >
                      {col.render
                        ? col.render(row[col.key], row, index)
                        : row[col.key]}
                    </td>
                  ))}
                  {actionRenderer && (
                    <td className="border-b p-2 whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        {actionRenderer(row, index)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actionRenderer ? 1 : 0)}
                  className="text-center  text-sm px-4 py-4 border-b"
                >
                  Data Not Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-2">
        <div className="text-sm text-gray-700 ">
          {totalItems > 0 ? (
            <>
              Menampilkan <strong>{startItem}</strong>–
              <strong>{endItem}</strong> dari <strong>{totalItems}</strong>{" "}
              dokumen
            </>
          ) : (
            "Tidak ada dokumen untuk ditampilkan"
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-end items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1  border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages })
            .map((_, i) => i + 1)
            .filter((page) => {
              return (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              );
            })
            .reduce((acc, page, idx, arr) => {
              if (idx > 0 && page - arr[idx - 1] > 1) {
                acc.push("...");
              }
              acc.push(page);
              return acc;
            }, [])
            .map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-1 text-gray-800"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === page
                      ? "bg-primary text-gray-500"
                      : "bg-white text-black"
                  }`}
                >
                  {page}
                </button>
              )
            )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className=" px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

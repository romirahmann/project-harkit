import { Pagination } from "flowbite-react";
import { useEffect, useMemo } from "react";

export const PaginationComponent = ({
  setPaginatedData,
  currentPage,
  setCurrentPage,
  data,
}) => {
  const itemsPerPage = 20;
  const totalPages = useMemo(
    () => Math.ceil((data?.length || 0) / itemsPerPage),
    [data]
  );

  useEffect(() => {
    if (data.length > 0) {
      const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
      setPaginatedData(paginatedData);
    }
  }, [currentPage, data, setPaginatedData]);

  return (
    <div className="footer flex mt-5 items-center justify-between">
      <p className="text-gray-600">
        Showing{" "}
        <strong>{Math.min(currentPage * itemsPerPage, data.length)}</strong> of{" "}
        <strong>{data.length}</strong> Data
      </p>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.max(totalPages, 1)}
        onPageChange={(page) => setCurrentPage(Math.min(page, totalPages))}
        showIcons
      />
    </div>
  );
};

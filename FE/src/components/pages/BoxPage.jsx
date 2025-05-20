/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { FaBoxes, FaEdit, FaTrash } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { SearchComponent } from "../reuse/SearchComponent";
import { PaginationComponent } from "../reuse/PaginationComponent";
import axios from "axios";
import { ApiUrl } from "../../context/Urlapi";

export function BoxPage() {
  const [box, setBox] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [query, setQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const baseUrl = useContext(ApiUrl);

  useEffect(() => {
    fecthBox();
  }, []);

  const fecthBox = async () => {
    try {
      let response = await axios.get(`${baseUrl}/master/boxs`);
      setBox(response.data.data);
      setFilteredData(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = () => {};
  const handleRemove = () => {};
  const handleQuery = (query) => {
    setQuery(query);
  };
  return (
    <>
      <div className="container-fluid p-4">
        {successMessage && (
          <div className="p-4 text-sm text-green-800 bg-green-50">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="p-4 text-sm text-red-800 bg-red-50">
            {errorMessage}
          </div>
        )}

        <div className="searchBar flex my-2 mt-10">
          <div className="titlePage flex mb-3 items-center">
            <FaBoxes className="text-3xl text-gray-700" />
            <h1 className="text-3xl ms-3 font-bold text-gray-700">Data Box</h1>
          </div>
          <div className="ms-auto">
            <SearchComponent
              result={setFilteredData}
              data={box}
              queryInput={(val) => handleQuery(val)}
              currentQuery={query}
            />
          </div>
        </div>

        <div className="relative overflow-x-auto sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs font-bold text-gray-300 bg-[#043A70]">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">NoMR</th>
                <th className="px-4 py-2">Nama Pasien</th>
                <th className="px-4 py-2">Kode Checklist</th>
                <th className="px-4 py-2">No Box</th>

                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginatedData?.length > 0 ? (
                paginatedData.map((box, index) => (
                  <tr key={box.id} className="border-b">
                    <th className="px-4 py-2">
                      {index + 1 + (currentPage - 1) * 10}
                    </th>
                    <td className="px-4 py-2">{box.NoMR}</td>
                    <td className="px-4 py-2">{box.NamaPasien}</td>
                    <td className="px-4 py-2">{box.Kode_Checklist}</td>
                    <td className="px-4 py-2">{box.NoBox}</td>

                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(box)}
                        className="text-green-500 px-1 py-1 rounded-md"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleRemove(box)}
                        className="text-red-600 px-1 py-1 rounded-md"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center border-b">
                  <td colSpan={7} className="px-6 py-4">
                    Data not found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <PaginationComponent
            setPaginatedData={setPaginatedData}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            data={filteredData}
          />
        </div>
      </div>
    </>
  );
}

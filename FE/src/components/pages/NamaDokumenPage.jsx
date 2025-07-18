/* eslint-disable no-unused-vars */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { SearchComponent } from "../reuse/SearchComponent";
import { PaginationComponent } from "../reuse/PaginationComponent";
import { motion } from "framer-motion";
import { RemoveModal } from "../reuse/RemoveModal";
import { ApiUrl } from "../../context/Urlapi";
import { AddDokumen } from "../reuse/modals/AddDokumen";
import { EditDokumen } from "../reuse/modals/EditDokumen";
import { FaCircle, FaEdit, FaFolderOpen, FaTrash } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
export function NamaDokumenPage() {
  const [dokumen, setDokumen] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState();
  const baseUrl = useContext(ApiUrl);
  const [query, setQuery] = useState("");
  // MODAL
  const [showModalAdd, setModalAdd] = useState(false);
  const [showModalEdit, setModalEdit] = useState(false);
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [selectedDokumen, setSelectedDokumen] = useState();
  // STATUS
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getDokumen();
  }, []);

  const getDokumen = async () => {
    try {
      const res = await axios.get(`${baseUrl}/master/dokumens`);

      setDokumen(res.data.data);
      setFilteredData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (item) => {
    setSelectedDokumen(item);
    setModalEdit(true);
  };

  const handleApiDeleted = async (item) => {
    try {
      await axios.delete(`${baseUrl}/master/dokumen/${item.kodedok}`);
      setSuccessMessage(`Dokumen '${item.kodedok}' berhasil dihapus!`);
      setShowModalRemove(false);
      getDokumen();
      setTimeout(() => setSuccessMessage(""), 1500);
    } catch (err) {
      setErrorMessage(`Gagal menghapus dokumen '${item.kodedok}'`);
      setShowModalRemove(false);
      getDokumen();
      setTimeout(() => setErrorMessage(""), 1500);
    }
  };

  const handleRemove = (item) => {
    setSelectedDokumen(item);
    setShowModalRemove(true);
  };

  const handleQuery = (val) => {
    setQuery(val);
  };

  return (
    <>
      <div className="container-fluid p-4">
        {/* Alert Sukses */}
        {successMessage && (
          <div className="p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">
            <span className="font-medium">{successMessage}</span>
          </div>
        )}
        {/* Alert Error */}
        {errorMessage && (
          <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        <div className="titlePage flex mb-3 items-center">
          <FaFolderOpen className="text-4xl text-gray-700" />
          <h1 className="text-3xl ms-2 font-bold text-gray-700 dark:text-white">
            Nama Dokumen
          </h1>
        </div>

        <div className="searchBar items-center flex my-2 mt-10">
          <button
            onClick={() => setModalAdd(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
          >
            <FaCirclePlus /> <span className="ms-2">Tambah</span>
          </button>
          <div className="dark:bg-gray-900 ms-auto">
            <SearchComponent
              result={setFilteredData}
              data={dokumen}
              queryInput={handleQuery}
              currentQuery={query}
              searchKeys={["kodedok", "namadok", "kategori"]}
            />
          </div>
        </div>

        <div className="usersTable">
          <div className="relative overflow-x-auto sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-500">
              <thead className="text-xs font-bold text-gray-300 uppercase bg-[#043A70] dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Kode</th>
                  <th className="px-4 py-2">Nama Dokumen</th>
                  <th className="px-4 py-2">Kategori</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedData?.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr
                      key={item.kodedok}
                      className="border-b dark:bg-gray-800 dark:border-gray-900 border-gray-300"
                    >
                      <td className="px-4 py-2">
                        {index + 1 + (currentPage - 1) * 10}
                      </td>
                      <td className="px-4 py-2">{item.kodedok}</td>
                      <td className="px-4 py-2">{item.namadok}</td>
                      <td className="px-4 py-2">{item.kategori}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-green-500 hover:bg-green-600 hover:text-white font-medium px-1 py-1 rounded-md"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleRemove(item)}
                          className="text-red-600 hover:bg-red-600 hover:text-white font-medium px-1 py-1 rounded-md"
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b dark:bg-gray-800 dark:border-gray-900 border-gray-300">
                    <td colSpan={5} className="px-4 py-2 text-center">
                      Data dokumen tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Pagination */}
            <PaginationComponent
              setPaginatedData={setPaginatedData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              data={filteredData}
            />
          </div>
        </div>

        {/* Modal Remove */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <RemoveModal
            isOpen={showModalRemove}
            onClose={() => setShowModalRemove(false)}
            data={selectedDokumen}
            deleted={(data) => handleApiDeleted(data)}
          />
        </motion.div>

        {/* Modal Tambah Dokumen */}
        <AddDokumen
          isOpen={showModalAdd}
          onClose={() => setModalAdd(false)}
          addDokumen={() => {
            getDokumen();
          }}
        />

        {/* Modal Edit Dokumen */}
        <EditDokumen
          isOpen={showModalEdit}
          onClose={() => setModalEdit(false)}
          dokumenData={selectedDokumen}
          updateDokumen={() => {
            getDokumen();
          }}
        />
      </div>
    </>
  );
}

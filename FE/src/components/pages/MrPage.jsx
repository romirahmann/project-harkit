/* eslint-disable no-unused-vars */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { PaginationComponent } from "../reuse/PaginationComponent";
import { SearchComponent } from "../reuse/SearchComponent";
import { FaClipboardList, FaEdit, FaTrash, FaFileExport } from "react-icons/fa";
import moment from "moment";
import { ApiUrl } from "../../context/Urlapi";
import { EditMr } from "../reuse/modals/EditMr";
import { RemoveModal } from "../reuse/RemoveModal";

export function MrPage() {
  const [dataMr, setDataMr] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState();
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const baseUrl = useContext(ApiUrl);

  useEffect(() => {
    getDataMr();
  }, []);

  const getDataMr = async () => {
    try {
      const res = await axios.get(`${baseUrl}/master/datamrs`);
      setDataMr(res.data.data);
      setFilteredData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemove = (data) => {
    setShowModalRemove(true);
    setSelectedData(data);
  };

  const handleEdit = (data) => {
    setShowModalEdit(true);
    setSelectedData(data);
  };

  const handleExportCsv = () => {
    const exportCsv = async () => {
      try {
        const response = await axios.get(`${baseUrl}/master/export-datamr`, {
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "data_MR.csv"); // Nama file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("❌ Error saat mendownload CSV:", error);
      }
    };
    exportCsv();
  };

  return (
    <div className="container-fluid p-4">
      <div className="titlePage flex mb-3 items-center">
        <FaClipboardList className="text-3xl text-gray-700" />
        <h1 className="text-3xl ms-3 font-bold text-gray-700">Data MR</h1>
      </div>

      <div className="searchBar flex my-2 mt-10">
        <button
          onClick={() => handleExportCsv()}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <FaFileExport /> <span className="ms-2">Export CSV</span>
        </button>
        <div className="ms-auto">
          <SearchComponent result={setFilteredData} data={dataMr} />
        </div>
      </div>

      <div className="relative overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-bold text-gray-300 bg-[#043A70]">
            <tr>
              <th className="px-4 py-2">No Urut</th>
              <th className="px-4 py-2">Kode Checklist</th>
              <th className="px-4 py-2">No MR</th>
              {/* <th className="px-6 py-3">No Box</th> */}
              <th className="px-4 py-2">Nama Pasien</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Qty Image</th>
              <th className="px-4 py-2">Mulai</th>
              <th className="px-4 py-2">Selesai</th>
              <th className="px-4 py-2">File Path</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {paginatedData?.length > 0 ? (
              paginatedData.map((data, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{data.NoUrut}</td>
                  <td className="px-4 py-2">{data.Kode_Checklist}</td>
                  <td className="px-4 py-2">{data.NoMR}</td>
                  {/* <td className="px-6 py-4">{data.nobox}</td> */}
                  <td className="px-4 py-2">{data.NamaPasien}</td>
                  <td className="px-4 py-2">
                    {data.Tanggal
                      ? moment(data.Tanggal).format("DD/MM/YYYY")
                      : ""}
                  </td>
                  <td className="px-4 py-2">{data.Qty_Image}</td>

                  <td className="px-4 py-2">{data.Mulai}</td>
                  <td className="px-4 py-2">{data.Selesai}</td>

                  <td className="px-4 py-2">{data.FilePath}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(data)}
                      className="text-green-500 px-1 py-1 rounded-md"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleRemove(data)}
                      className="text-red-600 px-1 py-1 rounded-md"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center border-b">
                <td colSpan={11} className="px-6 py-4">
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

      <EditMr
        isOpen={showModalEdit}
        onClose={() => setShowModalEdit(false)}
        mrData={selectedData}
        updateMR={() => getDataMr()}
      />
      <RemoveModal
        isOpen={showModalRemove}
        onClose={() => setShowModalRemove(false)}
        data={selectedData}
        deleted={() => getDataMr()}
      />
    </div>
  );
}

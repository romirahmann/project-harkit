/* eslint-disable no-unused-vars */
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { ApiUrl } from "../../context/Urlapi";

import { MdOutlineLibraryAddCheck, MdOutlineFactCheck } from "react-icons/md";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { SearchComponent } from "../reuse/SearchComponent";
import { PaginationComponent } from "../reuse/PaginationComponent";
import { RemoveModal } from "../reuse/RemoveModal";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

export function CheecksheetPage() {
  const [dataMRt, setDataMRt] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState();
  const [showModalRemove, setShowModalRemove] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const baseUrl = useContext(ApiUrl);

  useEffect(() => {
    fecthDataMRt();
  }, []);

  const fecthDataMRt = async (req, res) => {
    try {
      let res = await axios.get(`${baseUrl}/master/datMRt3`);
      let data = res.data.data;
      // console.log(data);
      setDataMRt(data);
      setFilteredData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleExportFinishing = async () => {
    if (!selectedChecklist) {
      alert("Please search kode checklist first");
      return;
    }

    try {
      // Menggunakan `responseType: 'blob'` agar menerima file PDF dalam bentuk binary
      let res = await axios.get(
        `${baseUrl}/master/finishing-checksheet/${selectedChecklist}`,
        { responseType: "blob" }
      );

      // Buat URL dari Blob
      const fileURL = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );

      // Buka di tab baru
      window.open(fileURL, "_blank");
    } catch (e) {
      console.error("Error exporting PDF:", e);
    }
  };

  const handleExportQc = async () => {
    if (!selectedChecklist) {
      alert("Please search kode checklist first");
      return;
    }

    try {
      // Menggunakan `responseType: 'blob'` agar menerima file PDF dalam bentuk binary
      let res = await axios.get(
        `${baseUrl}/master/qc-checksheet/${selectedChecklist}`,
        { responseType: "blob" }
      );

      // Buat URL dari Blob
      const fileURL = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );

      // Buka di tab baru
      window.open(fileURL, "_blank");
    } catch (e) {
      console.error("Error exporting PDF:", e);
    }
  };

  const handleSelectedChecklist = (value) => {
    setSelectedChecklist(value);
  };

  const handleEdit = (data) => {};
  const handleModalRemove = (data) => {};

  return (
    <>
      <div className="container-fluid p-4">
        <div className="titlePage flex mb-3 items-center">
          <MdOutlineLibraryAddCheck className="text-3xl text-gray-700" />
          <h1 className="text-3xl ms-3 font-bold text-gray-700">
            Data Checksheet
          </h1>
        </div>

        <div className="searchBar flex my-2 mt-10">
          <button
            onClick={() => handleExportFinishing()}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center"
          >
            <IoCheckmarkDoneCircleSharp size={25} />{" "}
            <span className="ms-2">Export Finishing</span>
          </button>
          <button
            onClick={() => handleExportQc()}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center ms-2"
          >
            <MdOutlineFactCheck size={25} />{" "}
            <span className="ms-2">Export QC</span>
          </button>
          <div className="ms-auto">
            <SearchComponent
              result={setFilteredData}
              data={dataMRt}
              queryInput={(e) => handleSelectedChecklist(e)}
            />
          </div>
        </div>

        <div className="relative overflow-x-auto sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs font-bold text-gray-300 bg-[#043A70]">
              <tr>
                <th className="px-4 py-2">No Urut</th>
                <th className="px-4 py-2">Kode Checklist</th>
                <th className="px-4 py-2">No MR</th>
                <th className="px-4 py-2">Layanan</th>
                <th className="px-4 py-2">Nama Pasien</th>
                <th className="px-4 py-2">Tanggal</th>
                {/* <th className="px-4 py-2">Qty Image</th> */}
                <th className="px-4 py-2">Mulai</th>
                <th className="px-4 py-2">Selesai</th>
                <th className="px-4 py-2">Nama Dokumen</th>
                {/* <th className="px-4 py-2">Action</th> */}
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginatedData?.length > 0 ? (
                paginatedData.map((data, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{data.NoUrut}</td>
                    <td className="px-4 py-2">{data.Kode_Checklist}</td>
                    <td className="px-4 py-2">{data.NoMR}</td>
                    <td className="px-6 py-4">{data.Layanan}</td>
                    <td className="px-4 py-2">{data.NamaPasien}</td>
                    <td className="px-4 py-2">
                      {data.Tanggal
                        ? moment(data.Tanggal, "DDMMYYYY").format("DD-MM-YYYY")
                        : ""}
                    </td>
                    {/* <td className="px-4 py-2">{data.Qty_Image}</td> */}

                    <td className="px-4 py-2">{data.Mulai}</td>
                    <td className="px-4 py-2">{data.Selesai}</td>

                    <td className="px-4 py-2">{data.namadokumen}</td>
                    {/* <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(data)}
                        className="text-green-500 px-1 py-1 rounded-md"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleModalRemove(data)}
                        className="text-red-600 px-1 py-1 rounded-md"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td> */}
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

        <RemoveModal
          isOpen={showModalRemove}
          onClose={() => setShowModalRemove(false)}
          data={selectedData}
          deleted={() => fecthDataMRt()}
        />
      </div>
    </>
  );
}

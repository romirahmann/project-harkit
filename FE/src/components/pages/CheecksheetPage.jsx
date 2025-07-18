/* eslint-disable no-unused-vars */
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { ApiUrl } from "../../context/Urlapi";
import { saveAs } from "file-saver";
import { MdOutlineLibraryAddCheck, MdOutlineFactCheck } from "react-icons/md";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { SearchComponent } from "../reuse/SearchComponent";
import { PaginationComponent } from "../reuse/PaginationComponent";
import { RemoveModal } from "../reuse/RemoveModal";
import axios from "axios";

import { AddLog } from "../../context/Log";

export function CheecksheetPage() {
  const [dataMRt, setDataMRt] = useState([]);
  const [dataMRtA2, setDataMRtA2] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState();
  const [showModalRemove, setShowModalRemove] = useState(false);

  const [selectedData, setSelectedData] = useState(null);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const baseUrl = useContext(ApiUrl);
  const [loading, setLoading] = useState(false);
  const [userLogin, setUserLogin] = useState(null);
  const [query, setQuery] = useState("");
  const [isA2, setIsA2] = useState(false);

  // Fetch login user
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("userData"));
    setUserLogin(user);
  }, []);

  // Fetch data sesuai pilihan
  useEffect(() => {
    if (isA2) {
      fetchDataMRtA2();
    } else {
      fetchDataMRt();
    }
  }, [isA2]);

  // Sinkronkan filteredData saat data berubah
  useEffect(() => {
    setFilteredData(isA2 ? dataMRtA2 : dataMRt);
  }, [dataMRt, dataMRtA2, isA2]);

  useEffect(() => {
    setSelectedChecklist("");
    setQuery("");
  }, [isA2]);

  const fetchDataMRt = async () => {
    try {
      const res = await axios.get(`${baseUrl}/master/datMRt3`);
      setDataMRt(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDataMRtA2 = async () => {
    try {
      const res = await axios.get(`${baseUrl}/master/dataMRt3-A2`);
      setDataMRtA2(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetDataMRT = (e) => {
    const selected = parseInt(e.target.value);
    setIsA2(selected === 2); // 2 = A2
  };

  const handleExportFinishing = async () => {
    setLoading(true);
    if (!selectedChecklist) {
      alert("Please search kode checklist first");
      setLoading(false);
      return;
    }
    if (!isA2) {
      try {
        // Menggunakan `responseType: 'blob'` agar menerima file PDF dalam bentuk binary
        let res = await axios.get(
          `${baseUrl}/master/finishing-checksheet/${selectedChecklist}`,
          { responseType: "blob" }
        );

        setLoading(false);
        let fileName = `Finishing Checksheet A4_${selectedChecklist}.pdf`; // default fallback

        // Simpan file dengan nama dari server
        saveAs(new Blob([res.data], { type: "application/pdf" }), fileName);

        AddLog(
          `User ${userLogin?.username} Export Finishing Checksheet A4_${selectedChecklist}`,
          "SUCCESSFULLY"
        );
      } catch (e) {
        AddLog(
          `User ${userLogin?.username} Export Finishing Checksheet`,
          "FAILED"
        );
        console.error("Error exporting PDF:", e);
      }
      return;
    }

    try {
      // Menggunakan `responseType: 'blob'` agar menerima file PDF dalam bentuk binary
      let res = await axios.get(
        `${baseUrl}/master/finishing-checksheet-a2/${selectedChecklist}`,
        { responseType: "blob" }
      );

      setLoading(false);

      setLoading(false);
      let fileName = `Finishing Checksheet A2_${selectedChecklist}.pdf`; // default fallback

      // Simpan file dengan nama dari server
      saveAs(new Blob([res.data], { type: "application/pdf" }), fileName);

      AddLog(
        `User ${userLogin?.username} Export Finishing Checksheet A2_${selectedChecklist}`,
        "SUCCESSFULLY"
      );
    } catch (e) {
      AddLog(
        `User ${userLogin?.username} Export Finishing Checksheet`,
        "FAILED"
      );
      console.error("Error exporting PDF:", e);
    }
  };

  const handleExportQc = async () => {
    setLoading(true);
    if (!selectedChecklist) {
      alert("Please search kode checklist first");
      setLoading(false);
      return;
    }
    if (!isA2) {
      try {
        // Menggunakan `responseType: 'blob'` agar menerima file PDF dalam bentuk binary
        let res = await axios.get(
          `${baseUrl}/master/qc-checksheet/${selectedChecklist}`,
          { responseType: "blob" }
        );

        setLoading(false);

        // Buat URL dari Blob
        let fileName = `QC Checksheet A4_${selectedChecklist}.pdf`; // default fallback

        // Simpan file dengan nama dari server
        saveAs(new Blob([res.data], { type: "application/pdf" }), fileName);

        AddLog(
          `User ${userLogin?.username} Export QC Checksheet`,
          "SUCCESSFULLY"
        );
      } catch (e) {
        AddLog(`User ${userLogin?.username} Export QC Checksheet`, "FAILED");
        console.error("Error exporting PDF:", e);
      }
    }

    try {
      // Menggunakan `responseType: 'blob'` agar menerima file PDF dalam bentuk binary
      let res = await axios.get(
        `${baseUrl}/master/qc-checksheet-a2/${selectedChecklist}`,
        { responseType: "blob" }
      );

      setLoading(false);

      // Buat URL dari Blob
      let fileName = `QC Checksheet A2_${selectedChecklist}.pdf`; // default fallback

      // Simpan file dengan nama dari server
      saveAs(new Blob([res.data], { type: "application/pdf" }), fileName);

      AddLog(
        `User ${userLogin?.username} Export Finishing Checksheet`,
        "SUCCESSFULLY"
      );
    } catch (e) {
      AddLog(
        `User ${userLogin?.username} Export Finishing Checksheet`,
        "FAILED"
      );
      console.error("Error exporting PDF:", e);
    }
  };

  const handleSelectedChecklist = (value) => {
    setSelectedChecklist(value);
  };

  return (
    <>
      <div className="container-fluid p-4">
        <div className="titlePage flex items-center mb-3 ">
          <MdOutlineLibraryAddCheck className="text-3xl text-gray-700" />
          <h1 className="text-3xl ms-3 font-bold text-gray-700">
            Data Checksheet
          </h1>
          <select
            onChange={handleSetDataMRT}
            className="ms-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1">A4</option>
            <option value="2">A2</option>
          </select>
        </div>

        <div className="searchBar flex my-2 mt-10">
          <button
            onClick={() => handleExportFinishing()}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center"
          >
            {loading ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <IoCheckmarkDoneCircleSharp size={25} />
            )}
            <span className="ms-2">Export Finishing</span>
          </button>
          <button
            onClick={() => handleExportQc()}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center ms-2"
          >
            {loading ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <MdOutlineFactCheck size={25} />
            )}
            <span className="ms-2">Export QC</span>
          </button>
          <div className="ms-auto">
            <SearchComponent
              result={setFilteredData}
              data={isA2 ? dataMRtA2 : dataMRt}
              queryInput={(e) => handleSelectedChecklist(e)}
              currentQuery={selectedChecklist || ""}
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

                <th className="px-4 py-2">Nama Pasien</th>
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2">Periode Ranap</th>
                <th className="px-4 py-2">Nama Dokumen</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginatedData?.length > 0 ? (
                paginatedData.map((data, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{data.NoUrut}</td>
                    <td className="px-4 py-2">{data.Kode_Checklist}</td>
                    <td className="px-4 py-2">{data.NoMR}</td>

                    <td className="px-4 py-2">{data.NamaPasien}</td>
                    <td className="px-4 py-2">
                      {data.Tanggal
                        ? moment(data.Tanggal, "DDMMYYYY").format("DD-MM-YYYY")
                        : ""}
                    </td>
                    <td className="px-4 py-2">{data.Periode_Ranap}</td>
                    <td className="px-4 py-2">{data.namadokumen}</td>
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
          deleted={() => fetchDataMRt()}
        />
      </div>
    </>
  );
}

/* eslint-disable no-unused-vars */
import { FaRecycle } from "react-icons/fa";
import { Titlepage } from "../../shared/Titlepage";
import { useEffect, useState, useRef } from "react";
import { LazyComponent } from "../../shared/LazyComponent";
import api from "../../services/axios.service";
import { TableUpdate } from "../../components/update/TableUpdate";
import { AlertMessage } from "../../shared/AlertMessage";
import { useAuth } from "../../store/AuthContext";
import { AddLog } from "../../services/log.service";
import { Modal } from "../../shared/Modal";

export function UpdatePage() {
  const [query, setQuery] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [isUpload, setIsUpload] = useState(false);
  const [candraNotComplete, setCandraNotComplete] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({
    candra: null,
    qty: null,
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "warning",
  });

  // Timer states
  const [modalTimer, setModalTimer] = useState(false);
  const [timer, setTimer] = useState("00:00");
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const { user } = useAuth();

  useEffect(() => {
    fetchCandra();
  }, []);

  // Mulai timer berbasis waktu asli
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsedMs = Date.now() - startTimeRef.current;
      const totalSeconds = Math.floor(elapsedMs / 1000);

      const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
      const seconds = String(totalSeconds % 60).padStart(2, "0");

      setTimer(`${minutes}:${seconds}`);
    }, 1000);
  };

  // Berhenti timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const fetchCandra = async () => {
    try {
      let res = await api.get("/master/validate-proses");
      setCandraNotComplete(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (val) => {
    setQuery(val);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFiles((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

  const handleUpload = async (type) => {
    if (!type) {
      setAlert({
        show: true,
        message: "Pilih file terlebih dahulu",
        type: "warning",
      });
      return;
    }

    setIsUpload(true);
    startTimer(); // Mulai timer

    let file;
    const formData = new FormData();
    if (type === "candra") file = selectedFiles.candra;
    if (type === "qty") file = selectedFiles.qty;

    formData.append("file", file);

    try {
      await api.post(`/master/upload-mdb`, formData);

      stopTimer(); // Stop timer
      setModalTimer(true); // Tampilkan modal

      setAlert({
        show: true,
        message: "File berhasil diupload",
        type: "success",
      });
      setSelectedFiles({ candra: "", qty: "" });
      setIsUpload(false);
      AddLog(user.username, `update database `, 1, "UPDATE");
    } catch (error) {
      stopTimer();
      console.log(error);
      setAlert({
        show: true,
        message: "Gagal mengupload file",
        type: "error",
      });
      setIsUpload(false);
      AddLog(user.username, `update database `, 0, "UPDATE");
    }
  };

  return (
    <>
      <div className="max-w-full">
        <Titlepage
          title={`Data Candra`}
          icon={FaRecycle}
          onSearch={handleSearch}
        />
        {isLoading ? (
          <LazyComponent />
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-2">
              {/* Update Database */}
              <div className="updateCandra bg-gray-50 p-5">
                <h1 className="font-bold text-2xl">UPDATE DATABASE</h1>
                <div className="fileInput mt-5">
                  <label
                    className="block text-sm mb-2 font-medium"
                    htmlFor="file_candra"
                  >
                    Upload file
                  </label>
                  <div className="relative">
                    <input
                      onChange={(e) => handleFileChange(e, "candra")}
                      type="file"
                      id="file_candra"
                      className="hidden"
                    />
                    <label
                      htmlFor="file_candra"
                      className="flex items-center border border-gray-400 rounded-md cursor-pointer hover:shadow"
                    >
                      <div className="p-2 bg-blue-900 w-32 text-center text-white rounded-l-md">
                        Choose File
                      </div>
                      <p className="ms-5 text-sm text-gray-700 truncate">
                        {selectedFiles?.candra?.name || "No file selected"}
                      </p>
                    </label>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Format file: .mdb, Filename: dbData.mdb
                  </p>
                </div>
                <div className="btn flex items-center">
                  <button
                    onClick={() => handleUpload("candra")}
                    disabled={isLoading || candraNotComplete.length !== 0}
                    className={`mt-5 text-white ${
                      candraNotComplete.length === 0
                        ? "bg-blue-700 hover:bg-blue-800"
                        : "bg-gray-300 "
                    } focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5`}
                  >
                    {isUpload ? <>Uploading... | Time: {timer}</> : "Upload"}
                  </button>
                  {candraNotComplete.length !== 0 && (
                    <span className="mt-4 ms-3 text-red-600">
                      Selesaikan proses terlebih dahulu !
                    </span>
                  )}
                </div>
              </div>

              {/* Update Data Qty */}
              <div className="updateQty bg-gray-50 p-5">
                <h1 className="font-bold text-2xl">UPDATE DATA QTY</h1>
                <div className="fileInput mt-5">
                  <label
                    className="block text-sm mb-2 font-medium"
                    htmlFor="file_qty"
                  >
                    Upload file
                  </label>
                  <div className="relative">
                    <input
                      onChange={(e) => handleFileChange(e, "qty")}
                      type="file"
                      id="file_qty"
                      className="hidden"
                    />
                    <label
                      htmlFor="file_qty"
                      className="flex items-center border border-gray-400 rounded-md cursor-pointer hover:shadow"
                    >
                      <div className="p-2 bg-blue-900 w-32 text-center text-white rounded-l-md">
                        Choose File
                      </div>
                      <p className="ms-5 text-sm text-gray-700 truncate">
                        {selectedFiles?.qty?.name || "No file selected"}
                      </p>
                    </label>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Format file: .mdb, Filename: dbQty.mdb
                  </p>
                </div>
                <div className="btn flex items-center">
                  <button
                    onClick={() => handleUpload("qty")}
                    disabled={isLoading || candraNotComplete.length !== 0}
                    className={`mt-5 text-white ${
                      candraNotComplete.length === 0
                        ? "bg-blue-700 hover:bg-blue-800"
                        : "bg-gray-300"
                    } focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5`}
                  >
                    {isUpload ? <>Uploading... {timer}</> : "Upload"}
                  </button>
                  {candraNotComplete.length !== 0 && (
                    <span className="mt-4 ms-3 text-red-600">
                      Selesaikan proses terlebih dahulu !
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="max-w-full mt-5 bg-white p-5 ">
              <TableUpdate data={candraNotComplete} />
            </div>
          </div>
        )}
      </div>

      <div>
        {alert.show && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() =>
              setAlert({
                show: false,
                type: "",
                message: "",
              })
            }
          />
        )}
      </div>

      {/* Modal Timer */}
      <Modal isOpen={modalTimer} title="TIMER UPLOAD!">
        <div className="text-center p-5">
          <h2 className="text-xl font-bold mb-3">Proses Update Selesai ✅</h2>
          <p className="text-gray-600">
            Waktu proses: <span className="font-semibold">{timer}</span>
          </p>
          <button
            onClick={() => setModalTimer(false)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tutup Sekarang
          </button>
        </div>
      </Modal>
    </>
  );
}

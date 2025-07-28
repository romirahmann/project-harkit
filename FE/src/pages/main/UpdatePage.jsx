/* eslint-disable no-unused-vars */
import { FaRecycle } from "react-icons/fa";
import { Titlepage } from "../../shared/Titlepage";
import { useEffect, useState } from "react";
import { LazyComponent } from "../../shared/LazyComponent";
import api from "../../services/axios.service";
import { TableUpdate } from "../../components/update/TableUpdate";
import { AlertMessage } from "../../shared/AlertMessage";
import { useAuth } from "../../store/AuthContext";
import { AddLog } from "../../services/log.service";

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
  const { user } = useAuth();
  useEffect(() => {
    fetchCandra();
  }, []);

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
    }
    setIsUpload(true);
    let file;
    const formData = new FormData();
    if (type === "candra") {
      file = selectedFiles.candra;
    }
    if (type === "qty") {
      file = selectedFiles.qty;
      console.log(file);
    }

    formData.append("file", file);

    try {
      await api.post(`/master/upload-mdb`, formData);
      setAlert({
        show: true,
        message: "File berhasil diupload",
        type: "success",
      });
      setSelectedFiles({
        candra: "",
        qty: "",
      });
      setIsUpload(false);
      AddLog(user.username, `update database `, 1, "UPDATE");
    } catch (error) {
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
          <div className=" grid grid-cols-2 gap-2">
            {/* Update Database */}
            <div className="updateCandra bg-gray-100 p-5">
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
                  {isUpload ? (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="inline w-8 h-8 text-gray-200 animate-spin fill-blue-600"
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
                      <span className="sr-only">isLoading...</span>
                    </div>
                  ) : (
                    "Upload"
                  )}
                </button>
                {candraNotComplete.length !== 0 && (
                  <span className="mt-4 ms-3 text-red-600">
                    Selesaikan proses terlebih dahulu !
                  </span>
                )}
              </div>
            </div>

            {/* Update Data Qty */}
            <div className="updateQty bg-gray-100 p-5">
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
                  {isUpload ? (
                    <div role="status flex">
                      <svg
                        aria-hidden="true"
                        className="inline w-8 h-8 text-gray-200 animate-spin fill-blue-600"
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
                      <span className="sr-only">isLoading...</span>
                    </div>
                  ) : (
                    "Upload"
                  )}
                </button>
                {candraNotComplete.length !== 0 && (
                  <span className="mt-4 ms-3 text-red-600">
                    Selesaikan proses terlebih dahulu !
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-full mt-5 bg-white p-5 ">
          <TableUpdate data={candraNotComplete} />
        </div>
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
    </>
  );
}

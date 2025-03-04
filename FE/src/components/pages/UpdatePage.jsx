/* eslint-disable no-unused-vars */
import axios from "axios";
import { useContext, useState } from "react";
import { FaRecycle } from "react-icons/fa";
import { ApiUrl } from "../../context/Urlapi";

export function UpdatePage() {
  const [loading, setLoading] = useState(false);
  const [fileCandra, setFileCandra] = useState(null);
  const [fileQty, setFileQty] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const baseUrl = useContext(ApiUrl);

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (type === "candra") {
      setFileCandra(file);
    } else if (type === "qty") {
      setFileQty(file);
    }
  };

  const handleUpload = async (type) => {
    setLoading(true);
    console.log(type);
    const file = type === "candra" ? fileCandra : fileQty;

    if (!file) {
      setErrorMessage("Please Upload File First!");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${baseUrl}/master/upload-mdb`, formData);
      setSuccessMessage("Upload File Successfully!");
      type === "candra" ? setFileCandra(null) : setFileQty(null);
    } catch (error) {
      setErrorMessage("Upload File Failed!");
    } finally {
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 1500);
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Pesan Sukses */}
      {successMessage && (
        <div
          className="p-4 text-sm text-green-800 rounded-lg bg-green-50"
          role="alert"
        >
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Pesan Error */}
      {errorMessage && (
        <div
          className="p-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      <div className="titlePage flex my-5 items-center">
        <FaRecycle className="text-4xl text-gray-700" />
        <h1 className="text-3xl ms-2 font-bold text-gray-700">
          UPDATE DATABASE
        </h1>
      </div>

      <div className="container grid grid-cols-2 gap-4">
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
            <input
              onChange={(e) => handleFileChange(e, "candra")}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              id="file_candra"
              type="file"
            />
            <p className="mt-1 text-sm text-gray-500">
              Format file: .mdb, Filename: dbData.mdb
            </p>
          </div>
          <button
            onClick={() => handleUpload("candra")}
            disabled={loading}
            className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
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
            <input
              onChange={(e) => handleFileChange(e, "qty")}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              id="file_qty"
              type="file"
            />
            <p className="mt-1 text-sm text-gray-500">
              Format file: .mdb, Filename: dbQty.mdb
            </p>
          </div>
          <button
            onClick={() => handleUpload("qty")}
            disabled={loading}
            className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

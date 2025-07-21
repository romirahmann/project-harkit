/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Modal, Button } from "flowbite-react";
import { ApiUrl } from "../../../context/Urlapi";
import { AddLog } from "../../../context/Log";

export function EditDokumen({ isOpen, onClose, dokumenData, updateDokumen }) {
  const [formData, setFormData] = useState({
    kodedok: "",
    namadok: "",
    kategori: "",
  });

  const baseUrl = useContext(ApiUrl);
  const userData = JSON.parse(sessionStorage.getItem("userData")) || {};

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dokumenData) {
      setFormData({
        kodedok: dokumenData.kodedok || "",
        namadok: dokumenData.namadok || "",
        kategori: dokumenData.kategori || "",
      });
    }
  }, [dokumenData]);

  const handleChange = (e) => {
    setErrorMessage("");
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${baseUrl}/master/dokumen/${formData.kodedok}`, {
        namadok: formData.namadok,
        kategori: formData.kategori,
      });

      AddLog(`${userData.username} mengedit dokumen ${formData.kodedok}`);
      setSuccessMessage("Dokumen berhasil diperbarui.");

      setTimeout(() => {
        updateDokumen();
        setSuccessMessage("");
        onClose();
      }, 1500);
    } catch (error) {
      AddLog(
        `${userData.username} gagal mengedit dokumen ${formData.kodedok}`,
        "FAILED"
      );
      setErrorMessage(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui dokumen."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <Modal.Header>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          EDIT DOKUMEN
        </p>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <div
              className="p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
              role="alert"
            >
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div
              className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Kode Dokumen - Read Only */}
          <div>
            <label
              htmlFor="kodedok"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Kode Dokumen
            </label>
            <input
              type="text"
              name="kodedok"
              id="kodedok"
              value={formData.kodedok}
              disabled
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-not-allowed"
            />
          </div>

          {/* Nama Dokumen */}
          <div>
            <label
              htmlFor="namadok"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Nama Dokumen
            </label>
            <input
              type="text"
              name="namadok"
              id="namadok"
              value={formData.namadok}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Kategori */}
          <div>
            <label
              htmlFor="kategori"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Kategori
            </label>
            <input
              type="text"
              name="kategori"
              id="kategori"
              value={formData.kategori}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer className="flex justify-end">
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button color="blue" onClick={handleSubmit} disabled={loading}>
          {loading ? "Updating..." : "Submit"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

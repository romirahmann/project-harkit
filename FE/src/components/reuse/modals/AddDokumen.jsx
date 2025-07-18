/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { Modal, Button } from "flowbite-react";
import { ApiUrl } from "../../../context/Urlapi";
import axios from "axios";
import { AddLog } from "../../../context/Log";

export function AddDokumen({ isOpen, onClose, addDokumen }) {
  const baseUrl = useContext(ApiUrl);
  const userData = JSON.parse(sessionStorage.getItem("userData")) || {};

  const [formData, setFormData] = useState({
    kodedok: "",
    namadok: "",
    kategori: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/master/dokumen`, formData);
      setSuccessMessage("Dokumen berhasil ditambahkan!");
      AddLog(`${userData.username} menambahkan dokumen baru`);
      setTimeout(() => {
        addDokumen();
        setSuccessMessage("");
        setFormData({ kodedok: "", namadok: "", kategori: "" });
        onClose();
      }, 1500);
    } catch (err) {
      setFormData({ kodedok: "", namadok: "", kategori: "" });
      AddLog(`${userData.username} menambahkan dokumen`, "FAILED");
      setErrorMessage(
        err?.response?.data?.message || "Gagal menambahkan dokumen!"
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 1500);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <Modal.Header>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          TAMBAH DOKUMEN
        </p>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <div className="p-4 text-sm text-green-800 rounded-lg bg-green-50">
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50">
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="kodedok"
              className="block text-sm font-medium text-gray-900"
            >
              Kode Dokumen
            </label>
            <input
              type="text"
              name="kodedok"
              id="kodedok"
              value={formData.kodedok}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label
              htmlFor="namadok"
              className="block text-sm font-medium text-gray-900"
            >
              Nama Dokumen
            </label>
            <input
              type="text"
              name="namadok"
              id="namadok"
              value={formData.namadok}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label
              htmlFor="kategori"
              className="block text-sm font-medium text-gray-900"
            >
              Kategori
            </label>
            <input
              type="text"
              name="kategori"
              id="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer className="flex justify-end">
        <Button color="gray" onClick={onClose}>
          Batal
        </Button>
        <Button color="blue" onClick={handleSubmit}>
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

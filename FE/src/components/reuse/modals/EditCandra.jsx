/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ApiUrl } from "../../../context/Urlapi";
import { Modal, Button } from "flowbite-react";
import moment from "moment";

export function EditCandra({ isOpen, onClose, candraData, updateCandra }) {
  const [formData, setFormData] = useState({
    kode_checklist: "",
    idproses: "",
    nama_proses: "",
    nik: "",
    qty_image: "",
    nama_karyawan: "",
    tanggal: "",
    mulai: "",
    selesai: "",
  });
  const baseUrl = useContext(ApiUrl);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (candraData) {
      setFormData({
        kode_checklist: candraData.kode_checklist || "",
        idproses: candraData.idproses || "",
        nama_proses: candraData.nama_proses || "",
        nik: candraData.nik || "",
        qty_image: candraData.qty_image || "",
        nama_karyawan: candraData.nama_karyawan || "",
        tanggal:
          moment(candraData.tanggal, "YYYY-MM-DD").format("yyyy-MM-DD") || "",
        mulai: candraData.mulai_formatted || "",
        selesai: candraData.selesai_formatted || "",
      });
    }
  }, [candraData]);

  const handleChange = (e) => {
    setErrorMessage("");
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios
      .put(
        `${baseUrl}/master/candra/${candraData.kode_checklist}/${candraData.idproses}`,
        formData
      )
      .then((res) => {
        setSuccessMessage(`Data Candra berhasil diperbarui.`);
        setTimeout(() => {
          updateCandra();
          setSuccessMessage("");
          onClose();
        }, 1500);
      })
      .catch((err) => {
        setErrorMessage(
          err.response?.data?.message ||
            "Terjadi kesalahan saat memperbarui data."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <Modal.Header>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          EDIT DATA CANDRA
        </p>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium">Kode Checklist</label>
            <input
              type="text"
              name="kode_checklist"
              value={formData.kode_checklist}
              disabled
              className="w-full p-2 border rounded-lg bg-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">ID Proses</label>
            <input
              type="text"
              name="idproses"
              value={formData.idproses}
              disabled
              className="w-full p-2 border rounded-lg bg-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Nama Proses</label>
            <input
              type="text"
              name="nama_proses"
              value={formData.nama_proses}
              disabled
              className="w-full p-2 border rounded-lg bg-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">NIK</label>
            <input
              type="text"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Nama Karyawan</label>
            <input
              type="text"
              name="nama_karyawan"
              value={formData.nama_karyawan}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tanggal</label>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Mulai</label>
            <input
              type="time"
              step="1"
              name="mulai"
              value={formData.mulai}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Selesai</label>
            <input
              type="time"
              step="1"
              name="selesai"
              value={formData.selesai}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
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

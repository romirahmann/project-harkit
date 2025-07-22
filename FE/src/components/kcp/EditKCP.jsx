/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useAuth } from "../../store/AuthContext";

export function EditKCP({ onEdit, data, onClose }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    NoUrut: "",
    NoMR: "",
    NamaPasien: "",
    Tanggal: "",
    Layanan: "",
    Qty_Image: "",
    Kode_Checklist: "",
    Mulai: "",
    Selesai: "",
    namadokumen: "",
    Periode_Ranap: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      NoUrut: data.NoUrut,
      NoMR: data.NoMR,
      NamaPasien: data.NamaPasien,
      Tanggal: data.Tanggal,
      Layanan: data.Layanan,
      Qty_Image: data.Qty_Image,
      Kode_Checklist: data.Kode_Checklist,
      Mulai: data.Mulai,
      Selesai: data.Selesai,
      namadokumen: data.namadokumen,
      Periode_Ranap: data.Periode_Ranap,
    }));
  }, [data]);

  const handleSubmit = () => {};
  const handleChange = () => {};
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label
              htmlFor="NoUrut"
              className="block text-sm font-medium text-gray-900 "
            >
              NoUrut
            </label>
            <input
              type="text"
              name="NoUrut"
              id="NoUrut"
              value={formData.NoUrut}
              disabled
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-200  dark:border-gray-600 "
            />
          </div>
          <div>
            <label
              htmlFor="Kode_Checklist"
              className="block text-sm font-medium text-gray-900 "
            >
              Kode_Checklist
            </label>
            <input
              type="text"
              name="Kode_Checklist"
              id="Kode_Checklist"
              value={formData.Kode_Checklist}
              disabled
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-200  dark:border-gray-600 "
            />
          </div>
          <div>
            <label
              htmlFor="NoMR"
              className="block text-sm font-medium text-gray-900 "
            >
              NoMR
            </label>
            <input
              type="text"
              name="NoMR"
              id="NoMR"
              value={formData.NoMR}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg  dark:border-gray-600 "
              required
            />
          </div>
          <div>
            <label
              htmlFor="NamaPasien"
              className="block text-sm font-medium text-gray-900 "
            >
              NamaPasien
            </label>
            <input
              type="text"
              name="NamaPasien"
              id="NamaPasien"
              value={formData.NamaPasien}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg  dark:border-gray-600 "
              required
            />
          </div>
          <div>
            <label
              htmlFor="Tanggal"
              className="block text-sm font-medium text-gray-900 "
            >
              Tanggal
            </label>
            <input
              type="date"
              name="Tanggal"
              id="Tanggal"
              value={formData.Tanggal}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg  dark:border-gray-600 "
              required
            />
          </div>
          <div>
            <label
              htmlFor="Periode_Ranap"
              className="block text-sm font-medium text-gray-900 "
            >
              Periode Ranap
            </label>
            <input
              type="text"
              name="Periode_Ranap"
              id="Periode_Ranap"
              value={formData.Periode_Ranap}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg  dark:border-gray-600 "
              required
            />
          </div>
          <div>
            <label
              htmlFor="Layanan"
              className="block text-sm font-medium text-gray-900 "
            >
              Layanan
            </label>
            <input
              type="text"
              name="Layanan"
              id="Layanan"
              value={formData.Layanan}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg  dark:border-gray-600 "
              required
            />
          </div>

          <div>
            <label
              htmlFor="namadokumen"
              className="block text-sm font-medium text-gray-900 "
            >
              Nama Dokumen
            </label>
            <input
              type="text"
              name="namadokumen"
              id="namadokumen"
              value={formData.namadokumen}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg  dark:border-gray-600 "
              required
            />
          </div>
        </div>
        <div className="btn flex  gap-1">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 border border-gray-800 rounded-md hover:bg-red-700 hover:text-white hover:border-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-900 text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}

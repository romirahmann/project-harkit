/* eslint-disable no-unused-vars */
import { useState } from "react";
import { AlertMessage } from "../../shared/AlertMessage";
import api from "../../services/axios.service";
import { useAuth } from "../../store/AuthContext";
import { AddLog } from "../../services/log.service";

export function AddDokumen({ onAdd, onClose }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    kodedok: "",
    namadok: "",
    kategori: "",
  });

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.kodedok.length !== 4) {
      setAlert({
        show: true,
        message: "Kode Dokumen harus 4 karakter!",
        type: "warning",
      });
      return;
    }

    try {
      await api.post(`/master/dokumen`, formData);
      AddLog(
        user.username,
        `Menambahkan Dokumen dengan kode ${formData.kodedok}!`,
        1,
        "ADD"
      );
      onAdd("Berhasil Menambahakan dokumen!");
      setFormData({
        kodedok: "",
        namadok: "",
        kategori: "",
      });
    } catch (error) {
      setAlert({
        show: true,
        message: "Gagal Menambahkan Dokumen!",
        type: "error",
      });
    }
    AddLog(
      user.username,
      `Menambahkan Dokumen dengan kode ${formData.kodedok}!`,
      0,
      "ADD"
    );
    console.log(formData);
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          />
        </div>
        <div className="btn flex gap-1">
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

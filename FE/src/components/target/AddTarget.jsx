/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState } from "react";
import api from "../../services/axios.service";
import { useAuth } from "../../store/AuthContext";
import { AddLog } from "../../services/log.service";

export function AddTarget({ onAdd }) {
  const [formData, setFormData] = useState({
    nama: "",
    nilai: 0,
  });
  const { user } = useAuth();
  const handleChange = (e) => {
    setFormData((formData) => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/master/target", formData);
      onAdd("Add data target successfully!");
      AddLog(user.username, `Menambahkan data target `, 1, "ADD");
      setFormData({
        nama: "",
        nilai: 0,
      });
    } catch (error) {
      AddLog(user.username, `Menambahkan data target `, 0, "ADD");
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ID Proses & Nama Proses */}
        <div className="mt-5">
          <div>
            <label
              htmlFor="nama"
              className="block text-sm font-medium text-gray-900 "
            >
              Nama Target
            </label>
            <input
              type="text"
              name="nama"
              id="nama"
              value={formData.nama}
              onChange={(e) => handleChange(e)}
              className="w-full p-2 border border-gray-300 rounded-lg "
              required
            />
          </div>
          <div className="mt-3">
            <label
              htmlFor="nilai"
              className="block text-sm font-medium text-gray-900 "
            >
              Nilai
            </label>
            <input
              type="number"
              name="nilai"
              id="nilai"
              value={formData.nilai}
              onChange={(e) => handleChange(e)}
              className="w-full p-2 border border-gray-300 rounded-lg "
              required
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button className="px-3 py-2 border border-gray-800 rounded-md hover:bg-red-700 hover:text-white hover:border-white">
            Cancel
          </button>
          <button className="px-3 py-2 b rounded-md bg-blue-600 hover:bg-blue-900 text-white">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}

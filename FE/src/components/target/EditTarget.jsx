/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import api from "../../services/axios.service";
import { useAuth } from "../../store/AuthContext";
import { AddLog } from "../../services/log.service";

export function EditTarget({ data, onEdit }) {
  const [formData, setFormData] = useState({
    nama: "",
    nilai: 0,
  });
  const { user } = useAuth();
  useEffect(() => {
    setFormData({
      nama: data.nama,
      nilai: data.nilai,
    });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      await api.put(`/master/target/${data.id}`, formData);
      onEdit("Edit Target Successfully!");
      AddLog(`${user.username} berhasil edit data target!`, "SUCCESSFULLY");
      setFormData({
        nama: "",
        nilai: 0,
      });
    } catch (error) {
      AddLog(`${user.username} gagal menambahkan data proses!`, "FAILED");
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

import { useEffect, useState } from "react";
import api from "../../services/axios.service";
import { AlertMessage } from "../../shared/AlertMessage";
import { useAuth } from "../../store/AuthContext";
import { AddLog } from "../../services/log.service";

export function AddEmployee({ onAdd, onClose }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nik: "",
    nama_karyawan: "",
    submittedby: "",
  });

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    let userLogin = JSON.parse(sessionStorage.getItem("user"));

    setFormData({
      ...formData,
      submittedby: userLogin.username,
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/master/employee`, formData);
      onAdd("Add Employee Successfully!");

      AddLog(
        user.username,
        `Menambahkan Karyawan ${formData.nama_karyawan}!`,
        1,
        "ADD"
      );
    } catch (error) {
      console.log(error);
      setAlert({
        show: true,
        message: "Failed to add employee",
        type: "error",
      });
      AddLog(
        user.username,
        `Menambahkan Karyawan ${formData.nama_karyawan}!`,
        0,
        "ADD"
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NIK */}
        <div>
          <label
            htmlFor="nik"
            className="block text-sm font-medium text-gray-900"
          >
            NIK
          </label>
          <input
            type="text"
            name="nik"
            id="nik"
            value={formData.nik}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Nama Karyawan */}
        <div>
          <label
            htmlFor="nama_karyawan"
            className="block text-sm font-medium text-gray-900"
          >
            Nama Karyawan
          </label>
          <input
            type="text"
            name="nama_karyawan"
            id="nama_karyawan"
            value={formData.nama_karyawan}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
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

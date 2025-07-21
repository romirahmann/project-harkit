import { useEffect, useState } from "react";
import api from "../../services/axios.service";
import { AlertMessage } from "../../shared/AlertMessage";

export function EditEmployee({ onEdit, onClose, data }) {
  const [formData, setFormData] = useState({
    nik: "",
    nama_karyawan: "",
    submittedby: "",
    trn_date: "",
  });

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    setFormData({
      nik: data.nik,
      nama_karyawan: data.nama_karyawan,
      submittedby: data.submittedby,
      trn_date: data.trn_date,
    });
  }, [data]);

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
      await api.put(`/master/employee/${data.id}`, formData);
      onEdit("Edit Employee Successfully!");
    } catch (error) {
      console.log(error);
      setAlert({
        show: true,
        message: "Failed to edit employee",
        type: "error",
      });
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

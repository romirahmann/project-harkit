import { useState } from "react";
import api from "../../services/axios.service";
import moment from "moment";
import { useAuth } from "../../store/AuthContext";
import { AddLog } from "../../services/log.service";
import { AlertMessage } from "../../shared/AlertMessage";

/* eslint-disable no-unused-vars */
export function AddProses({ onAdd, onClose }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    idproses: "",
    nama_proses: "",
    urutan: 0,
    trn_date: moment().format("YYYY-MM-DD"),
  });

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "warning",
  });

  const handleChange = (e) => {
    setFormData((formData) => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(`/master/proses`, formData);
      onAdd("Add Proses Successfully!");

      AddLog(
        user.username,
        ` Menambahkan Data Proses ${formData.idproses}!`,
        1,
        "EDIT"
      );
    } catch (error) {
      setAlert({
        show: true,
        message: "Gagal add proses!",
        type: "error",
      });
      AddLog(user.username, ` Menambahkan Data Proses!`, 0, "EDIT");
      console.log(error);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="idproses"
            className="block text-sm font-medium text-gray-900 "
          >
            ID Proses
          </label>
          <input
            type="text"
            name="idproses"
            id="idproses"
            value={formData.idproses}
            onChange={(e) => handleChange(e)}
            className="w-full p-2 border border-gray-300 rounded-lg "
            required
          />
        </div>
        <div>
          <label
            htmlFor="nama_proses"
            className="block text-sm font-medium text-gray-900 "
          >
            Nama Proses
          </label>
          <input
            type="text"
            name="nama_proses"
            id="nama_proses"
            value={formData.nama_proses}
            onChange={(e) => handleChange(e)}
            className="w-full p-2 border border-gray-300 rounded-lg "
            required
          />
        </div>
        <div>
          <label
            htmlFor="urutan"
            className="block text-sm font-medium text-gray-900 "
          >
            Urutan
          </label>
          <input
            type="tnumber"
            name="urutan"
            id="urutan"
            value={formData.urutan}
            onChange={(e) => handleChange(e)}
            className="w-full p-2 border border-gray-300 rounded-lg "
            required
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 border border-gray-800 rounded-md hover:bg-red-700 hover:text-white hover:border-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-2 b rounded-md bg-blue-600 hover:bg-blue-900 text-white"
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

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import api from "../../services/axios.service";
import { AlertMessage } from "../../shared/AlertMessage";
import { useAuth } from "../../store/AuthContext";
import { AddLog } from "../../services/log.service";

export function EditBox({ data, onEdit, onClose }) {
  const [formEdit, setFormEdit] = useState({
    id: 0,
    NoMR: "",
    NamaPasien: "",
    Kode_Checklist: "",
    NoBox: "",
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "warning",
  });
  const { user } = useAuth();

  useEffect(() => {
    setFormEdit({
      id: data?.id,
      NoMR: data?.NoMR,
      NamaPasien: data?.NamaPasien,
      Kode_Checklist: data?.Kode_Checklist,
      NoBox: data?.NoBox,
    });
  }, [data]);
  const handleChange = (e) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/master/box/${formEdit.id}`, formEdit);
      onEdit("Update Data Box Successfully!");
      AddLog(`${user.username} berhasil edit data box!`, "SUCCESSFULLY");
    } catch (error) {
      console.log(error);
      setAlert({
        show: true,
        message: "Error Update Data Box",
        type: "error",
      });
      AddLog(`${user.username} gagal menambahkan data box!`, "FAILED");
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label
            htmlFor="NoMR"
            className="block text-sm font-medium text-gray-900 "
          >
            No MR
          </label>
          <input
            type="text"
            name="NoMR"
            id="NoMR"
            onChange={handleChange}
            value={formEdit.NoMR}
            className="w-full p-2 border border-gray-300 rounded-lg   "
          />
        </div>
        <div>
          <label
            htmlFor="NamaPasien"
            className="block text-sm font-medium text-gray-900 "
          >
            Nama Pasien
          </label>
          <input
            type="text"
            name="NamaPasien"
            id="NamaPasien"
            onChange={handleChange}
            value={formEdit.NamaPasien}
            className="w-full p-2 border border-gray-300 rounded-lg   "
          />
        </div>
        <div>
          <label
            htmlFor="Kode_Checklist"
            className="block text-sm font-medium text-gray-900 "
          >
            Kode Checklist
          </label>
          <input
            type="text"
            name="Kode_Checklist"
            id="Kode_Checklist"
            onChange={handleChange}
            value={formEdit.Kode_Checklist}
            className="w-full p-2 border border-gray-300 rounded-lg   "
          />
        </div>
        <div>
          <label
            htmlFor="NoBox"
            className="block text-sm font-medium text-gray-900 "
          >
            No Box
          </label>
          <input
            type="text"
            name="NoBox"
            id="NoBox"
            onChange={handleChange}
            value={formEdit.NoBox}
            className="w-full p-2 border border-gray-300 rounded-lg   "
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

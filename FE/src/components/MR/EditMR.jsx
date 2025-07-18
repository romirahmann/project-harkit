/* eslint-disable no-unused-vars */
import moment from "moment";
import { useEffect, useState } from "react";
import api from "../../services/axios.service";
import { AlertMessage } from "../../shared/AlertMessage";

export function EditMR({ onEdit, data, onClose }) {
  const [formData, setFormData] = useState({
    NoUrut: "",
    NoMR: "",
    NamaPasien: "",
    Tanggal: "",
    Kode_Checklist: "",
    nobox: "",
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "warning",
  });
  useEffect(() => {
    setFormData({
      NoUrut: data.NoUrut,
      NoMR: data.NoMR,
      NamaPasien: data.NamaPasien,
      Tanggal: moment(data.Tanggal, "DDMMYYYY").format("YYYY-MM-DD"),
      Kode_Checklist: data.Kode_Checklist,
      nobox: data.nobox,
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

    try {
      await api.put(`/master/datamr/${data?.NoUrut}/${data?.Kode_Checklist}`);
      onEdit("Edit MR Successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-200 "
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
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-200   "
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
            className="w-full p-2 border border-gray-300 rounded-lg   "
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
            className="w-full p-2 border border-gray-300 rounded-lg   "
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
            className="w-full p-2 border border-gray-300 rounded-lg   "
            required
          />
        </div>

        <div>
          <label
            htmlFor="nobox"
            className="block text-sm font-medium text-gray-900 "
          >
            NoBox
          </label>
          <input
            type="text"
            name="nobox"
            id="nobox"
            value={formData.nobox}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg   "
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

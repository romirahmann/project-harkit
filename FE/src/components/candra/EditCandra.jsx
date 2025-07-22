/* eslint-disable no-unused-vars */
import moment from "moment";
import { useEffect, useState } from "react";
import api from "../../services/axios.service";
import { AlertMessage } from "../../shared/AlertMessage";
import { useAuth } from "../../store/AuthContext";
import { AddLog } from "../../services/log.service";

export function EditCandra({ onEdit, data, onClose }) {
  const [formData, setFormData] = useState({
    id: 0,
    NoMR: "",
    NamaPasien: "",
    Kode_Checklist: "",
    NoBox: "",
  });
  const { user } = useAuth();

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "warning",
  });

  useEffect(() => {
    setFormData({
      kode_checklist: data?.kode_checklist || "",
      idproses: data?.idproses || "",
      nama_proses: data?.nama_proses || "",
      nik: data?.nik || "",
      qty_image: data?.qty_image || 0,
      nama_karyawan: data?.nama_karyawan || "",
      tanggal: moment(data?.tanggal).format("YYYY-MM-DD") || "",
      mulai: moment(data?.mulai).format("HH:mm:ss") || "",
      selesai: moment(data?.selesai).format("HH:mm:ss") || "",
      editby: user.username || "",
    });
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/master/candra/${data.kode_checklist}/${data.idproses}`,
        formData
      );
      onEdit("Edit Successfully!");
      AddLog(`${user.username} berhasil edit data candra!`, "SUCCESSFULLY");
    } catch (error) {
      console.log(error);
      AddLog(`${user.username} gagal edit data candra!`, "FAILED");
      setAlert({
        show: true,
        message: "Gagal Edit Candra!",
        type: "error",
      });
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        {formData.idproses === "1003" ? (
          <div>
            <label className="block text-sm font-medium">Qty Image</label>
            <input
              type="text"
              name="qty_image"
              value={formData.qty_image}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
        ) : (
          ""
        )}

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

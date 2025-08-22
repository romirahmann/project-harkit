/* eslint-disable no-unused-vars */
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../store/AuthContext";
import api from "../../services/axios.service";
import { AlertMessage } from "../../shared/AlertMessage";
import { AddLog } from "../../services/log.service";

export function FormScan({ onAdd }) {
  const initialFormData = {
    kode_checklist: "",
    idproses: "",
    nama_proses: "",
    qty_image: 0,
    nik: "",
    nama_karyawan: "",
    mulai: "",
    selesai: "",
    submittedby: "",
    tanggal: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLocked, setIsLocked] = useState(false);
  const kodeChecklistRef = useRef(null);

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "warning",
  });
  const { user } = useAuth();

  const [prosesList, setProsesList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);

  // refs untuk pindah fokus
  const idProsesRef = useRef(null);
  const nikRef = useRef(null);

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    try {
      const [prosesRes, empRes] = await Promise.all([
        api.get("/master/prosess"),
        api.get("/master/employees"),
      ]);
      setProsesList(prosesRes.data.data || []);
      setEmployeeList(empRes.data.data || []);
    } catch (error) {
      console.log("Error fetch master data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    if (name === "idproses") {
      const proses = prosesList.find(
        (p) => p.idproses.toLowerCase() === value.toLowerCase()
      );
      updatedForm.nama_proses = proses ? proses.nama_proses : "";
    }

    if (name === "nik") {
      const karyawan = employeeList.find(
        (k) => k.nik.toLowerCase() === value.toLowerCase()
      );
      updatedForm.nama_karyawan = karyawan ? karyawan.nama_karyawan : "";
    }

    setFormData(updatedForm);
  };

  // custom Enter flow
  const handleEnter = (e, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (field === "kode_checklist") {
        idProsesRef.current?.focus();
      } else if (field === "idproses") {
        nikRef.current?.focus();
      } else if (field === "nik") {
        // langsung submit form
        e.target.form.requestSubmit();
      }
    }
  };

  const resetForm = () => {
    setFormData((prev) => ({
      ...initialFormData,
      idproses: isLocked ? prev.idproses : "",
      nama_proses: isLocked ? prev.nama_proses : "",
      nik: isLocked ? prev.nik : "",
      nama_karyawan: isLocked ? prev.nama_karyawan : "",
    }));
    kodeChecklistRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.kode_checklist || !formData.idproses || !formData.nik) {
      setAlert({
        show: true,
        message: "Lengkapi inputan sebelum melanjutkan",
        type: "error",
      });
      return;
    }

    const newFormData = {
      ...formData,
      mulai: moment().format("HH:mm:ss"),
      selesai: "00:00:00",
      submittedby: user?.username || "",
      tanggal: moment().format("YYYY-MM-DD"),
    };

    try {
      await api.post(`/master/add-scan`, newFormData);
      onAdd("Add Proses Scanning Successfully!");

      AddLog(
        user.username,
        `Menambahkan Proses Scan Kode Checklist ${newFormData.kode_checklist}!`,
        1,
        "ADD"
      );

      resetForm();
      fetchMasterData();
    } catch (error) {
      console.log(error?.response?.data?.data || error);

      AddLog(
        user.username,
        `Menambahkan Proses Scan Kode Checklist ${newFormData.kode_checklist}!`,
        0,
        "ADD"
      );

      setAlert({
        show: true,
        message:
          error?.response?.data?.data?.message ||
          "Gagal menambahkan data scan.",
        type: "error",
      });
    }
  };

  return (
    <>
      <form className="space-y-3 p-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl text-center font-semibold mb-4">SCAN MULAI</h2>

        <input
          type="text"
          name="kode_checklist"
          placeholder="Kode Checklist"
          value={formData.kode_checklist}
          onChange={handleChange}
          onKeyDown={(e) => handleEnter(e, "kode_checklist")}
          ref={kodeChecklistRef}
          className="w-full p-2 border border-gray-200 rounded"
          required
        />

        <input
          type="text"
          name="idproses"
          placeholder="ID Proses"
          value={formData.idproses}
          onChange={handleChange}
          onKeyDown={(e) => handleEnter(e, "idproses")}
          ref={idProsesRef}
          className={`w-full p-2 border border-gray-200 rounded ${
            isLocked ? "bg-gray-300" : ""
          }`}
          required
          disabled={!formData.kode_checklist || isLocked} // hanya aktif setelah kode_checklist diisi
        />

        <input
          type="text"
          name="nik"
          placeholder="NIK"
          value={formData.nik}
          onChange={handleChange}
          onKeyDown={(e) => handleEnter(e, "nik")}
          ref={nikRef}
          className={`w-full p-2 border border-gray-200 rounded ${
            isLocked ? "bg-gray-300" : ""
          }`}
          required
          disabled={!formData.idproses || isLocked} // hanya aktif setelah idproses diisi
        />

        <input
          type="text"
          name="nama_proses"
          placeholder="Nama Proses"
          value={formData.nama_proses}
          disabled
          className="w-full p-2 border border-gray-200 rounded bg-gray-300"
        />

        <input
          type="text"
          name="nama_karyawan"
          placeholder="Nama Karyawan"
          value={formData.nama_karyawan}
          disabled
          className="w-full p-2 border border-gray-200 rounded bg-gray-300"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="lockValues"
            checked={isLocked}
            onChange={() => setIsLocked(!isLocked)}
          />
          <label htmlFor="lockValues">Kunci ID Proses & NIK</label>
        </div>

        <button
          type="submit"
          className="w-full hover:bg-blue-800 cursor-pointer bg-blue-600 text-white p-2 rounded"
        >
          Submit
        </button>
      </form>

      {alert.show && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: "", message: "" })}
        />
      )}
    </>
  );
}

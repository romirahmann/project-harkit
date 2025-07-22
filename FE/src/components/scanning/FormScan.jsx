/* eslint-disable no-unused-vars */
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../store/AuthContext";
import api from "../../services/axios.service";
import { AlertMessage } from "../../shared/AlertMessage";
import { AddLog } from "../../services/log.service";

export function FormScan({ onAdd }) {
  const [formData, setFormData] = useState({
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
  });
  const [step, setStep] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const kodeChecklistRef = useRef(null);

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "warning",
  });
  const { user } = useAuth();

  useEffect(() => {
    if (formData.idproses) fetchProsesByID();
  }, [formData.idproses]);

  useEffect(() => {
    if (formData.nik) fetchkaryawanByNIK();
  }, [formData.nik]);

  const fetchProsesByID = async () => {
    try {
      if (formData.idproses) {
        let res = await api.get(`/master/proses/${formData.idproses}`);
        let data = res.data.data;
        setFormData((prev) => ({
          ...prev,
          nama_proses: data.nama_proses,
        }));
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };
  const fetchkaryawanByNIK = async () => {
    try {
      if (formData.nik) {
        let res = await api.get(`/master/employee-by-nik/${formData.nik}`);
        let data = res.data.data;
        setFormData((prev) => ({
          ...prev,
          nama_karyawan: data.nama_karyawan,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  const handleNextStep = (field) => {
    if (formData[field].trim()) {
      setStep((prev) => prev + 1);
    }
  };
  const handleEnter = (e) => {
    if (!isLocked) {
      setStep((prev) => prev + 1);
      if (e.key === "Enter") {
        e.preventDefault(); // Mencegah form submit default

        const form = e.target.form;
        const index = Array.from(form.elements).indexOf(e.target);
        const nextElement = form.elements[index + 1];

        if (!e.target.value.trim()) {
          setAlert({
            show: true,
            message: "Please fill in all fields before proceeding",
            type: "warning",
          });
          return;
        }

        if (nextElement) {
          if (nextElement.disabled) {
            // Jika elemen berikutnya disable, submit form
            form.submit();
          } else {
            // Jika tidak, fokus ke elemen berikutnya
            nextElement.focus();
          }
        }
      }
    }
  };
  const resetForm = () => {
    setFormData((prev) => ({
      kode_checklist: "",
      idproses: isLocked ? prev.idproses : "",
      nama_proses: isLocked ? prev.nama_proses : "",
      qty_image: 0,
      nik: isLocked ? prev.nik : "",
      nama_karyawan: isLocked ? prev.nama_karyawan : "",
      mulai: "",
      selesai: "",
      submittedby: "",
      tanggal: "",
    }));
    setStep(1);
    kodeChecklistRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.kode_checklist ||
      !formData.idproses ||
      !formData.nama_proses ||
      !formData.nik ||
      !formData.nama_karyawan
    ) {
      setAlert({
        show: true,
        message: "Lengkapi inputan sebelum melanjutkan",
        type: "error",
      });
      return;
    }

    const dateNow = moment().format("YYYY-MM-DD");
    const timestamp = moment().format("HH:mm:ss");
    const submittedByUser = user?.username || "";

    const newFormData = {
      ...formData,
      mulai: timestamp,
      selesai: "00:00:00",
      submittedby: submittedByUser,
      tanggal: dateNow,
    };

    console.log(newFormData);

    try {
      await api.post(`/master/add-scan`, newFormData);
      onAdd("Add Proses Scanning Successfully!");
      AddLog(
        `${user.username} berhasil menambahkan proses scan kode checklist ${newFormData.kode_checklist}!`,
        "SUCCESSFULLY"
      );
      resetForm(); // gunakan resetForm saat sukses
    } catch (error) {
      console.log(error?.response?.data?.data || error);
      AddLog(
        `${user.username} gagal menambahkan proses scan kode checklist ${newFormData.kode_checklist}!`,
        "FAILED"
      );
      const message =
        error?.response?.data?.data?.message || "Gagal menambahkan data scan.";

      setAlert({
        show: true,
        message,
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
          onBlur={() => handleNextStep("kode_checklist")}
          onKeyDown={(e) => handleEnter(e)}
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
          onBlur={() => handleNextStep("idproses")}
          onKeyDown={(e) => handleEnter(e)}
          className={`w-full p-2 border border-gray-200 rounded ${
            isLocked ? "bg-gray-300" : ""
          }`}
          required
          disabled={step < 2 || isLocked}
        />

        <input
          type="text"
          name="nik"
          placeholder="NIK"
          value={formData.nik}
          onChange={handleChange}
          onKeyDown={(e) => handleEnter(e)}
          onBlur={() => handleNextStep("nik")}
          className={`w-full p-2 border border-gray-200 rounded ${
            isLocked ? "bg-gray-300" : ""
          }`}
          required
          disabled={step < 3 || isLocked}
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

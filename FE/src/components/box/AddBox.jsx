/* eslint-disable no-unused-vars */
import { useState } from "react";

export function AddBox({ onAdd, onClose }) {
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
  return <></>;
}

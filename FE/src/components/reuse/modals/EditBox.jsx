import { Button, Modal } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { ApiUrl } from "../../../context/Urlapi";
import axios from "axios";
import { AddLog } from "../../../context/Log";

/* eslint-disable no-unused-vars */
export function EditBox({ isOpen, onClose, boxData, updateBox }) {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const baseUrl = useContext(ApiUrl);
  const userData = JSON.parse(sessionStorage.getItem("userData")) || {};
  const [loading, setLoading] = useState("");
  const [formEdit, setFormEdit] = useState({
    id: 0,
    NoMR: "",
    NamaPasien: "",
    Kode_Checklist: "",
    NoBox: "",
  });

  useEffect(() => {
    setFormEdit({
      id: boxData?.id,
      NoMR: boxData?.NoMR,
      NamaPasien: boxData?.NamaPasien,
      Kode_Checklist: boxData?.Kode_Checklist,
      NoBox: boxData?.NoBox,
    });
  }, [boxData]);

  const handleChange = (e) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response = await axios.put(
        `${baseUrl}/master/box/${formEdit.id}`,
        formEdit
      );

      AddLog(`${userData.username} edit data Box dengan id ${formEdit.id}`);
      setSuccessMessage(
        `Box dengan ID ${formEdit.id} dan MR ${formEdit.NoMR} berhasil diperbarui.`
      );
      setTimeout(() => {
        updateBox();
        setSuccessMessage("");
        setLoading(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <>
      <Modal show={isOpen} onClose={onClose} size="2xl">
        <Modal.Header>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            EDIT BOX
          </p>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pesan Sukses */}
            {successMessage && (
              <div
                className="p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                role="alert"
              >
                <span className="font-medium">{successMessage}</span>
              </div>
            )}

            {/* Pesan Error */}
            {errorMessage && (
              <div
                className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="NoMR"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                No MR
              </label>
              <input
                type="text"
                name="NoMR"
                id="NoMR"
                onChange={handleChange}
                value={formEdit.NoMR}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white "
              />
            </div>
            <div>
              <label
                htmlFor="NamaPasien"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Nama Pasien
              </label>
              <input
                type="text"
                name="NamaPasien"
                id="NamaPasien"
                onChange={handleChange}
                value={formEdit.NamaPasien}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white "
              />
            </div>
            <div>
              <label
                htmlFor="Kode_Checklist"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Kode Checklist
              </label>
              <input
                type="text"
                name="Kode_Checklist"
                id="Kode_Checklist"
                onChange={handleChange}
                value={formEdit.Kode_Checklist}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white "
              />
            </div>
            <div>
              <label
                htmlFor="NoBox"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                No Box
              </label>
              <input
                type="text"
                name="NoBox"
                id="NoBox"
                onChange={handleChange}
                value={formEdit.NoBox}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white "
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={(e) => handleSubmit(e)}
            color="blue"
            disabled={loading}
          >
            {loading ? "Updating..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

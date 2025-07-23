import { useState } from "react";
import { useAuth } from "../../store/AuthContext";
import api from "../../services/axios.service";
import { AddLog } from "../../services/log.service";
import { AlertMessage } from "../../shared/AlertMessage";
import { ModalDelete } from "../../shared/ModalDeleted";
import { AddDokumen } from "./AddDokumen";
import { Modal } from "../../shared/Modal";
import { EditDokumen } from "./EditDokumen";

export function DokumenAction({ isOpen, type, data, onClose, onAction }) {
  const { user } = useAuth();
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "warning",
  });
  const handleDeleted = async () => {
    try {
      await api.delete(`/master/dokumen/${data.kodedok}`);
      onAction("Deleted dokumen Successfully!");
      AddLog(
        `${user.username} berhasil menghapus data dokumen!`,
        "SUCCESSFULLY"
      );
    } catch (error) {
      setAlert({
        show: true,
        message: "Failed to delete Employee",
        type: "error",
      });
      AddLog(`${user.username} gagal menghapus data dokumen!`, "FAILED");
      console.log(error);
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} title={`${type} DOKUMEN`} onClose={onClose}>
        {type === "ADD" && <AddDokumen onAdd={onAction} onClose={onClose} />}
        {type === "EDIT" && (
          <EditDokumen data={data} onEdit={onAction} onClose={onClose} />
        )}
        {type === "DELETE" && (
          <ModalDelete
            isOpen={isOpen}
            onDelete={handleDeleted}
            onClose={onClose}
          />
        )}
      </Modal>
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

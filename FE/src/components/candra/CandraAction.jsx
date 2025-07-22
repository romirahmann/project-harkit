/* eslint-disable no-unused-vars */
import { useState } from "react";
import api from "../../services/axios.service";
import { AddLog } from "../../services/log.service";
import { AlertMessage } from "../../shared/AlertMessage";
import { Modal } from "../../shared/Modal";
import { ModalDelete } from "../../shared/ModalDeleted";
import { useAuth } from "../../store/AuthContext";
import { EditCandra } from "./EditCandra";

export function CandraAction({ isOpen, type, data, onClose, onAction }) {
  const { user } = useAuth();
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "warning",
  });

  const handleDeleted = async () => {
    try {
      await api.delete(`/master/candra/${data.id}`);
      onAction("Deleted Proses Successfully!");
      AddLog(`${user.username} berhasil delete data candra!`, "SUCCESSFULLY");
    } catch (error) {
      console.log(error);
      AddLog(`${user.username} gagal delete data candra!`, "FAILED");
      setAlert({
        show: true,
        message: "Gagal menghapus data candra",
        type: "error",
      });
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} title={`${type} CANDRA`} onClose={onClose}>
        {type === "EDIT" && (
          <EditCandra data={data} onEdit={onAction} onClose={onClose} />
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

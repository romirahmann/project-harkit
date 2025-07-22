import { useState } from "react";
import api from "../../services/axios.service";
import { AddLog } from "../../services/log.service";
import { Modal } from "../../shared/Modal";
import { useAuth } from "../../store/AuthContext";
import { Activated } from "./Activeted";

import { EditMR } from "./EditMR";
import { NonActive } from "./NonActive";
import { AlertMessage } from "../../shared/AlertMessage";

/* eslint-disable no-unused-vars */
export function MRAction({ isOpen, type, data, onClose, onAction }) {
  const { user } = useAuth();
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "warning",
  });
  const handleDeleted = async () => {
    try {
      await api.delete(`/master/datamr/${data.NoUrut}/${data.Kode_Checklist}`);
      onAction("Deleted Proses Successfully!");
      AddLog(`${user.username} berhasil menghapus data MR!`, "SUCCESSFULLY");
    } catch (error) {
      setAlert({
        show: true,
        message: "Failed to delete Employee",
        type: "error",
      });
      AddLog(`${user.username} gagal menghapus data MR!`, "FAILED");
      console.log(error);
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} title={`${type} MR`} onClose={onClose}>
        {type === "ACTIVE" && (
          <Activated data={data} onAction={onAction} onClose={onClose} />
        )}
        {type === "NONACTIVE" && (
          <NonActive data={data} onAction={onAction} onClose={onClose} />
        )}
        {type === "EDIT" && (
          <EditMR data={data} onEdit={onAction} onClose={onClose} />
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

import { useState } from "react";
import api from "../../services/axios.service";
import { AddLog } from "../../services/log.service";
import { AlertMessage } from "../../shared/AlertMessage";
import { Modal } from "../../shared/Modal";
import { ModalDelete } from "../../shared/ModalDeleted";
import { useAuth } from "../../store/AuthContext";
import { EditKCP } from "./EditKCP";

/* eslint-disable no-unused-vars */
export function KcpAction({ isOpen, type, data, onClose, onAction }) {
  const { user } = useAuth();
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "warning",
  });
  const handleDeleted = async () => {
    try {
      await api.delete(
        `/master/dataMRt3/${data.NoUrut}/${data.Kode_Checklist}`
      );
      onAction("Deleted Proses Successfully!");
      AddLog(
        user.username,
        `Delete Data KCP dengan No Urut ${data.NoUrut} dan Kode Checklist ${data.Kode_Checklist} !`,
        1,
        "DELETE"
      );
    } catch (error) {
      console.log(error);
      setAlert({
        show: true,
        message: "Failed to delete data",
        type: "error",
      });
      AddLog(
        user.username,
        `Delete Data KCP dengan No Urut ${data.NoUrut} dan Kode Checklist ${data.Kode_Checklist} !`,
        0,
        "DELETE"
      );
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} title={`${type} KCP`} onClose={onClose}>
        {type === "EDIT" && <EditKCP data={data} onEdit={onAction} />}
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
      ;
    </>
  );
}

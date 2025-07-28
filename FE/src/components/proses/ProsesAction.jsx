/* eslint-disable no-unused-vars */
import api from "../../services/axios.service";
import { AddLog } from "../../services/log.service";
import { Modal } from "../../shared/Modal";
import { ModalDelete } from "../../shared/ModalDeleted";
import { useAuth } from "../../store/AuthContext";
import { AddProses } from "./AddProses";
import { EditProses } from "./EditProses";

export function ProsesAction({ isOpen, type, data, onClose, onAction }) {
  const { user } = useAuth();
  const handleDeleted = async () => {
    try {
      await api.delete(`/master/proses/${data.id}`);
      onAction("Deleted Proses Successfully!");

      AddLog(user.username, ` Delete Data Proses!`, 1, "DELETE");
    } catch (error) {
      console.log(error);
      AddLog(user.username, ` Delete Data Proses!`, 0, "DELETE");
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} title={`${type} Proses`} onClose={onClose}>
        {type === "ADD" && <AddProses onAdd={onAction} />}
        {type === "EDIT" && <EditProses data={data} onEdit={onAction} />}
        {type === "DELETE" && (
          <ModalDelete
            isOpen={isOpen}
            onDelete={handleDeleted}
            onClose={onClose}
          />
        )}
      </Modal>
    </>
  );
}

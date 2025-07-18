/* eslint-disable no-unused-vars */
import api from "../../services/axios.service";
import { Modal } from "../../shared/Modal";
import { ModalDelete } from "../../shared/ModalDeleted";
import { EditCandra } from "./EditCandra";

export function CandraAction({ isOpen, type, data, onClose, onAction }) {
  const handleDeleted = async () => {
    try {
      await api.delete(`/master/candra/${data.id}`);
      onAction("Deleted Proses Successfully!");
    } catch (error) {
      console.log(error);
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
    </>
  );
}

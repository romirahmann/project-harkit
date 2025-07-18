/* eslint-disable no-unused-vars */
import api from "../../services/axios.service";
import { Modal } from "../../shared/Modal";
import { ModalDelete } from "../../shared/ModalDeleted";
import { AddProses } from "./AddProses";
import { EditProses } from "./EditProses";

export function ProsesAction({ isOpen, type, data, onClose, onAction }) {
  const handleDeleted = async () => {
    try {
      await api.delete(`/master/proses/${data.id}`);
      onAction("Deleted Proses Successfully!");
    } catch (error) {
      console.log(error);
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

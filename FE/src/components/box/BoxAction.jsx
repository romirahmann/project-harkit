import api from "../../services/axios.service";
import { Modal } from "../../shared/Modal";
import { ModalDelete } from "../../shared/ModalDeleted";

import { EditBox } from "./EditBox";

export function BoxAction({ isOpen, type, data, onClose, onAction }) {
  const handleDeleted = async () => {
    try {
      await api.delete(`/master/box/${data.id}`);
      onAction("Deleted Proses Successfully!");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} title={`${type} CANDRA`} onClose={onClose}>
        {/* {type === "EDIT" && <AddBox onAdd={onAction} onClose={onClose} />} */}
        {type === "EDIT" && (
          <EditBox data={data} onEdit={onAction} onClose={onClose} />
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

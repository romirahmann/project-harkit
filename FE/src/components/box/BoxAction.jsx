/* eslint-disable no-unused-vars */
import api from "../../services/axios.service";
import { AddLog } from "../../services/log.service";
import { Modal } from "../../shared/Modal";
import { ModalDelete } from "../../shared/ModalDeleted";
import { useAuth } from "../../store/AuthContext";

import { EditBox } from "./EditBox";

export function BoxAction({ isOpen, type, data, onClose, onAction }) {
  const { user } = useAuth();
  const handleDeleted = async () => {
    try {
      await api.delete(`/master/box/${data.id}`);
      onAction("Deleted Proses Successfully!");
      AddLog(user.username, `Delete Data Box `, 1, "DELETE");
    } catch (error) {
      AddLog(user.username, `Delete Data Box `, 0, "DELETE");
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

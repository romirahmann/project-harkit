import api from "../../services/axios.service";
import { Modal } from "../../shared/Modal";
import { ModalDelete } from "../../shared/ModalDeleted";
import { EditKCP } from "./EditKCP";

/* eslint-disable no-unused-vars */
export function KcpAction({ isOpen, type, data, onClose, onAction }) {
  const handleDeleted = async () => {
    try {
      await api.delete(
        `/master/dataMRt3/${data.NoUrut}/${data.Kode_Checklist}`
      );
      onAction("Deleted Proses Successfully!");
    } catch (error) {
      console.log(error);
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
    </>
  );
}

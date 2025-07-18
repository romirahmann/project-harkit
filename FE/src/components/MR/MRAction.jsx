import api from "../../services/axios.service";
import { Modal } from "../../shared/Modal";
import { Activated } from "./Activeted";

import { EditMR } from "./EditMR";
import { NonActive } from "./NonActive";

/* eslint-disable no-unused-vars */
export function MRAction({ isOpen, type, data, onClose, onAction }) {
  const handleDeleted = async () => {
    try {
      await api.delete(`/master/datamr/${data.NoUrut}/${data.Kode_Checklist}`);
      onAction("Deleted Proses Successfully!");
    } catch (error) {
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
    </>
  );
}

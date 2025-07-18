import api from "../../services/axios.service";
import { Modal } from "../../shared/Modal";
import { ModalDelete } from "../../shared/ModalDeleted";
import { AddEmployee } from "./AddEmployee";
import { EditEmployee } from "./EditEmployee";

/* eslint-disable no-unused-vars */
export function EmployeeAction({ isOpen, type, data, onClose, onAction }) {
  const handleDeleted = async () => {
    try {
      await api.delete(`/master/employee/${data.id}`);
      onAction("Deleted Proses Successfully!");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} title={`${type} EMPLOYEE`} onClose={onClose}>
        {type === "ADD" && <AddEmployee onAdd={onAction} onClose={onClose} />}
        {type === "EDIT" && <EditEmployee data={data} onEdit={onAction} />}
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

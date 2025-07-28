import { useState } from "react";
import api from "../../services/axios.service";
import { AddLog } from "../../services/log.service";
import { AlertMessage } from "../../shared/AlertMessage";
import { Modal } from "../../shared/Modal";
import { ModalDelete } from "../../shared/ModalDeleted";
import { useAuth } from "../../store/AuthContext";
import { AddEmployee } from "./AddEmployee";
import { EditEmployee } from "./EditEmployee";

/* eslint-disable no-unused-vars */
export function EmployeeAction({ isOpen, type, data, onClose, onAction }) {
  const { user } = useAuth();
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "warning",
  });
  const handleDeleted = async () => {
    try {
      await api.delete(`/master/employee/${data.id}`);
      onAction("Deleted Proses Successfully!");
      AddLog(user.username, `Delete Data Karyawan`, 1, "DELETE");
    } catch (error) {
      setAlert({
        show: true,
        message: "Failed to delete Employee",
        type: "error",
      });
      AddLog(user.username, `Delete Data Karyawan`, 0, "DELETE");
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

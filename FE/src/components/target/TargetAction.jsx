/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { Modal } from "../../shared/Modal";

import { ModalDelete } from "../../shared/ModalDeleted";

import api from "../../services/axios.service";
import { AddProses } from "../proses/AddProses";
import { EditProses } from "../proses/EditProses";

export function TargetAction({ isOpen, type, data, onClose, onAction }) {
  const handleDeleted = async () => {
    try {
      await api.delete(`/master/target/${data.id}`);
      onAction("Deleted Target Successfully!");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} title={`${type} Target`} onClose={onClose}>
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

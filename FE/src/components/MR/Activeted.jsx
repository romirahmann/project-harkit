/* eslint-disable no-unused-vars */
import { MdBlock } from "react-icons/md";
import { motion } from "framer-motion";
import { AnimatePresence } from "motion/react";
import api from "../../services/axios.service";
import { AlertMessage } from "../../shared/AlertMessage";
import { useState } from "react";
import { FcProcess } from "react-icons/fc";

export function Activated({ data, onAction, onClose }) {
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "warning",
  });
  const handleActive = async () => {
    if (!data) {
      setAlert({
        show: true,
        message: "Data MR Not Found!",
        type: "error",
      });
      return;
    }

    try {
      await api.post(`/master/aktif-mr`, data);
      onAction(`Active ${data.NoMR} Successfully!`);
    } catch (error) {
      setAlert({
        show: true,
        message: "Failed to Active MR",
        type: "error",
      });
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full">
        <AnimatePresence>
          <motion.div
            initial={{ y: -20, opacity: 0, rotate: -180 }}
            animate={{ y: [-20, 10, -5, 0], opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="icon flex justify-center text-[10em] "
          >
            <FcProcess />
          </motion.div>
        </AnimatePresence>
        <h1 className="text-center text-gray-800 my-10">
          Are you sure for active this data ?
        </h1>
        <div className="btn flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-transparent border border-gray-700 rounded-md text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={() => handleActive()}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md text-white"
          >
            Activated
          </button>
        </div>
      </div>
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

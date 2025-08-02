/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export function AlertMessage({ type = "success", message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const baseStyle =
    "flex items-center gap-3 p-4 rounded-md text-sm font-medium shadow-md";

  const typeStyle = {
    success: "bg-green-100 text-green-800 border border-green-300",
    error: "bg-red-100 text-red-800 border border-red-300",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  };

  const icons = {
    success: <FaCheckCircle className="text-green-600" />,
    error: <FaTimesCircle className="text-red-600" />,
    warning: <FaExclamationTriangle className="text-yellow-600" />,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-50 ${baseStyle} ${typeStyle[type]}`}
      >
        {icons[type]}
        <span className="flex-1">{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}

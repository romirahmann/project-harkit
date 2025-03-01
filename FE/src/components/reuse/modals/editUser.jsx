import { useState } from "react";
import { Modal } from "flowbite-react";

export function EditUser({ isOpen, onClose, userData }) {
  const [formData, setFormData] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
    role: userData?.role || "User",
    password: "",
  });

  // Handle perubahan input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit perubahan
  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <Modal.Header>
        <p className="text-xl font-bold text-gray-800 dark:text-white">
          Edit User
        </p>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          {/* Password (Opsional) */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              New Password (optional)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
}

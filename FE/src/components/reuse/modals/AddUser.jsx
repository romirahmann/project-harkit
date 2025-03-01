import { useState } from "react";
import { Modal, Button } from "flowbite-react";

export function AddUser({ isOpen, onClose }) {
  // State untuk menyimpan input form
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    jabatan: "",
    password: "",
  });

  // Handle perubahan input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Data:", formData);
    onClose(); // Tutup modal setelah submit
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <Modal.Header>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          ADD USER
        </p>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Role & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="jabatan"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Select a Role
              </label>
              <select
                id="jabatan"
                name="jabatan"
                value={formData.jabatan}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Choose a role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer className="flex justify-end">
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button color="blue" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

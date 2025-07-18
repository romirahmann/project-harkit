/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Modal } from "../../shared/Modal";

export function AddModalUser({ isOpen = false, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    jabatan: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      username: "",
      email: "",
      jabatan: "",
      password: "",
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} title="Add User" onClose={onClose}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-900 "
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg "
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 "
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg "
                required
              />
            </div>
          </div>

          {/* Role & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="jabatan"
                className="block text-sm font-medium text-gray-900 "
              >
                Select a Role
              </label>
              <select
                id="jabatan"
                name="jabatan"
                value={formData.jabatan}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg "
              >
                <option value="">Choose a role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Leader">Leader</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 "
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg "
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="py-2 px-3 bg-blue-600 rounded-md text-white font-bold"
          >
            ADD USER
          </button>
        </form>
      </Modal>
    </>
  );
}

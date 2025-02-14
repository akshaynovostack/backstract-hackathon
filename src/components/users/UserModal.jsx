"use client";
import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";

export default function UserModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  teams,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
    team_id: "",
    status: "active",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        password: "", // Don't populate password for editing
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: initialData?.id,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit User" : "Add User"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        {!initialData && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required={!initialData}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Team
          </label>
          <select
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.team_id}
            onChange={(e) =>
              setFormData({ ...formData, team_id: e.target.value })
            }
          >
            <option value="">Select Team</option>
            {teams?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {initialData ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

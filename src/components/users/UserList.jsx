"use client";
import { useState } from "react";
import { Edit, Trash2, Mail, Phone, Users } from "lucide-react";
import UserModal from "./UserModal";

export default function UserList({ users, teams, onRefresh }) {
  const [editingUser, setEditingUser] = useState(null);

  const handleEditUser = async (userData) => {
    try {
      const response = await fetch(
        `https://cc1fbde45ead-in-south-01.backstract.io/lucid-jang-c1c0cae4eaba11ef8e440242ac12000577/api/users/${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        onRefresh();
        setEditingUser(null);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `https://cc1fbde45ead-in-south-01.backstract.io/lucid-jang-c1c0cae4eaba11ef8e440242ac12000577/api/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const getTeamName = (teamId) => {
    const team = teams?.find((t) => t.id === teamId);
    return team ? team.name : "No Team";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.users_all.map((user) => (
        <div
          key={user.id}
          className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium text-lg">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingUser(user)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="p-1 hover:bg-gray-100 rounded text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Mail size={16} className="mr-2" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center">
              <Phone size={16} className="mr-2" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="mr-2" />
              <span>{getTeamName(user.team_id)}</span>
            </div>
            <div className="flex items-center">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  user.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>
        </div>
      ))}

      {editingUser && (
        <UserModal
          isOpen={true}
          onClose={() => setEditingUser(null)}
          onSubmit={handleEditUser}
          initialData={editingUser}
          teams={teams}
        />
      )}
    </div>
  );
}

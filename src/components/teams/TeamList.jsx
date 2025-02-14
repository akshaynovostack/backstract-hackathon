"use client";
import { useState } from "react";
import { Edit, Trash2, Users } from "lucide-react";
import TeamModal from "./TeamModal";

export default function TeamList({ teams, onRefresh }) {
  const [editingTeam, setEditingTeam] = useState(null);

  const handleEditTeam = async (teamData) => {
    try {
      const response = await fetch(
        `https://cc1fbde45ead-in-south-01.backstract.io/lucid-jang-c1c0cae4eaba11ef8e440242ac12000577/api/teams/${teamData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(teamData),
        }
      );

      if (response.ok) {
        onRefresh();
        setEditingTeam(null);
      }
    } catch (error) {
      console.error("Error updating team:", error);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!confirm("Are you sure you want to delete this team?")) return;

    try {
      const response = await fetch(
        `https://cc1fbde45ead-in-south-01.backstract.io/lucid-jang-c1c0cae4eaba11ef8e440242ac12000577/api/teams/${teamId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map((team) => (
        <div
          key={team.id}
          className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium text-lg">{team.name}</h3>
              <p className="text-sm text-gray-500">{team.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingTeam(team)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDeleteTeam(team.id)}
                className="p-1 hover:bg-gray-100 rounded text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Users size={16} className="mr-2" />
            <span>{team.members?.length || 0} members</span>
          </div>
        </div>
      ))}

      {editingTeam && (
        <TeamModal
          isOpen={true}
          onClose={() => setEditingTeam(null)}
          onSubmit={handleEditTeam}
          initialData={editingTeam}
        />
      )}
    </div>
  );
}

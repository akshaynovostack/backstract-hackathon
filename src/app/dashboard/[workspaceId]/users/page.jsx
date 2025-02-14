"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../components/ui/Button";
import UserList from "../../../../components/users/UserList";
import UserModal from "../../../../components/users/UserModal";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchUsers(), fetchTeams()]);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://cc1fbde45ead-in-south-01.backstract.io/lucid-jang-c1c0cae4eaba11ef8e440242ac12000577/api/users"
      );
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch(
        "https://cc1fbde45ead-in-south-01.backstract.io/lucid-jang-c1c0cae4eaba11ef8e440242ac12000577/api/teams"
      );
      const data = await response.json();
      setTeams(data.teams_all);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const response = await fetch(
        "https://cc1fbde45ead-in-south-01.backstract.io/lucid-jang-c1c0cae4eaba11ef8e440242ac12000577/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        fetchUsers();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add User
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <UserList users={users} teams={teams} onRefresh={fetchUsers} />
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateUser}
        teams={teams}
      />
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { User } from "lucide-react";

export default function UserSelector({ onSelect, selectedUserId, teamId }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch users from your API, optionally filtered by team
    const fetchUsers = async () => {
      try {
        const url = teamId
          ? `https://cc1fbde45ead-in-south-01.backstract.io/lucid-jang-c1c0cae4eaba11ef8e440242ac12000577/api/teams/${teamId}/users`
          : "https://cc1fbde45ead-in-south-01.backstract.io/lucid-jang-c1c0cae4eaba11ef8e440242ac12000577/api/users";
        const response = await fetch(url);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [teamId]);

  return (
    <div className="relative">
      <select
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedUserId}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Assign User</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}

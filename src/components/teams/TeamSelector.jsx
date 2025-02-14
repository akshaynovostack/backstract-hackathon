"use client";
import { useState, useEffect } from "react";
import { Users } from "lucide-react";

export default function TeamSelector({ onSelect, selectedTeamId }) {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch teams from your API
    const fetchTeams = async () => {
      try {
        const response = await fetch(
          "https://cc1fbde45ead-in-south-01.backstract.io/lucid-jang-c1c0cae4eaba11ef8e440242ac12000577/api/teams"
        );
        const data = await response.json();
        setTeams(data.teams_all);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="relative">
      <select
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedTeamId}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Select Team</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  );
}

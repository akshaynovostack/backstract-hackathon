"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../components/ui/Button";
import TeamList from "../../../../components/teams/TeamList";
import TeamModal from "../../../../components/teams/TeamModal";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

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

  const handleCreateTeam = async (teamData) => {
    try {
      const response = await fetch(
        "https://cc1fbde45ead-in-south-01.backstract.io/lucid-jang-c1c0cae4eaba11ef8e440242ac12000577/api/teams",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(teamData),
        }
      );

      if (response.ok) {
        fetchTeams();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teams</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Create Team
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <TeamList teams={teams} onRefresh={fetchTeams} />
      )}

      <TeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTeam}
      />
    </div>
  );
}

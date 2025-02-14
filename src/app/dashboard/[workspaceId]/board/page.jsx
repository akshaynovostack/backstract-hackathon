"use client";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import TaskBoard from "../../../../components/tasks/TaskBoard";
import Button from "../../../../components/ui/Button";
import TaskModal from "../../../../components/tasks/TaskModal";

const BASE_URL =
  "https://cc1fbde45ead-in-south-01.backstract.io/lucid-jang-c1c0cae4eaba11ef8e440242ac12000577/api";

export default function BoardView() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([fetchTasks(), fetchUsers(), fetchTeams()])
      .then(() => setLoading(false))
      .catch((err) => {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      });
  }, []);

  const fetchTasks = async () => {
    const response = await fetch(`${BASE_URL}/tasks/`, {
      headers: {
        accept: "application/json",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch tasks");

    const data = await response.json();
    setTasks(data.tasks_all);
  };

  const fetchUsers = async () => {
    const response = await fetch(`${BASE_URL}/users/`, {
      headers: {
        accept: "application/json",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch users");

    const data = await response.json();
    setUsers(data.users_all);
  };

  const fetchTeams = async () => {
    const response = await fetch(`${BASE_URL}/teams/`, {
      headers: {
        accept: "application/json",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch teams");

    const data = await response.json();
    setTeams(data.teams_all);
  };

  const updateTask = async (taskId, newStatus) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const updatedTask = {
        ...task,
        list_status: newStatus,
      };

      const response = await fetch(`${BASE_URL}/tasks/id/`, {
        method: "PUT",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        },
        body: JSON.stringify({
          id: task.id.toString(),
          title: task.title,
          description: task.description,
          assigned_by: task.assigned_by,
          assigned_to: task.assigned_to,
          priority: task.priority,
          status: task.status.toString(),
          start_date: task.start_date,
          due_date: task.due_date,
          team_id: task.team_id.toString(),
          parent_id: task.parent_id.toString(),
          list_status: newStatus,
          time_estimation: task.time_estimation.toString(),
          created_at: task.created_at,
        }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task status");
      fetchTasks();
    }
  };

  const handleTaskMove = async (taskId, newStatus) => {
    await updateTask(taskId, newStatus);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Board View</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          Add Task
        </Button>
      </div>
      <div className="flex-1 overflow-x-auto">
        <TaskBoard
          tasks={tasks}
          users={users}
          teams={teams}
          onTaskMove={handleTaskMove}
        />
      </div>

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          users={users}
          teams={teams}
          onTaskCreated={() => {
            setIsModalOpen(false);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
}

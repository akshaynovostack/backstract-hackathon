"use client";
import { useState } from "react";
import TeamSelector from "../teams/TeamSelector";
import UserSelector from "../users/UserSelector";

export default function TaskForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    priority: initialData?.priority || "medium",
    status: initialData?.status || "private",
    assigned_to: initialData?.assigned_to || "",
    team_id: initialData?.team_id || "",
    start_date: initialData?.start_date || "",
    due_date: initialData?.due_date || "",
    time_estimation: initialData?.time_estimation || "",
    list_status_id: initialData?.list_status_id || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Team
          </label>
          <TeamSelector
            selectedTeamId={formData.team_id}
            onSelect={(teamId) => setFormData({ ...formData, team_id: teamId })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assign To
          </label>
          <UserSelector
            selectedUserId={formData.assigned_to}
            teamId={formData.team_id}
            onSelect={(userId) =>
              setFormData({ ...formData, assigned_to: userId })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Visibility
          </label>
          <select
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.due_date}
            onChange={(e) =>
              setFormData({ ...formData, due_date: e.target.value })
            }
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Time Estimation (minutes)
        </label>
        <input
          type="number"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          value={formData.time_estimation}
          onChange={(e) =>
            setFormData({ ...formData, time_estimation: e.target.value })
          }
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        {initialData ? "Update Task" : "Create Task"}
      </button>
    </form>
  );
}

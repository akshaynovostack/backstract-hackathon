"use client";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import TaskColumn from "./TaskColumn";
import { useState } from "react";
import TaskModal from "./TaskModal";

export default function TaskBoard({ tasks, users, teams, onTaskMove }) {
  const [selectedTask, setSelectedTask] = useState(null);

  // Get unique list statuses from tasks
  const uniqueStatuses = Array.from(
    new Set(
      tasks.map((task) => task.list_status).filter((status) => status !== null)
    )
  ).sort();

  // Group tasks by status
  const columns = uniqueStatuses.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.list_status === status);
    return acc;
  }, {});

  // Add "Unassigned" column for tasks with null status
  const unassignedTasks = tasks.filter((task) => task.list_status === null);
  if (unassignedTasks.length > 0) {
    columns["Unassigned"] = unassignedTasks;
  }

  const getUserName = (userId) => {
    const user = users.find((u) => u.user_id === userId);
    return user ? user.name : "Unassigned";
  };

  const getTeamName = (teamId) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : "No Team";
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    // Add visual feedback for drag over
    e.currentTarget.classList.add("bg-gray-200");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("bg-gray-200");
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-gray-200");
    const taskId = parseInt(e.dataTransfer.getData("taskId"));

    try {
      await onTaskMove(taskId, status === "Unassigned" ? null : status);
    } catch (error) {
      console.error("Failed to move task:", error);
      // Optionally show error to user
    }
  };

  const handleTaskClick = (task, e) => {
    // Only open modal if not dragging
    if (!e.target.closest("[draggable]").dragging) {
      setSelectedTask(task);
    }
  };

  return (
    <>
      <div className="grid auto-cols-[minmax(300px,1fr)] grid-flow-col gap-4 w-full">
        {Object.entries(columns).map(([status, columnTasks]) => (
          <div
            key={status}
            className="bg-gray-100 p-4 rounded-lg min-w-[300px] transition-colors duration-200"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status)}
          >
            <h2 className="font-semibold mb-4 flex items-center justify-between">
              <span>{status}</span>
              <span className="text-sm text-gray-500">
                {columnTasks.length}
              </span>
            </h2>
            {columnTasks.map((task) => {
              const assignedTo = getUserName(task.assigned_to);
              const assignedBy = getUserName(task.assigned_by);
              const teamName = getTeamName(task.team_id);

              return (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow mb-2 cursor-pointer hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={(e) => {
                    e.currentTarget.dragging = true;
                    e.dataTransfer.setData("taskId", task.id.toString());
                  }}
                  onDragEnd={(e) => {
                    e.currentTarget.dragging = false;
                  }}
                  onClick={(e) => handleTaskClick(task, e)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium flex-1">{task.title}</h3>
                    <div
                      className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-medium flex-shrink-0"
                      title={assignedTo}
                    >
                      {getInitials(assignedTo)}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {task.description}
                  </p>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={`px-2 py-1 rounded ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-gray-500">
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 text-xs text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>Team:</span>
                        <span className="font-medium text-gray-700">
                          {teamName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Assigned by:</span>
                        <span className="font-medium text-gray-700">
                          {assignedBy}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Time est:</span>
                        <span className="font-medium text-gray-700">
                          {task.time_estimation} mins
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          users={users}
          teams={teams}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
}

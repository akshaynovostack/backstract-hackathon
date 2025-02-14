"use client";
import { useState } from "react";
import TaskModal from "./TaskModal";

export default function TaskCard({ task, onUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  return (
    <>
      <div
        className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <h3 className="font-medium mb-2">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-gray-500 mb-3">{task.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
          {task.assignee && (
            <span className="text-xs text-gray-500">{task.assignee}</span>
          )}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={task}
        onUpdate={onUpdate}
      />
    </>
  );
}

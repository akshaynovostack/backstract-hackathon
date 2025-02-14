"use client";
import TaskList from "../../../../components/tasks/TaskList";

export default function ListView() {
  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Add Task
        </button>
      </div>
      <TaskList />
    </div>
  );
}

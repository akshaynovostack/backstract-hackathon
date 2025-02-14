"use client";
import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

export default function WorkspaceNav() {
  const [workspaces] = useState([
    { id: 1, name: "Workspace 1" },
    { id: 2, name: "Workspace 2" },
  ]);

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Workspaces</h2>
          <ChevronDown size={16} />
        </div>
        <button className="p-1 hover:bg-gray-100 rounded">
          <Plus size={16} />
        </button>
      </div>
      <div className="space-y-1">
        {workspaces.map((workspace) => (
          <button
            key={workspace.id}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
          >
            {workspace.name}
          </button>
        ))}
      </div>
    </div>
  );
}

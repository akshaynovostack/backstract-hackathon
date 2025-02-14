"use client";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Plus, Filter, SortAsc } from "lucide-react";
import Button from "../../components/ui/Button";

export default function Dashboard() {
  const [rowData] = useState([
    {
      id: 1,
      title: "Implement Authentication",
      status: "In Progress",
      priority: "High",
      assignee: "John Doe",
      dueDate: "2024-03-01",
      team: "Backend Team",
    },
    // Add more mock data as needed
  ]);

  const [columnDefs] = useState([
    {
      field: "title",
      headerName: "Task",
      flex: 2,
      cellRenderer: (params) => (
        <div className="flex items-center gap-2">
          <input type="checkbox" className="rounded" />
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: "status",
      flex: 1,
      cellRenderer: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
            params.value
          )}`}
        >
          {params.value}
        </span>
      ),
    },
    { field: "priority", flex: 1 },
    { field: "assignee", flex: 1 },
    { field: "team", flex: 1 },
    {
      field: "dueDate",
      flex: 1,
      cellRenderer: (params) => new Date(params.value).toLocaleDateString(),
    },
  ]);

  const getStatusColor = (status) => {
    const colors = {
      "To Do": "bg-gray-100 text-gray-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Done: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">All Tasks</h1>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex items-center gap-2">
              <Filter size={16} />
              Filter
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              <SortAsc size={16} />
              Sort
            </Button>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Add Task
        </Button>
      </div>

      <div className="flex-1 ag-theme-alpine">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          rowSelection="multiple"
          animateRows={true}
          enableCellTextSelection={true}
          suppressRowClickSelection={true}
          suppressMovableColumns={true}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </div>
  );
}

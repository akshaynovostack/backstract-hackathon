import { AgGridReact } from "ag-grid-react";
import { useState, useRef, useMemo } from "react";

export default function TaskList() {
  const gridRef = useRef();
  const [rowData, setRowData] = useState([
    {
      title: "Task 1",
      status: "To Do",
      priority: "High",
      dueDate: "2024-03-20",
      assignee: "John Doe",
    },
    {
      title: "Task 2",
      status: "In Progress",
      priority: "Medium",
      dueDate: "2024-03-21",
      assignee: "Jane Smith",
    },
    // Add more mock data as needed
  ]);

  const [columnDefs] = useState([
    {
      field: "title",
      headerName: "Task",
      sortable: true,
      filter: true,
      rowDrag: true,
    },
    {
      field: "status",
      sortable: true,
      filter: true,
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
    {
      field: "priority",
      sortable: true,
      filter: true,
    },
    {
      field: "dueDate",
      sortable: true,
      filter: true,
    },
    {
      field: "assignee",
      sortable: true,
      filter: true,
    },
  ]);

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 100,
      resizable: true,
    }),
    []
  );

  const getStatusColor = (status) => {
    const colors = {
      "To Do": "bg-gray-100 text-gray-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Done: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  return (
    <div className="h-[600px] w-full ag-theme-alpine">
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        rowDragManaged={true}
        onGridReady={onGridReady}
        enableRangeSelection={true}
        suppressRowClickSelection={true}
        rowSelection="multiple"
      />
    </div>
  );
}

export const tempData = {
  tasks: [
    {
      id: "1",
      title: "Implement Authentication",
      description: "Set up user authentication flow with JWT",
      priority: "high",
      status: "TODO",
      assigned_to: "1",
      time_estimation: 120,
      tags: [
        { id: 1, title: "Frontend" },
        { id: 2, title: "Security" },
      ],
      comments: [
        {
          id: 1,
          comment: "Started working on this",
          comment_by: "John Doe",
          created_at: "2024-03-10T10:00:00",
        },
      ],
    },
    {
      id: "2",
      title: "Design Dashboard Layout",
      description: "Create responsive dashboard layout",
      priority: "medium",
      status: "IN_PROGRESS",
      assigned_to: "2",
      time_estimation: 180,
      tags: [
        { id: 1, title: "Frontend" },
        { id: 3, title: "UI/UX" },
      ],
      comments: [],
    },
    {
      id: "3",
      title: "API Integration",
      description: "Integrate backend APIs with frontend",
      priority: "high",
      status: "REVIEW",
      assigned_to: "3",
      time_estimation: 240,
      tags: [
        { id: 4, title: "Backend" },
        { id: 5, title: "API" },
      ],
      comments: [],
    },
  ],
  users: [
    { id: "1", name: "John Doe", email: "john@example.com", role: "admin" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user" },
    { id: "3", name: "Mike Johnson", email: "mike@example.com", role: "user" },
  ],
  teams: [
    {
      id: "1",
      name: "Frontend Team",
      description: "Frontend development team",
    },
    { id: "2", name: "Backend Team", description: "Backend development team" },
    { id: "3", name: "Design Team", description: "UI/UX design team" },
  ],
  tags: [
    { id: 1, title: "Frontend" },
    { id: 2, title: "Security" },
    { id: 3, title: "UI/UX" },
    { id: 4, title: "Backend" },
    { id: 5, title: "API" },
    { id: 6, title: "Bug" },
    { id: 7, title: "Feature" },
  ],
  list_status: [
    { id: 1, title: "To Do", sort_order: 1 },
    { id: 2, title: "In Progress", sort_order: 2 },
    { id: 3, title: "Review", sort_order: 3 },
    { id: 4, title: "Done", sort_order: 4 },
  ],
  attachments: [
    {
      id: 1,
      task_id: "1",
      file_name: "document.pdf",
      file_size: "2.5MB",
      file_type: "application/pdf",
      uploaded_by: "1",
      uploaded_at: "2024-03-10T10:00:00",
      url: "https://example.com/files/document.pdf",
    },
  ],
};

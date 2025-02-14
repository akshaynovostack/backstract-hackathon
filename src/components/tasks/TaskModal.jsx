"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  MessageSquare,
  Tag,
  Paperclip,
  Clock,
  Plus,
  ChevronDown,
  ChevronRight,
  Upload,
  Download,
  File,
} from "lucide-react";
import Modal from "../ui/Modal";
import { tempData } from "../../lib/tempData";
import SubtaskModal from "./SubtaskModal";
import { toast } from "react-hot-toast";

const TaskModal = ({ isOpen, onClose, task, onUpdate }) => {
  console.log("isOpen", isOpen);
  const [activeTab, setActiveTab] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    assigned_to: "",
    time_estimation: "",
    start_date: "",
    due_date: "",
    list_status_id: "",
    tags: [],
    comments: [],
  });
  const [newComment, setNewComment] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    console.log("Modal isOpen:", isOpen);
    console.log("Task data:", task);
    if (task) {
      setFormData({
        ...task,
        tags: task.tags || [],
        comments: task.comments || [],
        start_date: task.start_date || "",
        due_date: task.due_date || "",
        list_status_id: task.list_status_id || "",
      });
      setSelectedTagIds(task.tags ? task.tags.map((tag) => tag.id) : []);

      // Initialize subtasks from temp data
      const taskSubtasks = tempData.tasks.filter(
        (t) => t.parent_id === task.id
      );
      setSubtasks(taskSubtasks);

      setAttachments(task.attachments || []);
    }
  }, [isOpen, task]);

  useEffect(() => {
    const fetchComments = async () => {
      console.log("Fetching comments for task:", task?.id); // Debug log

      if (!task?.id) {
        console.log("No task ID available, skipping fetch"); // Debug log
        return;
      }

      try {
        console.log("Making API request..."); // Debug log
        const response = await fetch(
          "https://cc1fbde45ead-in-south-01.backstract.io/lucid-jang-c1c0cae4eaba11ef8e440242ac12000577/api/task_comments/",
          {
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received comments data:", data); // Debug log

        const taskComments = data.task_comments_all.filter(
          (comment) => comment.task_id === task.id
        );
        console.log("Filtered comments for this task:", taskComments); // Debug log

        setComments(taskComments);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, task?.id]);

  useEffect(() => {
    const fetchAttachments = async () => {
      console.log("Fetching attachments for task:", task?.id); // Debug log

      if (!task?.id) {
        console.log("No task ID available, skipping fetch"); // Debug log
        return;
      }

      try {
        console.log("Making attachments API request..."); // Debug log
        const response = await fetch(
          "https://cc1fbde45ead-in-south-01.backstract.io/lucid-jang-c1c0cae4eaba11ef8e440242ac12000577/api/task_attachments/",
          {
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received attachments data:", data); // Debug log

        const taskAttachments = data.task_attachments_all.filter(
          (attachment) => attachment.task_id === task.id
        );
        console.log("Filtered attachments for this task:", taskAttachments); // Debug log

        setAttachments(taskAttachments);
      } catch (error) {
        console.error("Failed to fetch attachments:", error);
      }
    };

    if (isOpen) {
      fetchAttachments();
    }
  }, [isOpen, task?.id]);

  // Memoize filtered tags
  const availableTags = useMemo(() => {
    return tempData.tags.filter((tag) => !selectedTagIds.includes(tag.id));
  }, [selectedTagIds]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.assigned_to) newErrors.assigned_to = "Assignee is required";
    if (!formData.list_status_id)
      newErrors.list_status_id = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Updated submit handler with validation and error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await onUpdate(formData);
      toast.success("Task updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Error updating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagSelect = (e) => {
    const tagId = Number(e.target.value);
    if (!tagId) return;

    if (!selectedTagIds.includes(tagId)) {
      const newTag = tempData.tags.find((t) => t.id === tagId);
      setSelectedTagIds([...selectedTagIds, tagId]);
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
    }
  };

  const handleRemoveTag = (tagId) => {
    setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag.id !== tagId),
    }));
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: Date.now(),
      task_id: task.id,
      comment: newComment,
      comment_by: tempData.users[0].id, // You might want to get the actual user ID
      created_at: new Date().toISOString(),
    };

    try {
      // You'll need to implement the POST request to add the comment
      // const response = await fetch('your-api-endpoint', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newCommentObj),
      // });

      setComments((prevComments) => [...prevComments, newCommentObj]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;

    const newSubtaskObj = {
      id: Date.now(),
      title: newSubtask,
      description: "",
      priority: "medium",
      status: formData.status,
      parent_id: task.id,
      assigned_to: formData.assigned_to,
      list_status_id: formData.list_status_id,
    };

    setSubtasks([...subtasks, newSubtaskObj]);
    setNewSubtask("");
  };

  const handleSubtaskStatusChange = (subtaskId, newStatus) => {
    setSubtasks(
      subtasks.map((st) =>
        st.id === subtaskId ? { ...st, list_status_id: newStatus } : st
      )
    );
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);

    // Here you would typically upload the files to your server
    // and get back the URLs. For now, we'll create temporary objects
    const newAttachments = files.map((file) => ({
      id: Date.now() + Math.random(),
      task_id: task.id,
      url: URL.createObjectURL(file), // Temporary URL
      created_by: tempData.users[0].id, // You might want to get the actual user ID
      created_at: new Date().toISOString(),
    }));

    setAttachments([...attachments, ...newAttachments]);
  };

  const handleRemoveAttachment = async (attachmentId) => {
    try {
      // Here you would typically make an API call to delete the attachment
      // await fetch(`your-api-endpoint/${attachmentId}`, { method: 'DELETE' });

      setAttachments(attachments.filter((att) => att.id !== attachmentId));
    } catch (error) {
      console.error("Failed to remove attachment:", error);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes("image")) return "🖼️";
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("word")) return "📝";
    if (fileType.includes("sheet")) return "📊";
    return "📎";
  };

  const renderTagsSection = () => (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Tags</h3>
      <div className="flex flex-col gap-4">
        {/* Selected Tags Display */}
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
            >
              <span className="text-sm">{tag.title}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Tag Selection */}
        <div className="flex gap-2">
          <select
            className="flex-1 rounded-md border border-gray-300 px-3 py-2"
            value=""
            onChange={handleTagSelect}
          >
            <option value="">Add a tag...</option>
            {availableTags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderCommentsSection = () => (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Comments</h3>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-blue-600">
                {comment.comment_by}
              </span>
              <span className="text-gray-500">
                {new Date(comment.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="mt-2 text-gray-700">{comment.comment}</p>
          </div>
        ))}

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddComment}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={!newComment.trim()}
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );

  const renderSubtasksSection = () => (
    <div className="mt-6 border rounded-lg p-4">
      <div
        className="flex items-center justify-between cursor-pointer mb-4"
        onClick={() => setShowSubtasks(!showSubtasks)}
      >
        <h3 className="text-lg font-medium flex items-center gap-2">
          {showSubtasks ? (
            <ChevronDown size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
          Subtasks
        </h3>
      </div>

      {showSubtasks && (
        <div className="space-y-4">
          {/* Add new subtask input */}
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Add a subtask..."
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              disabled={!newSubtask.trim()}
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Updated subtasks list */}
          <div className="space-y-2">
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedSubtask(subtask)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <select
                    className="border-none bg-transparent"
                    value={subtask.list_status_id}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSubtaskStatusChange(subtask.id, e.target.value);
                    }}
                  >
                    {tempData.list_status.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.title}
                      </option>
                    ))}
                  </select>
                  <span className="flex-1">{subtask.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSubtasks(
                        subtasks.filter((st) => st.id !== subtask.id)
                      );
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add SubtaskModal */}
      {selectedSubtask && (
        <SubtaskModal
          isOpen={!!selectedSubtask}
          onClose={() => setSelectedSubtask(null)}
          subtask={selectedSubtask}
          parentTask={task}
          onUpdate={(updatedSubtask) => {
            setSubtasks(
              subtasks.map((st) =>
                st.id === updatedSubtask.id ? updatedSubtask : st
              )
            );
            setSelectedSubtask(null);
          }}
        />
      )}
    </div>
  );

  const renderAttachmentsSection = () => (
    <div className="mt-6 border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
        <Paperclip size={20} />
        Attachments
      </h3>

      {/* File Input */}
      <div className="mb-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors"
        >
          <Upload className="mx-auto mb-2" size={24} />
          <span className="text-gray-600">
            Drop files here or click to upload
          </span>
        </button>
      </div>

      {/* Attachments List */}
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <File size={20} className="text-gray-500" />
              <div>
                <p className="font-medium">
                  {attachment.url.split("/").pop()}{" "}
                  {/* Extract filename from URL */}
                </p>
                <p className="text-sm text-gray-500">
                  Added on{" "}
                  {new Date(attachment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-gray-200 rounded"
                title="Download"
              >
                <Download size={16} />
              </a>
              <button
                type="button"
                onClick={() => handleRemoveAttachment(attachment.id)}
                className="p-1 hover:bg-gray-200 rounded text-red-500"
                title="Remove"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Tab navigation
  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <div className="space-y-4">
            <input
              type="text"
              className={`w-full text-xl font-semibold px-2 py-1 border-2 rounded focus:outline-none ${
                errors.title
                  ? "border-red-500"
                  : "border-transparent hover:border-gray-200 focus:border-blue-500"
              }`}
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                setErrors({ ...errors, title: null });
              }}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}

            <textarea
              className="w-full px-2 py-1 border-2 border-transparent hover:border-gray-200 rounded focus:border-blue-500 focus:outline-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              placeholder="Add description..."
            />

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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assignee
                </label>
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  value={formData.assigned_to}
                  onChange={(e) =>
                    setFormData({ ...formData, assigned_to: e.target.value })
                  }
                >
                  <option value="">Select Assignee</option>
                  {tempData.users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  value={formData.list_status_id}
                  onChange={(e) =>
                    setFormData({ ...formData, list_status_id: e.target.value })
                  }
                >
                  <option value="">Select Status</option>
                  {tempData.list_status.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
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

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Time Estimation (minutes)
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  value={formData.time_estimation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      time_estimation: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {renderTagsSection()}
          </div>
        );
      case "subtasks":
        return renderSubtasksSection();
      case "comments":
        return renderCommentsSection();
      case "attachments":
        return renderAttachmentsSection();
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      {console.log("Rendering modal, isOpen:", isOpen)}
      <div className="flex flex-col h-[80vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex gap-4">
            {["details", "subtasks", "comments", "attachments"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded ${
                  activeTab === tab
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderTabContent()}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Task"}
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;

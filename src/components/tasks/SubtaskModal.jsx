"use client";
import { useState, useEffect, useRef } from "react";
import {
  X,
  MessageSquare,
  Tag,
  Paperclip,
  Clock,
  Upload,
  Download,
  File,
} from "lucide-react";
import Modal from "../ui/Modal";
import { tempData } from "../../lib/tempData";

export default function SubtaskModal({
  isOpen,
  onClose,
  subtask,
  parentTask,
  onUpdate,
}) {
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
    parent_id: parentTask?.id,
    tags: [],
    comments: [],
  });

  const [activeTab, setActiveTab] = useState("details");
  const [newComment, setNewComment] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (subtask) {
      setFormData({
        ...subtask,
        tags: subtask.tags || [],
        comments: subtask.comments || [],
        start_date: subtask.start_date || "",
        due_date: subtask.due_date || "",
        list_status_id:
          subtask.list_status_id || parentTask?.list_status_id || "",
        parent_id: parentTask?.id,
      });
      setSelectedTagIds(subtask.tags ? subtask.tags.map((tag) => tag.id) : []);
      setAttachments(subtask.attachments || []);
    }
  }, [subtask, parentTask]);

  useEffect(() => {
    const fetchComments = async () => {
      console.log("Fetching comments for subtask:", subtask?.id);

      if (!subtask?.id) {
        console.log("No subtask ID available, skipping fetch");
        return;
      }

      try {
        console.log("Making API request...");
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
        console.log("Received comments data:", data);

        const taskComments = data.task_comments_all.filter(
          (comment) => comment.task_id === subtask.id
        );
        console.log("Filtered comments for this task:", taskComments);

        setComments(taskComments);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    fetchComments();
  }, [subtask?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onUpdate(formData);
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

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: Date.now(),
      task_id: subtask.id,
      comment: newComment,
      comment_by: tempData.users[0].id,
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

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    const newAttachments = files.map((file) => ({
      id: Date.now() + Math.random(),
      task_id: subtask.id,
      file_name: file.name,
      file_size: formatFileSize(file.size),
      file_type: file.type,
      uploaded_by: tempData.users[0].id,
      uploaded_at: new Date().toISOString(),
      file: file,
      url: URL.createObjectURL(file),
    }));

    setAttachments([...attachments, ...newAttachments]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleRemoveAttachment = (attachmentId) => {
    setAttachments(attachments.filter((att) => att.id !== attachmentId));
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes("image")) return "🖼️";
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("word")) return "📝";
    if (fileType.includes("sheet")) return "📊";
    return "📎";
  };

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
              <span className="text-xl">
                {getFileIcon(attachment.file_type)}
              </span>
              <div>
                <p className="font-medium">{attachment.file_name}</p>
                <p className="text-sm text-gray-500">
                  {attachment.file_size} •{" "}
                  {new Date(attachment.uploaded_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.open(attachment.url, "_blank")}
                className="p-1 hover:bg-gray-200 rounded"
                title="Download"
              >
                <Download size={16} />
              </button>
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              className="w-full text-xl font-semibold px-2 py-1 border-2 border-transparent hover:border-gray-200 rounded focus:border-blue-500 focus:outline-none"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Subtask title"
            />

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
                  {tempData.tasks.map((user) => (
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

            {/* Tags Section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                  >
                    <span className="text-sm">{tag.title}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTagIds(
                          selectedTagIds.filter((id) => id !== tag.id)
                        );
                        setFormData((prev) => ({
                          ...prev,
                          tags: prev.tags.filter((t) => t.id !== tag.id),
                        }));
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                value=""
                onChange={handleTagSelect}
              >
                <option value="">Add a tag...</option>
                {tempData.tags
                  .filter((tag) => !selectedTagIds.includes(tag.id))
                  .map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.title}
                    </option>
                  ))}
              </select>
            </div>

            {/* Add Attachments Section before comments */}
            {renderAttachmentsSection()}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              {subtask ? "Update Subtask" : "Create Subtask"}
            </button>
          </form>
        );
      case "comments":
        return renderCommentsSection();
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="flex flex-col h-[80vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex gap-4">
            {["details", "comments"].map((tab) => (
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

        <div className="flex-1 overflow-y-auto p-4">{renderTabContent()}</div>
      </div>
    </Modal>
  );
}

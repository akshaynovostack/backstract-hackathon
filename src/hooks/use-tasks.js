import { useState, useCallback } from "react";
import api from "../lib/axios";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (workspaceId) => {
    try {
      setLoading(true);
      const response = await api.get(`/tasks?workspaceId=${workspaceId}`);
      setTasks(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTaskOrder = useCallback(async (taskId, newIndex) => {
    try {
      await api.patch(`/tasks/${taskId}/reorder`, { newIndex });
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    updateTaskOrder,
  };
}

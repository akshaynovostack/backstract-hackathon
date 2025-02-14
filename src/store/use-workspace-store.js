import { create } from "zustand";

const useWorkspaceStore = create((set) => ({
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  error: null,

  setWorkspaces: (workspaces) => set({ workspaces }),
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),

  fetchWorkspaces: async () => {
    set({ loading: true });
    try {
      // Add your API call here
      const response = await fetch("/api/workspaces");
      const data = await response.json();
      set({ workspaces: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createWorkspace: async (workspaceData) => {
    set({ loading: true });
    try {
      // Add your API call here
      const response = await fetch("/api/workspaces", {
        method: "POST",
        body: JSON.stringify(workspaceData),
      });
      const newWorkspace = await response.json();
      set((state) => ({
        workspaces: [...state.workspaces, newWorkspace],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useWorkspaceStore;

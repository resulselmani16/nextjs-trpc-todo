import { ITask } from "@/types/task/types";
import { create } from "zustand";
import { subscribeToTaskUpdates } from "@/lib/firebase/realtime";

interface TaskStore {
  tasks: ITask[];
  mutationsInitialized: boolean;
  addTask: (
    title: string,
    description: string,
    assignedTo?: string
  ) => Promise<void>;
  updateTask: (id: string, updates: Partial<ITask>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setTasks: (tasks: ITask[]) => void;
  initializeMutations: () => void;
  fetchTasks: (tasks: ITask[]) => void;
  subscribeToTask: (taskId: string) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  mutationsInitialized: false,
  addTask: async (title: string, description: string, assignedTo?: string) => {
    try {
      // The actual mutation will be handled by the component
      console.log("Adding task:", { title, description, assignedTo });
    } catch (error) {
      throw error;
    }
  },
  updateTask: async (id: string, updates: Partial<ITask>) => {
    try {
      // The actual mutation will be handled by the component
      console.log("Updating task:", { id, updates });
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        ),
      }));
    } catch (error) {
      throw error;
    }
  },
  deleteTask: async (id: string) => {
    try {
      // The actual mutation will be handled by the component
      console.log("Deleting task:", { id });
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },
  setTasks: (tasks: ITask[]) => set({ tasks }),
  initializeMutations: () => {
    set({ mutationsInitialized: true });
  },
  fetchTasks: (tasks: ITask[]) => {
    set({ tasks });
  },
  subscribeToTask: (taskId: string) => {
    subscribeToTaskUpdates(taskId, (data) => {
      if (data) {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...data,
                  createdAt: data.createdAt
                    ? new Date(data.createdAt)
                    : task.createdAt,
                  updatedAt: data.updatedAt
                    ? new Date(data.updatedAt)
                    : task.updatedAt,
                }
              : task
          ),
        }));
      }
    });
  },
}));

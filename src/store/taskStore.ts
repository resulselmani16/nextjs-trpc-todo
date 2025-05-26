import { ITask } from "@/types/task/types";
import { create } from "zustand";
import { subscribeToTaskUpdates } from "@/lib/firebase/realtime";
import { v4 as uuidv4 } from "uuid";

interface TaskStore {
  tasks: ITask[];
  mutationsInitialized: boolean;
  addTask: (
    title: string,
    description: string,
    assignedTo: string
  ) => Promise<void>;
  updateTask: (id: string, updates: Partial<ITask>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setTasks: (tasks: ITask[]) => void;
  initializeMutations: () => void;
  fetchTasks: (tasks: ITask[]) => void;
  subscribeToTask: (taskId: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  mutationsInitialized: false,
  addTask: async (title: string, description: string, assignedTo: string) => {
    const newTask: ITask = {
      id: uuidv4(),
      title,
      description,
      status: "PROGRESS",
      userId: assignedTo,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },
  updateTask: async (id: string, updates: Partial<ITask>) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      ),
    }));
  },
  deleteTask: async (id: string) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
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

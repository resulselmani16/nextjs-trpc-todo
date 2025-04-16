import { ITask } from "@/types/task/types";
import { trpc } from "@/utils/trpc";
import { create } from "zustand";

type TaskStore = {
  tasks: ITask[];
  fetchTasks: () => Promise<void>;
  addTask: (title: string, description: string) => Promise<void>;
  toggleTask: (id: string, completed: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  initializeMutations: (client: ReturnType<typeof trpc.useUtils>) => void;
  mutationsInitialized: boolean;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  mutationsInitialized: false,
  fetchTasks: async () => {},
  addTask: async () => {
    console.error("Mutation function not initialized yet!");
  },
  toggleTask: async () => {
    console.error("Mutation function not initialized yet!");
  },
  deleteTask: async () => {
    console.error("Mutation function not initialized yet!");
  },
  initializeMutations: (client) => {
    set({
      addTask: async (title, description) => {
        const newTask = await client.client.create.mutate({
          title: title,
          description: description,
        });
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },
      toggleTask: async (id, completed) => {
        await client.client.update.mutate({
          id: id,
          completed: completed,
        });
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed } : task
          ),
        }));
      },
      deleteTask: async (id) => {
        await client.client.delete.mutate(id);
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      fetchTasks: async () => {
        const fetchedTasks = await client.client.getAll.query();
        set({ tasks: fetchedTasks });
      },
      mutationsInitialized: true,
    });
  },
}));

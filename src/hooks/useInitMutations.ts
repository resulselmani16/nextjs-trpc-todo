import { useTaskStore } from "@/store/taskStore";
import { trpc } from "@/utils/trpc";
import { useEffect } from "react";
import { ITask } from "@/types/task/types";

export function useInitMutations() {
  const trpcClient = trpc.useUtils();
  const initializeMutations = useTaskStore(
    (state) => state.initializeMutations
  );
  const mutationsInitialized = useTaskStore(
    (state) => state.mutationsInitialized
  );
  const setTasks = useTaskStore((state) => state.setTasks);

  const { data: apiTasks, refetch: refetchTasks } = trpc.task.getAll.useQuery(
    undefined,
    {
      enabled: mutationsInitialized,
    }
  );

  useEffect(() => {
    if (!mutationsInitialized) {
      initializeMutations(trpcClient);
    }
  }, [mutationsInitialized, initializeMutations, trpcClient]);

  useEffect(() => {
    if (mutationsInitialized && apiTasks) {
      const tasks: ITask[] = apiTasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || undefined,
        status: task.status,
        createdAt: task.createdAt ? new Date(task.createdAt) : undefined,
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
        assignedTo: task.userId,
      }));

      setTasks(tasks);
    }
  }, [mutationsInitialized, apiTasks, setTasks]);
}

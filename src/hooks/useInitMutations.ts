import { useTaskStore } from "@/store/taskStore";
import { trpc } from "@/utils/trpc";
import { useEffect } from "react";
import { ITask } from "@/types/task/types";
import { useAuthContext } from "@/context/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

export function useInitMutations() {
  const trpcClient = trpc.useContext();
  const { user } = useAuthContext();
  const { isAdmin } = useUserRole();
  const initializeMutations = useTaskStore(
    (state) => state.initializeMutations
  );
  const mutationsInitialized = useTaskStore(
    (state) => state.mutationsInitialized
  );
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  const { data: apiTasks, refetch: refetchTasks } = trpc.task.getAll.useQuery(
    undefined,
    {
      enabled: mutationsInitialized && isAdmin,
    }
  );

  const { data: userTasks } = trpc.task.getById.useQuery(user?.uid || "", {
    enabled: mutationsInitialized && !isAdmin && !!user?.uid,
  });

  useEffect(() => {
    if (!mutationsInitialized) {
      initializeMutations();
    }
  }, [mutationsInitialized, initializeMutations]);

  useEffect(() => {
    if (mutationsInitialized && user) {
      const tasks =
        (isAdmin ? apiTasks : userTasks)?.map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          assignedTo: task.assignedTo
            ? {
                ...task.assignedTo,
                createdAt: new Date(task.assignedTo.createdAt),
                updatedAt: new Date(task.assignedTo.updatedAt),
              }
            : undefined,
        })) || [];
      fetchTasks(tasks);
    }
  }, [mutationsInitialized, apiTasks, userTasks, fetchTasks, user, isAdmin]);
}

import { useTaskStore } from "@/store/taskStore";
import { trpc } from "@/utils/trpc";
import { useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

export function useInitMutations() {
  const { user } = useAuthContext();
  const { isAdmin } = useUserRole();
  const initializeMutations = useTaskStore(
    (state) => state.initializeMutations
  );
  const mutationsInitialized = useTaskStore(
    (state) => state.mutationsInitialized
  );
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  const { data: apiTasks } = trpc.task.getAll.useQuery(undefined, {
    enabled: mutationsInitialized && isAdmin,
  });

  const { data: userTasks } = trpc.task.getByUserId.useQuery(user?.uid || "", {
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
          assignedTo:
            typeof task.assignedTo === "object" && task.assignedTo !== null
              ? task.assignedTo.id
              : task.assignedTo || "",
        })) || [];
      fetchTasks(tasks);
    }
  }, [mutationsInitialized, apiTasks, userTasks, fetchTasks, user, isAdmin]);
}

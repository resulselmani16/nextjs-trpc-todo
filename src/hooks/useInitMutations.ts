import { useEffect } from "react";
import { useTaskStore } from "@/store/taskStore";
import { trpc } from "@/utils/trpc";

export function useInitMutations() {
  const trpcClient = trpc.useUtils();
  const initializeMutations = useTaskStore(
    (state) => state.initializeMutations
  );
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const mutationsInitialized = useTaskStore(
    (state) => state.mutationsInitialized
  );

  useEffect(() => {
    if (!mutationsInitialized) {
      initializeMutations(trpcClient);
    }
  }, [mutationsInitialized, initializeMutations, trpcClient]);

  useEffect(() => {
    if (mutationsInitialized) {
      fetchTasks();
    }
  }, [mutationsInitialized, fetchTasks]);
}

import { useInitMutations } from "@/hooks/useInitMutations";
import { useUserRole } from "@/hooks/useUserRole";
import { useTaskStore } from "@/store/taskStore";
import { ITask, User } from "@/types/task/types";
import { taskValidationSchema } from "@/types/task/validation";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import TaskFormTpl from "./index.tpl";

const TaskForm = () => {
  useInitMutations();
  const { isAdmin } = useUserRole();
  const { data: users, isLoading: usersLoading } = trpc.user.getAll.useQuery();
  const { mutate: createTask } = trpc.task.create.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ITask>({
    resolver: zodResolver(taskValidationSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const { addTask } = useTaskStore();
  const router = useRouter();

  const onSubmit = async (data: ITask) => {
    setIsLoading(true);
    setError(undefined);

    try {
      createTask({
        title: data.title,
        description: data.description || "",
        assignedTo: data.assignedTo || "",
      });
      await addTask(data.title, data.description || "", data.assignedTo);
      toast.success("Task added successfully!");
      router.push("/");
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TaskFormTpl
      handleSubmit={handleSubmit(onSubmit)}
      register={register}
      errors={errors}
      isLoading={isLoading}
      error={error}
      users={users as User[]}
      isAdmin={isAdmin}
    />
  );
};

export default TaskForm;

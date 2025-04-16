import { useInitMutations } from "@/hooks/useInitMutations";
import { useTaskStore } from "@/store/taskStore";
import { ITask } from "@/types/task/types";
import { taskValidationSchema } from "@/types/task/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import TaskFormTpl from "./index.tpl";
import { useRouter } from "next/router";

const TaskForm = () => {
  useInitMutations();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ITask>({
    resolver: zodResolver(taskValidationSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addTask } = useTaskStore();
  const router = useRouter();
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    addTask(data.title, data.description)
      .then(() => {
        router.push("/");
        toast.success("Task added successfully!");
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <>
      <TaskFormTpl
        handleSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isLoading={isLoading}
      />
      <ToastContainer />
    </>
  );
};

export default TaskForm;

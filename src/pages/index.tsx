import Button from "@/components/Button";
import Modal from "@/components/Modal";
import TaskCard from "@/components/TaskCard";
import { useInitMutations } from "@/hooks/useInitMutations";
import { useTaskStore } from "@/store/taskStore";
import { ITask } from "@/types/task/types";
import Link from "next/link";
import { useState } from "react";
import { LuCirclePlus } from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";

export default function Home() {
  useInitMutations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<ITask>();
  const { tasks, addTask, toggleTask, deleteTask } = useTaskStore();
  const handleDeleteTask = (id: string) => {
    deleteTask(id)
      .then(() => {
        toast.success("Task deleted successfully");
        setIsModalOpen(false);
        setTaskToDelete(undefined);
      })
      .catch((err) => {
        toast.error(err);
      });
  };
  const handleDelete = (task: ITask) => {
    setTaskToDelete(task);
    setIsModalOpen(true);
  };

  const handleToggleTask = (task: ITask) => {
    toggleTask(task.id, !task.completed)
      .then(() => {
        toast.success(
          `${task.title} ${
            task.completed ? "unchecked" : "checked"
          } successfully!`
        );
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <div className="grid justify-items-start items-start p-8 pb-20 gap-6 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl">Welcome to Task Manager</h1>
      <p className="text-lg">
        Below you can find your tasks listed and you can manage them
      </p>
      <Link
        className="ml-auto flex gap-2 transition-transform duration-100 hover:scale-110"
        href={"/task/add"}
      >
        <LuCirclePlus className="h-5 w-5" />
        Add task
      </Link>
      {tasks.map((task) => {
        return (
          <TaskCard
            title={task.title}
            description={task.description || ""}
            completed={task.completed}
            onCheckClick={() => handleToggleTask(task)}
            onDeleteClick={() => handleDelete(task)}
          />
        );
      })}
      {isModalOpen && taskToDelete && (
        <Modal
          className="rounded-md !flex-col justify-evenly gap-4 p-8"
          onClose={() => setIsModalOpen(false)}
        >
          <div className="w-full flex flex-col items-start justify-center gap-5 text-red-400 font-bold text-2xl">
            <h4>Delete {taskToDelete?.title} task?</h4>
          </div>
          <div className="bg-gray-400 w-full h-[1px]" />
          <p className="text-lg text-gray-700">
            This action is cannot be reversed once you confirm it
          </p>
          <hr className="bg-gray-400 w-full h-[1px]" />
          <div className="flex w-full justify-end items-center gap-4">
            <Button
              onClick={() => setIsModalOpen(false)}
              text={"Cancel"}
              variant="cancel"
            />
            <Button
              onClick={() => handleDeleteTask(taskToDelete.id)}
              text={"Confirm"}
              variant="confirm"
            />
          </div>
        </Modal>
      )}
      <ToastContainer />
    </div>
  );
}

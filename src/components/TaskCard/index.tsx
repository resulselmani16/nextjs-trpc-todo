import React, { useEffect } from "react";
import {
  MdOutlineCheckBoxOutlineBlank,
  MdDeleteOutline,
  MdTimelapse,
} from "react-icons/md";
import { IoMdCheckboxOutline } from "react-icons/io";
import Button from "../Button";
import {
  trackTaskPresence,
  subscribeToTaskUpdates,
  updateTaskInRealtime,
} from "@/lib/firebase/realtime";
import TaskViewers from "../TaskViewers";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  onCheckClick: () => void;
  onDeleteClick: () => void;
  showDelete?: boolean;
  assignedTo?: {
    id: string;
    name: string | null;
    email: string;
    role: "ADMIN" | "USER";
    createdAt: Date;
    updatedAt: Date;
  };
}

const TaskCard = ({
  id,
  title,
  description,
  completed,
  onCheckClick,
  onDeleteClick,
  showDelete = false,
  assignedTo,
}: TaskCardProps) => {
  useEffect(() => {
    trackTaskPresence(id);

    const unsubscribe = subscribeToTaskUpdates(id, (data) => {
      if (data) {
        // Handle real-time updates silently
      }
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  const handleCheckClick = async () => {
    await updateTaskInRealtime(id, {
      status: completed ? "PROGRESS" : "COMPLETED",
    });
    onCheckClick();
  };

  return (
    <div className="flex flex-col bg-[#ffffff07] text-gray-500 dark:text-white rounded-md p-10 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-xl">{title}</h2>
          <p className="italic">{description}</p>
          {assignedTo && (
            <p className="text-sm text-gray-400 mt-1">
              Assigned to: {assignedTo.name} - {assignedTo.email}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleCheckClick}
            variant="primary"
            text={completed ? "Completed" : "In Progress"}
            icon={
              completed ? (
                <IoMdCheckboxOutline className="h-6 w-6" />
              ) : (
                <MdTimelapse className="h-6 w-6" />
              )
            }
          />
          {showDelete && (
            <Button
              onClick={onDeleteClick}
              icon={<MdDeleteOutline className="h-6 w-6" />}
              variant="danger"
              text="Delete"
            />
          )}
        </div>
      </div>
      <div className="mt-2">
        <TaskViewers taskId={id} />
      </div>
    </div>
  );
};

export default TaskCard;

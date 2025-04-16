import React from "react";
import { MdOutlineCheckBoxOutlineBlank, MdDeleteOutline } from "react-icons/md";
import { IoMdCheckboxOutline } from "react-icons/io";
import Button from "../Button";

interface TaskCardProps {
  title: string;
  description: string;
  completed: boolean;
  onCheckClick: () => void;
  onDeleteClick: () => void;
}
const TaskCard = ({
  title,
  description,
  completed,
  onCheckClick,
  onDeleteClick,
}: TaskCardProps) => {
  return (
    <div className="flex items-center justify-between bg-[#ffffff07] rounded-md p-10 w-full">
      <div>
        <h2 className="font-bold text-xl">{title}</h2>
        <p className="italic">{description}</p>
      </div>
      <div className="flex items-center">
        <Button
          className="h-6"
          onClick={onCheckClick}
          variant="iconButton"
          icon={
            completed ? (
              <IoMdCheckboxOutline className="h-6 w-6" />
            ) : (
              <MdOutlineCheckBoxOutlineBlank className="h-6 w-6" />
            )
          }
        />
        <Button
          onClick={onDeleteClick}
          icon={<MdDeleteOutline className="h-6 w-6" />}
          variant="iconButton"
        />
      </div>
    </div>
  );
};

export default TaskCard;

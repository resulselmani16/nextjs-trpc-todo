import { ITask } from "@/types/task/types";
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import Input from "../Input";
import Button from "../Button";

interface TaskFormProps {
  handleSubmit: (e?: React.BaseSyntheticEvent) => void;
  register?: UseFormRegister<any>;
  errors: FieldErrors;
  isLoading: boolean;
  error?: string;
  data?: ITask;
}
const TaskFormTpl = ({
  handleSubmit,
  register,
  errors,
  isLoading,
  data,
  error,
}: TaskFormProps) => {
  return (
    <form className="w-2/3 mx-auto" onSubmit={handleSubmit}>
      {error && (
        <div className="flex items-center justify-center bg-red-50 border-red-200">
          <span className="text-red-600">{error}</span>
        </div>
      )}
      <h3 className="text-2xl mb-4">Add a new task</h3>
      <div className="flex flex-col gap-4 items-start justify-around w-full">
        <Input
          placeholder="Title"
          register={register}
          error={errors.title}
          name={"title"}
          className="w-full"
          value={data?.title}
        />
        <Input
          placeholder="Description"
          type="textarea"
          register={register}
          error={errors.description}
          className="w-full"
          name={"description"}
          value={data?.description ?? ""}
        />
        <Button
          variant="secondary"
          type="submit"
          text={isLoading ? "Submitting..." : "Submit"}
        />
      </div>
    </form>
  );
};

export default TaskFormTpl;

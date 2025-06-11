import { ITask } from "@/types/task/types";
import React from "react";
import { FieldError, FieldErrors, UseFormRegister } from "react-hook-form";
import Input from "../Input";
import Button from "../Button";
import { User } from "@/types/task/types";

interface TaskFormProps {
  handleSubmit: (e?: React.BaseSyntheticEvent) => void;
  register?: UseFormRegister<ITask>;
  errors: FieldErrors;
  isLoading: boolean;
  error?: string;
  data?: ITask;
  users?: User[];
  isAdmin?: boolean;
  isValid: boolean;
}

const TaskFormTpl = ({
  handleSubmit,
  register,
  errors,
  isLoading,
  data,
  error,
  users,
  isAdmin,
  isValid,
}: TaskFormProps) => {
  return (
    <div className="max-w-1/2 w-full md:w-1/2 mx-auto px-4 py-8">
      <form
        className="space-y-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6"
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800">
            <span className="text-red-600 dark:text-red-400">{error}</span>
          </div>
        )}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Add a new task
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Title
              </label>
              <Input
                id="title"
                placeholder="Task title"
                register={register}
                error={errors.title as FieldError}
                name="title"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
                focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={data?.title}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.title.message as string}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <Input
                id="description"
                placeholder="Task description"
                type="textarea"
                register={register}
                error={errors.description as FieldError}
                name="description"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
                focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[100px]"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description.message as string}
                </p>
              )}
            </div>

            {isAdmin && users && (
              <div>
                <label
                  htmlFor="assignedTo"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Assign to
                </label>
                <select
                  id="assignedTo"
                  {...register?.("assignedTo")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                  focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email}
                    </option>
                  ))}
                </select>
                {errors.assignedTo && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.assignedTo.message as string}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading || !isValid}
            className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
            bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:!bg-white disabled:!text-primary-400"
          >
            {isLoading ? "Adding..." : "Add Task"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskFormTpl;

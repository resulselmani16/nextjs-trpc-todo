import TaskForm from "@/components/TaskForm";
import { AdminRoute } from "@/components/AdminRoute";
import React from "react";

const AddTask = () => {
  return (
    <AdminRoute>
      <div className="flex items-center py-16">
        <TaskForm />
      </div>
    </AdminRoute>
  );
};

export default AddTask;

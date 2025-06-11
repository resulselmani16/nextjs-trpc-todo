import React, { useEffect, useState } from "react";
import { getTaskViewers } from "@/lib/firebase/realtime";
import { User } from "@/types/task/types";

interface TaskViewersProps {
  taskId: string;
}

const TaskViewers: React.FC<TaskViewersProps> = ({ taskId }) => {
  const [viewers, setViewers] = useState<User[]>([]);

  useEffect(() => {
    const unsubscribe = getTaskViewers(taskId, (viewers) => {
      setViewers(viewers as User[]);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [taskId]);

  if (viewers.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
      <span className="flex items-center">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
        {viewers.length} {viewers.length === 1 ? "person" : "people"} viewing
      </span>
      <div className="flex -space-x-2">
        {viewers.map((viewer) => (
          <div
            key={viewer.id}
            className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs"
            title={viewer.email}
          >
            {viewer.email?.charAt(0).toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskViewers;

import { AuthRoute } from "@/components/AuthRoute";
import TaskCard from "@/components/TaskCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthContext } from "@/context/AuthContext";
import { useInitMutations } from "@/hooks/useInitMutations";
import { useUserRole } from "@/hooks/useUserRole";
import { useTaskStore } from "@/store/taskStore";
import { ITask } from "@/types/task/types";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, logout } = useAuthContext();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [isLoading, setIsLoading] = useState(true);
  useInitMutations();

  const tasks = useTaskStore((state) => state.tasks);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const { mutate: updateTaskMutation } = trpc.task.update.useMutation();
  const { mutate: deleteTaskMutation } = trpc.task.delete.useMutation();

  useEffect(() => {
    // Set loading to false after a short delay to prevent flash
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleCheckClick = async (task: ITask) => {
    if (!task.id) return;
    const newStatus = task.status === "COMPLETED" ? "PROGRESS" : "COMPLETED";
    updateTaskMutation({ id: task.id, status: newStatus });
    await updateTask(task.id, { status: newStatus });
  };

  const handleDeleteClick = async (task: ITask) => {
    if (!task.id) return;
    deleteTaskMutation({ id: task.id });
    await deleteTask(task.id);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <nav className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  Dodo
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user.email} {isAdmin && "(Admin)"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user ? (
          <AuthRoute>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Your Tasks
                </h2>
                {isAdmin && (
                  <Link
                    href="/task/add"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Add Task
                  </Link>
                )}
              </div>

              <div className="mt-6 space-y-4">
                {tasks.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No tasks found. {isAdmin && "Create your first task!"}
                  </p>
                ) : (
                  tasks.map((task) => {
                    if (!task.id) return null;
                    return (
                      <TaskCard
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description || ""}
                        completed={task.status === "COMPLETED"}
                        onCheckClick={() => handleCheckClick(task)}
                        onDeleteClick={() => handleDeleteClick(task)}
                        showDelete={isAdmin}
                        assignedTo={task.assignedTo}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </AuthRoute>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Dodo
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Please log in to manage your tasks.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Log In
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

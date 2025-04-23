import { AuthRoute } from "@/components/AuthRoute";
import { useAuthContext } from "@/context/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useInitMutations } from "@/hooks/useInitMutations";
import { useTaskStore } from "@/store/taskStore";
import TaskCard from "@/components/TaskCard";
import { useEffect } from "react";

export default function Home() {
  const { user, logout } = useAuthContext();
  const { isAdmin, loading: roleLoading } = useUserRole();
  useInitMutations();
  const tasks = useTaskStore((state) => state.tasks);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <nav className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  Todo App
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
              ) : (
                <div className="space-x-4">
                  <Link
                    href="/login"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {user ? (
          <AuthRoute>
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Your Tasks
                  </h2>
                  {isAdmin && (
                    <Link
                      href="/task/add"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                      Add Task
                    </Link>
                  )}
                </div>

                {isAdmin && (
                  <div className="mt-4 p-4 bg-primary-50 dark:bg-gray-800 rounded-md border border-primary-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-primary-800 dark:text-primary-400">
                      Admin Panel
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-primary-300">
                      As an admin, you can assign tasks to users and manage the
                      application.
                    </p>
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  {tasks.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No tasks found. Create your first task!
                    </p>
                  ) : (
                    tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        title={task.title}
                        description={task.description || ""}
                        completed={task.status === "COMPLETED"}
                        onCheckClick={() => {
                          updateTask(task.id as string, {
                            status:
                              task.status === "COMPLETED"
                                ? "PROGRESS"
                                : "COMPLETED",
                          });
                          fetchTasks();
                        }}
                        onDeleteClick={() => {
                          // TODO: Implement task deletion
                          deleteTask(task.id as string);
                          fetchTasks();
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </AuthRoute>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Welcome to Todo App
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Please sign in or create an account to manage your tasks.
            </p>
            <div className="mt-6 space-x-4">
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

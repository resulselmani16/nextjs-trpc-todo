import { getAuth } from "firebase/auth";
import { getTaskWebSocketClient } from "../websocket/client";

const auth = getAuth();

interface TaskUpdate {
  status?: "PROGRESS" | "COMPLETED" | "ASSIGNED";
  createdAt?: number;
  updatedAt?: number;
  updatedBy?: string;
}

export const trackTaskPresence = (taskId: string) => {
  const viewer = {
    id: auth.currentUser?.uid || "",
    email: auth.currentUser?.email || "",
  };
  const wsClient = getTaskWebSocketClient();
  if (wsClient) {
    return wsClient.subscribeToPresence(taskId, () => {});
  }
  return undefined;
};

export const subscribeToTaskUpdates = (
  taskId: string,
  callback: (data: TaskUpdate | null) => void
) => {
  const wsClient = getTaskWebSocketClient();
  if (wsClient) {
    return wsClient.subscribeToTask(taskId, callback);
  }
  return undefined;
};

export const updateTaskInRealtime = async (
  taskId: string,
  updates: TaskUpdate
) => {
  const wsClient = getTaskWebSocketClient();
  if (wsClient) {
    wsClient.updateTask(taskId, {
      ...updates,
      updatedAt: Date.now(),
      updatedBy: auth.currentUser?.uid,
    });
  }
};

export const getTaskViewers = (
  taskId: string,
  callback: (viewers: unknown[]) => void
) => {
  const wsClient = getTaskWebSocketClient();
  if (wsClient) {
    return wsClient.subscribeToPresence(taskId, callback);
  }
  return undefined;
};

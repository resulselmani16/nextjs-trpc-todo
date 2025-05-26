import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  update,
  serverTimestamp,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { app } from "./config";

const db = getDatabase(app);
const auth = getAuth();

interface TaskUpdate {
  status?: "PROGRESS" | "COMPLETED" | "ASSIGNED";
  createdAt?: number;
  updatedAt?: number;
  updatedBy?: string;
}

export const trackTaskPresence = (taskId: string) => {
  const presenceRef = ref(db, `presence/${taskId}/${auth.currentUser?.uid}`);
  return presenceRef;
};

export const subscribeToTaskUpdates = (
  taskId: string,
  callback: (data: TaskUpdate | null) => void
) => {
  const taskRef = ref(db, `tasks/${taskId}`);
  return onValue(taskRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

export const updateTaskInRealtime = async (
  taskId: string,
  updates: TaskUpdate
) => {
  const taskRef = ref(db, `tasks/${taskId}`);
  await update(taskRef, {
    ...updates,
    updatedAt: serverTimestamp(),
    updatedBy: auth.currentUser?.uid,
  });
};

export const getTaskViewers = (
  taskId: string,
  callback: (viewers: any[]) => void
) => {
  const presenceRef = ref(db, `presence/tasks/${taskId}`);
  return onValue(presenceRef, (snapshot) => {
    const viewers = snapshot.val() || {};
    callback(Object.values(viewers));
  });
};

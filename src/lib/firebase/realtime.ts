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

export const trackTaskPresence = (taskId: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const connectedRef = ref(db, ".info/connected");

  onValue(connectedRef, (snap) => {
    if (snap.val() === false) return;

    const presenceRef = ref(db, `presence/tasks/${taskId}/${userId}`);
    set(presenceRef, {
      userId,
      email: auth.currentUser?.email,
      lastSeen: serverTimestamp(),
    });
    // Remove presence when user disconnects
    // Use the onDisconnect method from the database API
    set(presenceRef, {
      userId,
      email: auth.currentUser?.email,
      lastSeen: serverTimestamp(),
    }).then(() => {
      // Now set up what happens on disconnect
      remove(ref(db, `presence/tasks/${taskId}/${userId}`));
    });
  });
};

export const subscribeToTaskUpdates = (
  taskId: string,
  callback: (data: any) => void
) => {
  const taskRef = ref(db, `tasks/${taskId}`);
  return onValue(taskRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

export const updateTaskInRealtime = async (taskId: string, updates: any) => {
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

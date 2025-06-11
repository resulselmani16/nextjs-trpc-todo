interface TaskUpdate {
  status?: "PROGRESS" | "COMPLETED" | "ASSIGNED";
  createdAt?: number;
  updatedAt?: number;
  updatedBy?: string;
}

interface TaskViewer {
  id: string;
  email: string;
}

class TaskWebSocketClient {
  private ws: WebSocket | null = null;
  private taskSubscribers: Map<string, Set<(data: TaskUpdate | null) => void>>;
  private presenceSubscribers: Map<
    string,
    Set<(viewers: TaskViewer[]) => void>
  >;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;

  constructor() {
    this.taskSubscribers = new Map();
    this.presenceSubscribers = new Map();
    this.connect();
  }

  private connect() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
      // Resubscribe to all tasks
      this.taskSubscribers.forEach((_, taskId) => {
        this.subscribeToTask(taskId, () => {});
      });
      this.presenceSubscribers.forEach((_, taskId) => {
        this.subscribeToPresence(taskId, () => {});
      });
    };

    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
      this.ws = null;
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect();
      }, this.reconnectTimeout * this.reconnectAttempts);
    }
  }

  private handleMessage(data: {
    type: "update" | "presence";
    taskId: string;
    updates?: TaskUpdate;
    viewers?: TaskViewer[];
  }) {
    switch (data.type) {
      case "update":
        if (data.updates) {
          this.handleTaskUpdate(data.taskId, data.updates);
        }
        break;
      case "presence":
        if (data.viewers) {
          this.handlePresenceUpdate(data.taskId, data.viewers);
        }
        break;
    }
  }

  private handleTaskUpdate(taskId: string, updates: TaskUpdate) {
    const subscribers = this.taskSubscribers.get(taskId);
    if (subscribers) {
      subscribers.forEach((callback) => callback(updates));
    }
  }

  private handlePresenceUpdate(taskId: string, viewers: TaskViewer[]) {
    const subscribers = this.presenceSubscribers.get(taskId);
    if (subscribers) {
      subscribers.forEach((callback) => callback(viewers));
    }
  }

  public subscribeToTask(
    taskId: string,
    callback: (data: TaskUpdate | null) => void
  ) {
    if (!this.taskSubscribers.has(taskId)) {
      this.taskSubscribers.set(taskId, new Set());
    }
    this.taskSubscribers.get(taskId)?.add(callback);

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "subscribe",
          taskId,
        })
      );
    }

    return () => {
      this.taskSubscribers.get(taskId)?.delete(callback);
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(
          JSON.stringify({
            type: "unsubscribe",
            taskId,
          })
        );
      }
    };
  }

  public subscribeToPresence(
    taskId: string,
    callback: (viewers: TaskViewer[]) => void
  ) {
    if (!this.presenceSubscribers.has(taskId)) {
      this.presenceSubscribers.set(taskId, new Set());
    }
    this.presenceSubscribers.get(taskId)?.add(callback);

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "presence",
          taskId,
        })
      );
    }

    return () => {
      this.presenceSubscribers.get(taskId)?.delete(callback);
    };
  }

  public updateTask(taskId: string, updates: TaskUpdate) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "update",
          taskId,
          updates,
        })
      );
    }
  }
}

// Create a singleton instance only on the client side
let taskWebSocketClient: TaskWebSocketClient | null = null;

export function getTaskWebSocketClient(): TaskWebSocketClient | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (!taskWebSocketClient) {
    taskWebSocketClient = new TaskWebSocketClient();
  }
  return taskWebSocketClient;
}

export { TaskWebSocketClient };

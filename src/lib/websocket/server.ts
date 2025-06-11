import { WebSocketServer, WebSocket } from "ws";
// import { Server } from "http";
import { EventEmitter } from "events";
import { IncomingMessage } from "http";
import { Socket } from "net";

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

interface ExtendedWebSocket extends WebSocket {
  id?: string;
}

interface WebSocketMessage {
  type: "subscribe" | "unsubscribe" | "update" | "presence";
  taskId: string;
  updates?: TaskUpdate;
  viewer?: TaskViewer;
}

class TaskWebSocketServer {
  private wss: WebSocketServer;
  private taskSubscribers: Map<string, Set<ExtendedWebSocket>>;
  private presenceSubscribers: Map<string, Set<ExtendedWebSocket>>;
  private viewerPresence: Map<string, Map<string, TaskViewer>>;
  private eventEmitter: EventEmitter;

  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.taskSubscribers = new Map();
    this.presenceSubscribers = new Map();
    this.viewerPresence = new Map();
    this.eventEmitter = new EventEmitter();

    this.wss.on("connection", (ws: ExtendedWebSocket) => {
      ws.id = Math.random().toString(36).substring(7);

      ws.on("message", (message) => {
        try {
          const data = JSON.parse(message.toString()) as WebSocketMessage;
          this.handleMessage(ws, data);
        } catch (error) {
          console.error("Error handling WebSocket message:", error);
        }
      });

      ws.on("close", () => {
        this.handleDisconnect(ws);
      });
    });
  }

  private handleMessage(ws: ExtendedWebSocket, data: WebSocketMessage) {
    switch (data.type) {
      case "subscribe":
        this.handleSubscribe(ws, data.taskId);
        break;
      case "unsubscribe":
        this.handleUnsubscribe(ws, data.taskId);
        break;
      case "update":
        if (data.updates) {
          this.handleUpdate(data.taskId, data.updates);
        }
        break;
      case "presence":
        if (data.viewer) {
          this.handlePresence(ws, data.taskId, data.viewer);
        }
        break;
    }
  }

  private handleSubscribe(ws: ExtendedWebSocket, taskId: string) {
    if (!this.taskSubscribers.has(taskId)) {
      this.taskSubscribers.set(taskId, new Set());
    }
    this.taskSubscribers.get(taskId)?.add(ws);
  }

  private handleUnsubscribe(ws: ExtendedWebSocket, taskId: string) {
    this.taskSubscribers.get(taskId)?.delete(ws);
    this.presenceSubscribers.get(taskId)?.delete(ws);
  }

  private handleUpdate(taskId: string, updates: TaskUpdate) {
    const subscribers = this.taskSubscribers.get(taskId);
    if (subscribers) {
      const message = JSON.stringify({
        type: "update",
        taskId,
        updates,
      });
      subscribers.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    }
  }

  private handlePresence(
    ws: ExtendedWebSocket,
    taskId: string,
    viewer: TaskViewer
  ) {
    if (!this.presenceSubscribers.has(taskId)) {
      this.presenceSubscribers.set(taskId, new Set());
    }
    this.presenceSubscribers.get(taskId)?.add(ws);

    if (!this.viewerPresence.has(taskId)) {
      this.viewerPresence.set(taskId, new Map());
    }
    this.viewerPresence.get(taskId)?.set(viewer.id, viewer);

    this.broadcastPresence(taskId);
  }

  private handleDisconnect(ws: ExtendedWebSocket) {
    // Remove from all task subscribers
    this.taskSubscribers.forEach((subscribers) => {
      subscribers.delete(ws);
    });

    // Remove from all presence subscribers
    this.presenceSubscribers.forEach((subscribers) => {
      subscribers.delete(ws);
    });

    // Remove from viewer presence
    this.viewerPresence.forEach((viewers, taskId) => {
      viewers.forEach((viewer, viewerId) => {
        if (viewer.id === ws.id) {
          viewers.delete(viewerId);
        }
      });
      this.broadcastPresence(taskId);
    });
  }

  private broadcastPresence(taskId: string) {
    const viewers = this.viewerPresence.get(taskId);
    const subscribers = this.presenceSubscribers.get(taskId);

    if (viewers && subscribers) {
      const message = JSON.stringify({
        type: "presence",
        taskId,
        viewers: Array.from(viewers.values()),
      });

      subscribers.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    }
  }

  public updateTask(taskId: string, updates: TaskUpdate) {
    this.handleUpdate(taskId, updates);
  }

  public handleUpgrade(request: IncomingMessage, socket: Socket, head: Buffer) {
    this.wss.handleUpgrade(request, socket, head, (ws) => {
      this.wss.emit("connection", ws, request);
    });
  }
}

export default TaskWebSocketServer;

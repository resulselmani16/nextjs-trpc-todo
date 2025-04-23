export interface ITask {
  id?: string;
  title: string;
  description?: string;
  assignedTo?: string;
  status?: "PROGRESS" | "COMPLETED" | "ASSIGNED";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "ADMIN" | "USER";
  createdAt: Date;
  updatedAt: Date;
}

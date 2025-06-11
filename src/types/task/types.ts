export interface ITask {
  id?: string;
  title: string;
  description: string | null | undefined;
  assignedTo: string;
  status?: "PROGRESS" | "COMPLETED" | "ASSIGNED";
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "ADMIN" | "USER";
  createdAt: Date;
  updatedAt: Date;
}

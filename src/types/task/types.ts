export interface ITask {
  id?: string;
  title: string;
  description: string | null | undefined;
  assignedTo?: {
    id: string;
    name: string | null;
    email: string;
    role: "ADMIN" | "USER";
    createdAt: Date;
    updatedAt: Date;
  };
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

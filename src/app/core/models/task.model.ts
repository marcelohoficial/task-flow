export interface Task {
  id: string;
  title: string;
  description: string;
  userName: string;
  priority: TaskPriority;
  deadLine: Date;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export enum TaskPriority {
  HIGH = "Alta",
  MEDIUM = "Média",
  LOW = "Baixa",
}

export enum TaskStatusCreate {
  INPROGRESS = "INPROGRESS",
  COMPLETED = "COMPLETED",
}

export enum TaskStatus {
  INPROGRESS = "Em andamento",
  COMPLETED = "Concluída",
}

export interface TaskFilter {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  userId: string;
  priority: TaskPriority;
  status: TaskStatusCreate;
  deadLine: Date;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  userId?: string;
  priority?: TaskPriority;
  deadLine?: Date;
  status?: TaskStatus;
}

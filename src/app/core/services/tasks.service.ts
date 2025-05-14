import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  CreateTaskDto,
  Task,
  TaskFilter,
  UpdateTaskDto,
} from "../models/task.model";

@Injectable({
  providedIn: "root",
})
export class TasksService {
  private apiUrl = `${environment.apiUrl}/tasks`;
  private token = localStorage.getItem("access_token");

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getFilteredTasks(filter: TaskFilter): Observable<Task[]> {
    const params: any = {};

    if (filter.status) params.status = filter.status;
    if (filter.priority) params.priority = filter.priority;
    if (filter.search) params.search = filter.search;

    return this.http.get<Task[]>(`${this.apiUrl}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getAllUsers(): Observable<[]> {
    return this.http.get<[]>(this.apiUrl + "/users", {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  createTask(createTaskDto: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.apiUrl + "/create", createTaskDto, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  updateTask(id: string, updateTaskDto: UpdateTaskDto): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/edit/${id}`, updateTaskDto, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  markTaskAsCompleted(id: string): Observable<Task> {
    return this.http.patch<Task>(
      `${this.apiUrl}/${id}`,
      {
        status: "COMPLETED",
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }
}

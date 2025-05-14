import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import {
  Task,
  TaskPriority,
  TaskStatus,
} from "../../../core/models/task.model";
import { TasksService } from "../../../core/services/tasks.service";

@Component({
  selector: "app-task-detail",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto animate-fadeIn">
      <div class="mb-6">
        <button
          (click)="goBack()"
          class="text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
        >
          <i class="fas fa-arrow-left mr-2"></i> Voltar
        </button>
      </div>

      @if (loading) {
      <div class="flex justify-center items-center py-12">
        <div
          class="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"
        ></div>
      </div>
      } @else if (error) {
      <div class="bg-error-50 p-6 rounded-lg text-center">
        <p class="text-error-800">{{ error }}</p>
        <button (click)="goBack()" class="btn btn-primary mt-4">
          Voltar para lista
        </button>
      </div>
      } @else if (task) {
      <div class="card p-6">
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4"
        >
          <h1 class="text-2xl font-bold text-gray-900">{{ task.title }}</h1>
          <div class="flex space-x-2">
            <a
              [routerLink]="['/tasks', task.id, 'edit']"
              class="btn btn-secondary text-sm"
            >
              <i class="fas fa-edit mr-2"></i> Editar
            </a>
            @if (task.status !== 'Concluída') {
            <button (click)="completeTask()" class="btn btn-accent text-sm">
              <i class="fas fa-check-circle mr-2"></i> Concluir
            </button>
            }
            <button (click)="deleteTask()" class="btn btn-error text-sm">
              <i class="fas fa-trash-alt mr-2"></i> Excluir
            </button>
          </div>
        </div>

        <div class="flex flex-wrap gap-3 mb-6">
          <div
            class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
            [ngClass]="getPriorityBadgeClass()"
          >
            <i class="fas fa-flag mr-2"></i>
            {{ translatePriority(task.priority) }}
          </div>
          <div
            class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
            [ngClass]="getStatusBadgeClass()"
          >
            <i
              [class]="
                task.status === 'Concluída'
                  ? 'fas fa-check-circle mr-2'
                  : 'fas fa-clock mr-2'
              "
            ></i>
            {{ translateStatus(task.status) }}
          </div>
          <div
            class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
            [ngClass]="getDeadlineBadgeClass()"
          >
            <i class="fas fa-calendar-alt mr-2"></i>
            {{ task.deadLine | date : "dd/MM/yyyy" }}
            @if (isOverdue()) {
            <span class="ml-1">(Atrasada)</span>
            }
          </div>
        </div>

        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2 text-gray-800">Descrição</h2>
          <div class="bg-gray-50 p-4 rounded-md">
            <p class="text-gray-700 whitespace-pre-line">
              {{ task.description }}
            </p>
          </div>
        </div>

        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2 text-gray-800">Detalhes</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-md">
              <div class="flex items-center">
                <i class="fas fa-user text-gray-500 mr-3 w-5"></i>
                <div>
                  <p class="text-sm text-gray-600">Responsável</p>
                  <p class="text-gray-800 font-medium">
                    {{ task.userName }}
                  </p>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 p-4 rounded-md">
              <div class="flex items-center">
                <i class="fas fa-clock text-gray-500 mr-3 w-5"></i>
                <div>
                  <p class="text-sm text-gray-600">Criada em</p>
                  <p class="text-gray-800 font-medium">
                    {{ task.createdAt | date : "dd/MM/yyyy" }}
                  </p>
                </div>
              </div>
            </div>
            @if (task.status === 'Concluída') {
            <div class="bg-gray-50 p-4 rounded-md">
              <div class="flex items-center">
                <i class="fas fa-check-circle text-accent-500 mr-3 w-5"></i>
                <div>
                  <p class="text-sm text-gray-600">Concluída em</p>
                  <p class="text-gray-800 font-medium">
                    {{ task.updatedAt | date : "dd/MM/yyyy" }}
                  </p>
                </div>
              </div>
            </div>
            }
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class TaskDetailComponent implements OnInit {
  task?: Task;
  loading = true;
  error = "";
  users: { id: string; name: string }[] = [];
  usersError = false;

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.loadTask(id);
    } else {
      this.error = "ID da tarefa não fornecido";
      this.loading = false;
    }
  }

  loadUsers(): void {
    this.tasksService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.usersError = false;
      },
      error: () => {
        this.usersError = true;
      },
    });
  }

  loadTask(id: string): void {
    this.tasksService.getTask(id).subscribe({
      next: (task) => {
        if (task) {
          this.task = task;
        } else {
          this.error = "Tarefa não encontrada";
        }
        this.loading = false;
      },
      error: () => {
        this.error = "Erro ao carregar tarefa";
        this.loading = false;
      },
    });
  }

  getPriorityBadgeClass(): string {
    if (!this.task) return "";

    const priorityMap: Record<string, string> = {
      [TaskPriority.HIGH]: "bg-error-100 text-error-800",
      [TaskPriority.MEDIUM]: "bg-warning-100 text-warning-800",
      [TaskPriority.LOW]: "bg-accent-100 text-accent-800",
    };
    return priorityMap[this.task.priority] || "";
  }

  getStatusBadgeClass(): string {
    if (!this.task) return "";

    return this.task.status === TaskStatus.COMPLETED
      ? "bg-accent-100 text-accent-800"
      : "bg-primary-100 text-primary-800";
  }

  getDeadlineBadgeClass(): string {
    if (!this.task) return "";

    if (this.isOverdue()) {
      return "bg-error-100 text-error-800";
    }
    return "bg-gray-100 text-gray-800";
  }

  isOverdue(): boolean {
    if (!this.task) return false;

    const now = new Date();
    const deadLine = new Date(this.task.deadLine);
    deadLine.setDate(deadLine.getDate() + 1);
    deadLine.setHours(23, 59, 59, 999);

    return now > deadLine && this.task.status !== TaskStatus.COMPLETED;
  }

  completeTask(): void {
    if (!this.task) return;

    this.tasksService.markTaskAsCompleted(this.task.id).subscribe({
      next: (updatedTask) => {
        this.task = updatedTask;
      },
      error: () => {
        this.error = "Erro ao concluir tarefa";
      },
    });
  }

  deleteTask(): void {
    if (!this.task) return;

    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
      this.tasksService.deleteTask(this.task.id).subscribe({
        next: () => {
          this.router.navigate(["/tasks"]);
        },
        error: () => {
          this.error = "Erro ao excluir tarefa";
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(["/tasks"]);
  }

  translatePriority(priority: string): string {
    const priorityMap: Record<string, string> = {
      HIGH: "Alta",
      MEDIUM: "Média",
      LOW: "Baixa",
    };
    return priorityMap[priority] || priority;
  }

  translateStatus(status: string): string {
    const statusMap: Record<string, string> = {
      INPROGRESS: "Em andamento",
      COMPLETED: "Concluída",
      PENDING: "Pendente",
    };
    return statusMap[status] || status;
  }
}

import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { Task } from "../../../core/models/task.model";
import { TasksService } from "../../../core/services/tasks.service";
import { TaskItemComponent } from "../task-item/task-item.component";

@Component({
  selector: "app-task-list",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TaskItemComponent],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <!-- Header -->
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Minhas Tarefas</h1>
          <p class="text-gray-600 mt-1">
            Gerencie suas tarefas de forma eficiente
          </p>
        </div>
        <div>
          <a routerLink="/tasks/create" class="btn btn-primary">
            <i class="fas fa-plus mr-2"></i> Nova Tarefa
          </a>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="search" class="form-label">Buscar</label>
            <input
              type="text"
              id="search"
              class="form-input"
              placeholder="Número, título ou descrição"
              [(ngModel)]="searchTerm"
              (input)="applyFilters()"
            />
          </div>
          <div>
            <label for="status-filter" class="form-label">Status</label>
            <select
              id="status-filter"
              class="form-input"
              [(ngModel)]="statusFilter"
              (change)="applyFilters()"
            >
              <option value="ALL">Todos</option>
              <option value="INPROGRESS">Em andamento</option>
              <option value="COMPLETED">Concluídas</option>
            </select>
          </div>
          <div>
            <label for="priority-filter" class="form-label">Prioridade</label>
            <select
              id="priority-filter"
              class="form-input"
              [(ngModel)]="priorityFilter"
              (change)="applyFilters()"
            >
              <option value="ALL">Todas</option>
              <option value="HIGH">Alta</option>
              <option value="MEDIUM">Média</option>
              <option value="LOW">Baixa</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tasks list -->
      <div class="space-y-4">
        <div *ngIf="loading" class="flex justify-center items-center py-12">
          <div
            class="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"
          ></div>
        </div>
        <div
          *ngIf="!loading && tasks.length === 0"
          class="bg-white rounded-lg shadow-sm p-12 text-center"
        >
          <div class="mx-auto max-w-md">
            <i class="fas fa-tasks text-gray-300 text-6xl mb-4"></i>
            <h2 class="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma tarefa encontrada
            </h2>
            <p class="text-gray-500 mb-6">
              <span *ngIf="isDefaultFilter()"
                >Você não tem nenhuma tarefa ainda. Crie uma nova tarefa para
                começar!</span
              >
              <span *ngIf="!isDefaultFilter()"
                >Nenhuma tarefa corresponde aos filtros selecionados. Tente
                ajustar seus filtros.</span
              >
            </p>
            <a routerLink="/tasks/create" class="btn btn-primary">
              <i class="fas fa-plus mr-2"></i> Criar Tarefa
            </a>
          </div>
        </div>
        <div
          *ngIf="!loading && tasks.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <app-task-item
            *ngFor="let task of tasks"
            [task]="task"
            (complete)="completeTask($event)"
            (delete)="deleteTask($event)"
          ></app-task-item>
        </div>
      </div>
    </div>
  `,
})
export class TaskListComponent implements OnInit {
  allTasks: Task[] = [];
  tasks: Task[] = [];
  loading = true;

  statusFilter = "INPROGRESS";
  priorityFilter = "ALL";
  searchTerm = "";

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.tasksService.getAllTasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    let filteredTasks = [...this.allTasks];

    if (this.statusFilter !== "ALL") {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === this.statusFilter
      );
    }

    if (this.priorityFilter !== "ALL") {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === this.priorityFilter
      );
    }

    if (this.searchTerm.trim() !== "") {
      const searchLower = this.searchTerm.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
      );
    }

    this.tasks = filteredTasks;
  }

  completeTask(taskId: string): void {
    this.tasksService.markTaskAsCompleted(taskId).subscribe({
      next: () => this.loadTasks(),
    });
  }

  deleteTask(taskId: string): void {
    this.tasksService.deleteTask(taskId).subscribe({
      next: () => this.loadTasks(),
    });
  }

  isDefaultFilter(): boolean {
    return (
      this.statusFilter === "INPROGRESS" &&
      this.priorityFilter === "ALL" &&
      this.searchTerm.trim() === ""
    );
  }
}

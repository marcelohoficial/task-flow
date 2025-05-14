import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterLink } from "@angular/router";
import {
  Task,
  TaskPriority,
  TaskStatus,
} from "../../../core/models/task.model";

@Component({
  selector: "app-task-item",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div
      class="card transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div class="p-4" [ngClass]="getPriorityClass()">
        <div class="flex justify-between">
          <span
            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
            [ngClass]="getPriorityBadgeClass()"
          >
            {{ traduzirPrioridade(task.priority) }}
          </span>
          <span
            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
            [ngClass]="getStatusBadgeClass()"
          >
            {{ traduzirStatus(task.status) }}
          </span>
        </div>

        <h3 class="text-lg font-semibold mt-2 text-gray-900">
          {{ task.title }}
        </h3>

        <p class="mt-1 text-sm text-gray-600 line-clamp-2">
          {{ task.description }}
        </p>

        <div class="mt-4 flex flex-col space-y-2 text-sm text-gray-600">
          <div class="flex items-center">
            <i class="fas fa-user mr-2 text-gray-400 w-5"></i>
            <span>{{ task.userName }}</span>
          </div>
          <div class="flex items-center">
            <i class="fas fa-calendar-alt mr-2 text-gray-400 w-5"></i>
            <span [class.text-error-600]="isOverdue()">
              {{ corrigirData(task.deadLine) | date : "dd/MM/yyyy" }}
              <span *ngIf="isOverdue()" class="text-error-600 ml-1"
                >(Atrasada)</span
              >
            </span>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 px-4 py-3 flex justify-between">
        <div class="flex space-x-2">
          <a
            [routerLink]="['/tasks', task.id]"
            class="text-sm text-primary-600 hover:text-primary-800 transition-colors"
          >
            <i class="fas fa-eye mr-1"></i> Ver
          </a>
          <a
            [routerLink]="['/tasks', task.id, 'edit']"
            class="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i class="fas fa-edit mr-1"></i> Editar
          </a>
        </div>
        <div class="flex space-x-2">
          <button
            (click)="onComplete()"
            class="text-sm text-accent-600 hover:text-accent-800 transition-colors"
          >
            <i class="fas fa-check-circle mr-1"></i> Concluir
          </button>
          <button
            (click)="onDelete()"
            class="text-sm text-error-600 hover:text-error-800 transition-colors"
          >
            <i class="fas fa-trash-alt mr-1"></i> Excluir
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TaskItemComponent {
  public TaskStatus = TaskStatus;
  @Input() task!: Task;
  @Output() complete = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  getPriorityClass(): string {
    const priorityMap: Record<string, string> = {
      [TaskPriority.HIGH]: "priority-high",
      [TaskPriority.MEDIUM]: "priority-medium",
      [TaskPriority.LOW]: "priority-low",
    };
    return priorityMap[this.task.priority] || "";
  }

  getPriorityBadgeClass(): string {
    const priorityMap: Record<string, string> = {
      [TaskPriority.HIGH]: "bg-error-100 text-error-800",
      [TaskPriority.MEDIUM]: "bg-warning-100 text-warning-800",
      [TaskPriority.LOW]: "bg-accent-100 text-accent-800",
    };
    return priorityMap[this.task.priority] || "";
  }

  getStatusBadgeClass(): string {
    return this.task.status === TaskStatus.COMPLETED
      ? "bg-accent-100 text-accent-800"
      : "bg-primary-100 text-primary-800";
  }

  isOverdue(): boolean {
    const now = new Date();

    const deadLine = new Date(this.task.deadLine);
    deadLine.setHours(23, 59, 59, 999);

    return deadLine < now && this.task.status !== TaskStatus.COMPLETED;
  }

  corrigirData(data: Date): Date {
    const date = new Date(data);
    date.setDate(date.getDate() + 1);
    return date;
  }

  traduzirPrioridade(priority: string): string {
    const priorityMap: Record<string, string> = {
      HIGH: "Alta",
      MEDIUM: "Média",
      LOW: "Baixa",
    };
    return priorityMap[priority] || priority;
  }

  traduzirStatus(status: string): string {
    const statusMap: Record<string, string> = {
      INPROGRESS: "Em andamento",
      COMPLETED: "Concluída",
      PENDING: "Pendente",
    };
    return statusMap[status] || status;
  }

  onComplete(): void {
    this.complete.emit(this.task.id);
  }

  onDelete(): void {
    this.delete.emit(this.task.id);
  }
}

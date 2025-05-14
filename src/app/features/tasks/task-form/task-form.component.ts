import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  CreateTaskDto,
  TaskStatusCreate,
  UpdateTaskDto,
} from "../../../core/models/task.model";
import { TasksService } from "../../../core/services/tasks.service";

@Component({
  selector: "app-task-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto animate-fadeIn">
      <div class="mb-6">
        <button
          (click)="goBack()"
          class="text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
        >
          <i class="fas fa-arrow-left mr-2"></i> Voltar
        </button>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isEditMode ? "Editar Tarefa" : "Nova Tarefa" }}
        </h1>
        <p class="text-gray-600 mt-1">
          {{
            isEditMode
              ? "Atualize os detalhes da tarefa"
              : "Preencha os detalhes da nova tarefa"
          }}
        </p>
      </div>

      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <div
          class="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"
        ></div>
      </div>
      <div *ngIf="!loading">
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="card p-6 space-y-6">
            <div>
              <label for="title" class="form-label"
                >Título <span class="text-error-600">*</span></label
              >
              <input
                id="title"
                type="text"
                formControlName="title"
                class="form-input"
                placeholder="Título da tarefa"
              />
              <p
                *ngIf="submitted && taskForm.get('title')?.errors"
                class="form-error"
              >
                O título é obrigatório
              </p>
            </div>

            <div>
              <label for="description" class="form-label"
                >Descrição <span class="text-error-600">*</span></label
              >
              <textarea
                id="description"
                formControlName="description"
                class="form-input"
                placeholder="Descreva a tarefa detalhadamente"
                maxlength="500"
              ></textarea>
              <p
                *ngIf="submitted && taskForm.get('description')?.errors"
                class="form-error"
              >
                A descrição é obrigatória
              </p>
            </div>

            <div>
              <label for="responsible" class="form-label"
                >Responsável <span class="text-error-600">*</span></label
              >
              <select
                id="responsible"
                formControlName="responsible"
                class="form-input"
                [disabled]="users.length === 0 || usersError"
              >
                <option [ngValue]="null" disabled>
                  Selecione um responsável
                </option>
                <option *ngFor="let user of users" [ngValue]="user.id">
                  {{ user.name }}
                </option>
              </select>
              <p
                *ngIf="submitted && taskForm.get('responsible')?.errors"
                class="form-error"
              >
                O responsável é obrigatório
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="priority" class="form-label"
                  >Prioridade <span class="text-error-600">*</span></label
                >
                <select
                  id="priority"
                  formControlName="priority"
                  class="form-input"
                >
                  <option [ngValue]="null" disabled>
                    Selecione uma prioridade
                  </option>
                  <option [ngValue]="'HIGH'">Alta</option>
                  <option [ngValue]="'MEDIUM'">Média</option>
                  <option [ngValue]="'LOW'">Baixa</option>
                </select>
                <p
                  *ngIf="submitted && taskForm.get('priority')?.errors"
                  class="form-error"
                >
                  A prioridade é obrigatória
                </p>
              </div>

              <div>
                <label for="deadLine" class="form-label"
                  >Data Limite <span class="text-error-600">*</span></label
                >
                <input
                  id="deadLine"
                  type="date"
                  formControlName="deadLine"
                  class="form-input"
                />
                <p
                  *ngIf="submitted && taskForm.get('deadLine')?.errors"
                  class="form-error"
                >
                  A data limite é obrigatória
                </p>
              </div>
            </div>

            <div *ngIf="isEditMode">
              <label for="status" class="form-label"
                >Status <span class="text-error-600">*</span></label
              >
              <select id="status" formControlName="status" class="form-input">
                <option [ngValue]="'INPROGRESS'">Em andamento</option>
                <option [ngValue]="'COMPLETED'">Concluída</option>
              </select>
            </div>

            <div *ngIf="error" class="bg-error-50 p-4 rounded-md">
              <p class="text-error-800 text-sm">{{ error }}</p>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                (click)="goBack()"
                class="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="submitting"
                class="btn btn-primary flex items-center gap-2"
              >
                <div
                  *ngIf="submitting"
                  class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                ></div>
                <span>{{
                  isEditMode ? "Salvar alterações" : "Criar tarefa"
                }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  loading = false;
  submitting = false;
  submitted = false;
  error = "";
  taskId?: string;
  users: { id: string; name: string }[] = [];
  usersError = false;

  constructor(
    private formBuilder: FormBuilder,
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadUsers();

    this.taskId = this.route.snapshot.paramMap.get("id") || undefined;
    this.isEditMode = !!this.taskId;

    if (this.isEditMode && this.taskId) {
      this.loadTask(this.taskId);
    }
  }

  createForm(): void {
    this.taskForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      responsible: [null, Validators.required],
      priority: [null, Validators.required],
      deadLine: ["", Validators.required],
      status: ["INPROGRESS"],
    });
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
    this.loading = true;

    this.tasksService.getTask(id).subscribe({
      next: (task) => {
        if (task) {
          const deadLine = new Date(task.deadLine);
          const formattedDeadline = deadLine.toISOString().split("T")[0];

          this.taskForm.patchValue({
            title: task.title,
            description: task.description,
            responsible: task.userId,
            priority: task.priority,
            deadLine: formattedDeadline,
            status: task.status,
          });
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

  onSubmit(): void {
    this.submitted = true;
    this.error = "";

    if (this.taskForm.invalid) {
      return;
    }

    this.submitting = true;

    const formValues = this.taskForm.value;
    const deadLineDate = new Date(formValues.deadLine);

    if (this.isEditMode && this.taskId) {
      const updateTaskDto: UpdateTaskDto = {
        title: formValues.title,
        description: formValues.description,
        userId: formValues.responsible,
        priority: formValues.priority,
        deadLine: deadLineDate,
        status: formValues.status,
      };

      this.tasksService.updateTask(this.taskId, updateTaskDto).subscribe({
        next: () => {
          this.router.navigate(["/tasks"]);
        },
        error: (error) => {
          this.error = "Erro ao atualizar tarefa";
          this.submitting = false;
        },
      });
    } else {
      const createTaskDto: CreateTaskDto = {
        title: formValues.title,
        description: formValues.description,
        userId: formValues.responsible,
        priority: formValues.priority,
        status: TaskStatusCreate.INPROGRESS,
        deadLine: deadLineDate,
      };

      this.tasksService.createTask(createTaskDto).subscribe({
        next: () => {
          this.router.navigate(["/tasks"]);
        },
        error: (error) => {
          this.error = "Erro ao criar tarefa";
          this.submitting = false;
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(["/tasks"]);
  }
}

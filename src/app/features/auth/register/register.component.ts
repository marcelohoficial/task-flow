import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { RegisterDto } from "../../../core/models/user.model";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div
      class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
    >
      <div class="w-full max-w-md space-y-8 animate-fadeIn">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-primary-600">TaskFlow</h1>
          <h2
            class="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900"
          >
            Crie sua conta
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ou
            <a
              routerLink="/auth/login"
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              faça login na sua conta existente
            </a>
          </p>
        </div>

        <form
          [formGroup]="registerForm"
          (ngSubmit)="onSubmit()"
          class="mt-8 space-y-6"
        >
          <div class="card p-6 space-y-4">
            <div>
              <label for="name" class="form-label">Nome</label>
              <input
                id="name"
                name="name"
                type="text"
                formControlName="name"
                class="form-input"
                placeholder="Digite seu nome completo"
              />
              @if (submitted && registerForm.get('name')?.errors) {
              <p class="form-error">Nome é obrigatório</p>
              }
            </div>

            <div>
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                formControlName="email"
                class="form-input"
                placeholder="Digite seu email"
              />
              @if (submitted && registerForm.get('email')?.errors) {
              <p class="form-error">
                @if (registerForm.get('email')?.hasError('required')) { Email é
                obrigatório } @else if
                (registerForm.get('email')?.hasError('email')) { Email inválido
                }
              </p>
              }
            </div>

            <div>
              <label for="password" class="form-label">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                formControlName="password"
                class="form-input"
                placeholder="Digite sua senha"
              />
              @if (submitted && registerForm.get('password')?.errors) {
              <p class="form-error">
                @if (registerForm.get('password')?.hasError('required')) { Senha
                é obrigatória } @else if
                (registerForm.get('password')?.hasError('minlength')) { A senha
                deve ter pelo menos 6 caracteres }
              </p>
              }
            </div>

            @if (error) {
            <div class="bg-error-50 p-4 rounded-md">
              <p class="text-error-800 text-sm">{{ error }}</p>
            </div>
            }

            <div>
              <button
                type="submit"
                [disabled]="loading"
                class="btn btn-primary w-full flex justify-center items-center gap-2"
              >
                @if (loading) {
                <div
                  class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                ></div>
                <span>Registrando...</span>
                } @else {
                <span>Criar conta</span>
                }
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = "";

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const registerDto: RegisterDto = this.registerForm.value;

    this.authService.register(registerDto).subscribe({
      next: () => {
        this.router.navigate(["/tasks"]);
      },
      error: (error) => {
        this.error = error.message || "Falha no registro. Tente novamente.";
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}

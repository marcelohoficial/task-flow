import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { LoginDto } from "../../../core/models/user.model";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div
      class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
    >
      <div class="w-full max-w-md space-y-8 animate-fadeIn">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-primary-600">Gestão de Tarefas</h1>
          <h2
            class="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900"
          >
            Entre na sua conta
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ou
            <a
              routerLink="/auth/register"
              class="font-medium text-primary-600 hover:text-primary-500 cursor-pointer"
            >
              crie uma nova conta
            </a>
          </p>
        </div>

        <form
          [formGroup]="loginForm"
          (ngSubmit)="onSubmit()"
          class="mt-8 space-y-6"
        >
          <div class="card p-6 space-y-4">
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
              @if (submitted && loginForm.get('email')?.errors) {
              <p class="form-error">Email é obrigatório</p>
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
              @if (submitted && loginForm.get('password')?.errors) {
              <p class="form-error">Senha é obrigatória</p>
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
                <span>Entrando...</span>
                } @else {
                <span>Entrar</span>
                }
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = "";

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const loginDto: LoginDto = this.loginForm.value;

    this.authService.login(loginDto).subscribe({
      next: () => {
        this.router.navigate(["/tasks"]);
      },
      error: (error) => {
        console.error("Erro ao fazer login:", error);
        this.error = "Verifique suas credenciais.";
        this.loading = false;
      },
    });
  }
}

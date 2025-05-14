import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <a routerLink="/tasks" class="flex items-center gap-2">
              <span class="text-2xl font-bold text-primary-600"
                >Gestão de Tarefas</span
              >
            </a>
          </div>
          <div class="flex items-center gap-4">
            <ng-container *ngIf="userName$ | async as userName">
              <span class="text-sm text-gray-700">Olá, {{ userName }}</span>
            </ng-container>
            <button (click)="logout()" class="btn btn-secondary text-sm">
              <i class="fas fa-sign-out-alt mr-2"></i> Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  @Input() userName$ = this.authService.currentUser$.pipe();

  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/auth/login"]);
  }
}

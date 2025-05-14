import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { HeaderComponent } from "../../../shared/components/header/header.component";

@Component({
  selector: "app-tasks-layout",
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <app-header [userName$]="userName$"></app-header>
      <main class="flex-1">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
})
export class TasksLayoutComponent {
  userName$ = this.authService.currentUser$.pipe();

  constructor(private authService: AuthService) {}
}

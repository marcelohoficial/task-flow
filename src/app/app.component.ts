import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "./core/services/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="min-h-screen flex flex-col">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  constructor(private authService: AuthService) {
    this.authService.initAuthState();
  }
}

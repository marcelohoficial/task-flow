import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthResponse } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly STORAGE_KEY = "taskflow_auth";
  private authSubject = new BehaviorSubject<AuthResponse | null>(null);

  private readonly TOKEN_KEY = "access_token";
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.authSubject.pipe(map((auth) => auth?.user || null));

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Inicializa o estado de autenticação a partir do armazenamento local.
   */
  initAuthState(): void {
    const storedAuth = localStorage.getItem(this.STORAGE_KEY);
    if (storedAuth) {
      try {
        const auth = JSON.parse(storedAuth);
        this.authSubject.next(auth);
      } catch (error) {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  register(credentials: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/signup`, credentials)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(["/login"]);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Obtém o valor atual da autenticação.
   * @returns Objeto de autenticação ou null.
   */
  getCurrentAuthValue(): AuthResponse | null {
    return this.authSubject.value;
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
  userRole: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

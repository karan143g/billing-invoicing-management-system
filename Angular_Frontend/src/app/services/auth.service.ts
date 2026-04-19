import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginRequest,LoginResponse } from '@app/model/login';

@Injectable({ providedIn: 'root' })
export class AuthService {

  

  private apiUrl = 'https://localhost:7093/api';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data
    ).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  logout() {
    localStorage.clear();
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get user() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  hasRole(role: string): boolean {
    return this.user?.role === role;
  }
}

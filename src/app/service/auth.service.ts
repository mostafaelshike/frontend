import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environment';

interface TokenPayload {
  id: string;
  role: string;
  name?: string;
  image?: string;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  // ✅apiUrl الأساسي: https://.../api/users
  private apiUrl = `${environment.apiUrl}/users`; 
  
  private tokenSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('token')
  );

  constructor(private http: HttpClient) {}

  // ✅ تسجيل مستخدم جديد
  register(userData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }): Observable<any> {
    // الرابط النهائي الصحيح: https://.../api/users/register
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((res: any) => {
        if (res?.token) {
          this.saveUserData(res.token);
        }
      })
    );
  }

  // ✅ تسجيل الدخول
  login(email: string, password: string): Observable<any> {
    // الرابط النهائي الصحيح: https://.../api/users/login
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        if (res?.token) {
          this.saveUserData(res.token);
        }
      })
    );
  }

  // حفظ بيانات المستخدم في LocalStorage بعد النجاح
  private saveUserData(token: string) {
    try {
      const decoded: TokenPayload = jwtDecode(token);

      localStorage.setItem('token', token);
      localStorage.setItem('id', decoded.id);
      localStorage.setItem('role', decoded.role);

      if (decoded.name) localStorage.setItem('name', decoded.name);
      if (decoded.image) localStorage.setItem('image', decoded.image);
      if (decoded.email) localStorage.setItem('email', decoded.email);

      this.tokenSubject.next(token);
    } catch (err) {
      console.error('❌ Error decoding token:', err);
    }
  }

  // استرجاع بيانات المستخدم الحالية
  getUserData() {
    return {
      id: localStorage.getItem('id'),
      name: localStorage.getItem('name'),
      image: localStorage.getItem('image'),
      role: localStorage.getItem('role'),
      email: localStorage.getItem('email'),
    };
  }

  get user() {
    return this.getUserData();
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserId(): string | null {
    return localStorage.getItem('id');
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  logout() {
    localStorage.clear();
    this.tokenSubject.next(null);
  }
}
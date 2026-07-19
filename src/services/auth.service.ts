import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // ────────────────────────────────────────────────
  // غير الرابط ده لما تنشر الباك اند
  // مثال: 'https://backend-name.up.railway.app'
  private readonly BASE_URL = 'http://localhost:8080';  
  // private readonly BASE_URL = 'https://backend-coral-three-89.vercel.app';
  // ────────────────────────────────────────────────

  private apiUrl = `${this.BASE_URL}/api/users`;

  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));

  constructor(private http: HttpClient) {}

  register(formData: any): Observable<any> {
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password
    };

    return this.http.post(`${this.apiUrl}/register`, payload).pipe(
      tap((res: any) => this.saveUserData(res.token, res.user))
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => this.saveUserData(res.token, res.user))
    );
  }

  private saveUserData(token: string, userData: any) {
    try {
      const decoded: TokenPayload = jwtDecode(token);

      localStorage.setItem('token', token);
      localStorage.setItem('userId', decoded.id);
      localStorage.setItem('role', decoded.role);

      // حفظ بيانات المستخدم من الـ response مباشرة
      localStorage.setItem('firstName', userData.firstName || '');
      localStorage.setItem('lastName', userData.lastName || '');
      localStorage.setItem('email', userData.email || '');

      this.tokenSubject.next(token);
    } catch (err) {
      console.error('خطأ في فك التوكن:', err);
    }
  }

  get currentUser() {
    return {
      id: localStorage.getItem('userId'),
      firstName: localStorage.getItem('firstName'),
      lastName: localStorage.getItem('lastName'),
      email: localStorage.getItem('email'),
      role: localStorage.getItem('role'),
    };
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.clear();
    this.tokenSubject.next(null);
  }
}

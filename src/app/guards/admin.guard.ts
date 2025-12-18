import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    // يتأكد أولاً إن المستخدم مسجل دخول
    const isLoggedIn = this.auth.isLoggedIn();

    if (!isLoggedIn) {
      console.log('❌ Access denied: not logged in');
      this.router.navigate(['/login']);
      return false;
    }

    // لو داخل، يتأكد إنه أدمن
    if (this.auth.isAdmin()) {
      console.log('✅ Access granted: admin verified');
      return true;
    }

    // لو مش أدمن، يرجع للصفحة الرئيسية
    console.log('❌ Access denied: not admin');
    this.router.navigate(['/']);
    return false;
  }
}

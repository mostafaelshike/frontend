import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
email = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        const role = this.auth.getUserRole(); // 🔍 نجيب الدور بعد تسجيل الدخول

        if (role === 'admin') {
          // ✅ لو أدمن
          this.router.navigate(['/admin/allproduct']); 
        } else {
          // 👤 لو يوزر عادي
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء تسجيل الدخول';
      }
    });
  }
}

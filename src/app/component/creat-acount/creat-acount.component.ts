import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-creat-acount',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './creat-acount.component.html',
  styleUrl: './creat-acount.component.css'
})
export class CreatAcountComponent {

  firstname = '';
  lastname = '';
  email = '';
  password = '';
  confirmPassword = '';

  errorMessage = '';
  successMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.firstname || !this.lastname || !this.email || !this.password) {
      this.errorMessage = 'من فضلك املأ جميع الحقول';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'كلمة المرور غير متطابقة';
      return;
    }

    const userData = {
      firstname: this.firstname.trim(),
      lastname: this.lastname.trim(),
      email: this.email.trim(),
      password: this.password
    };

    this.auth.register(userData).subscribe({
      next: () => {
        this.successMessage = 'تم إنشاء الحساب بنجاح ✅';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message || 'حدث خطأ أثناء إنشاء الحساب';
      }
    });
  }
}

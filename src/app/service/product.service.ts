import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; // أضفنا tap للفحص
import { AuthService } from './auth.service';
import { environment } from '../../environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // الرابط الأساسي للمنتجات
  private apiUrl = `${environment.apiUrl}/products`;
  
  constructor(private http: HttpClient, private auth: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    // إذا لم يتوفر التوكن، نرسل هيدر فارغ أو نتعامل مع الخطأ حسب سياسة الباك إند
    return new HttpHeaders({ 
      Authorization: token ? `Bearer ${token}` : '' 
    });
  }

  // جلب كل المنتجات
  getAllProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap(res => console.log('Products fetched:', res)), // للفحص في الكونسول
      catchError(err => {
        console.error('API Error (Get All):', err);
        return throwError(() => err);
      })
    );
  }

  // إنشاء منتج
  createProduct(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => throwError(() => err))
    );
  }

  // تحديث منتج
  updateProduct(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => throwError(() => err))
    );
  }

  // حذف منتج
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => throwError(() => err))
    );
  }

  // جلب منتج واحد بالتفاصيل
  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }
}
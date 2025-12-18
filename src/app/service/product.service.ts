import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environment';
@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = environment.apiUrl + '/products';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    if (!token) throw new Error('No token found. Please log in.');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  createProduct(formData: FormData): Observable<any> {
    if (!formData.has('sectionType')) {
      console.warn('⚠️ sectionType is missing in FormData');
    }
    return this.http.post(this.apiUrl, formData, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('❌ Error creating product:', err);
        return throwError(() => err);
      })
    );
  }

  updateProduct(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => throwError(() => err))
    );
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }
}

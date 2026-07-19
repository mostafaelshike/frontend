import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { AuthService } from './auth.service';

// تعريف نوع المنتج في السلة
export interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
  name: string;
  price: number;   // بدل ما كان price? خليها price
  image: string;
}


// تعريف نوع الطلب
export interface Order {
  _id: string;
  items: CartItem[];
  status?: string;
  total?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://backend-coral-three-89.vercel.app/orders';

  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = this.auth.getToken() || '';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
  }

  /** ======================= Cart Management ======================= */

  setCart(items: CartItem[]): void {
    this.cartSubject.next(items);
    this.updateCartCount(items);
  }

  private updateCartCount(items: CartItem[]): void {
    const count = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
    this.cartCountSubject.next(count);
  }

  loadCartCount(): void {
    this.getCurrentOrder().subscribe({
      next: (order: Order) => this.setCart(order?.items || []),
      error: () => this.setCart([])
    });
  }

  getCurrentOrder(): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/my/current`, this.getHeaders()).pipe(
      tap(order => this.setCart(order.items || []))
    );
  }

  /** ======================= Cart Operations ======================= */

  addItemToCart(productId: string, quantity: number = 1, size: string = ''): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/add-to-cart`, { productId, quantity, size }, this.getHeaders()).pipe(
      tap(order => this.setCart(order.items || []))
    );
  }

  removeItemFromCart(productId: string): Observable<Order> {
    return this.http.delete<Order>(`${this.apiUrl}/remove-from-cart/${productId}`, this.getHeaders()).pipe(
      tap(order => this.setCart(order.items || []))
    );
  }

  updateProductQuantity(orderId: string, productId: string, quantity: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/product/${productId}`, { quantity }, this.getHeaders()).pipe(
      tap(order => this.setCart(order.items || []))
    );
  }

  updateCartItems(items: CartItem[]): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/update-cart`, { items }, this.getHeaders()).pipe(
      tap(order => this.setCart(order.items || items))
    );
  }

  confirmOrder(orderId: string, details: {
    fullName: string;
    phone: string;
    city: string;
    street: string;
    country: string;
    paymentMethod: 'cash' | 'card';
    notes?: string;
  }): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/confirm`, details, this.getHeaders());
  }
  getMyOrders(): Observable<Order[]> {
  return this.http.get<Order[]>(`${this.apiUrl}/my`, this.getHeaders());
}

}

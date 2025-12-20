import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environment';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // رابط API الخاص بالطلبات
  private apiUrl = `${environment.apiUrl}/orders`;

  // BehaviorSubject لتتبع السلة محليًا
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  // تحديث السلة محليًا
  setCart(items: any[]): void {
    this.cartSubject.next(items);
  }

  // إعداد الـ Headers مع التوكن
  private getHeaders(): { headers: HttpHeaders } {
    const token = this.auth.getToken() || '';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
  }

  // === طلبات المستخدم العادي ===

  // جلب السلة الحالية (pending)
  getCurrentOrder(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my/current`, this.getHeaders());
  }

  // جلب كل طلبات المستخدم
  getMyOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my`, this.getHeaders());
  }

  // إنشاء سلة جديدة أو تحديثها
  createOrder(order: any): Observable<any> {
    const formattedOrder = {
      products: order.products.map((p: any) => ({
        productId: p.productId || p.product || '',
        quantity: p.quantity || 1,
        size: p.size || ''
      }))
    };
    return this.http.post(this.apiUrl, formattedOrder, this.getHeaders());
  }

  // إضافة عنصر للسلة
  addItemToCart(productId: string, quantity: number = 1, size: string = ''): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/add-to-cart`,
      { productId, quantity, size },
      this.getHeaders()
    );
  }

  // إزالة عنصر من السلة
  removeItemFromCart(productId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/remove-from-cart/${productId}`,
      this.getHeaders()
    );
  }

  // تحديث كل السلة دفعة واحدة
  updateCartItems(items: any[]): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/update-cart`,
      { items },
      this.getHeaders()
    );
  }

  // تأكيد الطلب (تحويله من pending إلى processing)
  confirmOrder(
    orderId: string,
    details: {
      fullName: string;
      phone: string;
      city: string;
      street: string;
      country: string;
      notes?: string;
      paymentMethod: 'cash' | 'card';
    }
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${orderId}/confirm`,
      details,
      this.getHeaders()
    );
  }

  // === طلبات الأدمن ===

  // جلب كل الطلبات (للأدمن)
  getAllOrdersAdmin(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHeaders());
  }

  // جلب طلب معين للأدمن (مع populate كامل)
  getOrderForAdmin(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orderId}/admin`, this.getHeaders());
  }

  // تحديث الطلب من الأدمن (كميات، حالة، شحن، ملاحظات)
  updateOrderAdmin(orderId: string, updates: {
    items?: any[];
    status?: string;
    shippingPrice?: number;
    adminNote?: string;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/admin`, updates, this.getHeaders());
  }

  // تغيير حالة الطلب (إذا كان لديك route منفصل)
  updateOrderStatus(orderId: string, newStatus: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${orderId}/status`,
      { status: newStatus },
      this.getHeaders()
    );
  }

  // إلغاء الطلب
  cancelOrder(orderId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/cancel`, {}, this.getHeaders());
  }

  // حذف الطلب نهائيًا
  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${orderId}`, this.getHeaders());
  }

  // تحديث كمية منتج معين داخل الطلب
  updateProductQuantity(orderId: string, productId: string, quantity: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${orderId}/product/${productId}`,
      { quantity },
      this.getHeaders()
    );
  }
}
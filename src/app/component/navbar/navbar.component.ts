import { Component, OnInit } from '@angular/core'; // أضفنا OnInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";

import { OrderService } from '../../service/order.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ], // أضفنا RouterLinkActive
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit { // تنفيذ OnInit
  isCartOpen = false;
  cartItems: any[] = [];
  isMenuOpen = false;
  totalPrice = 0;
  cartCount = 0;

  constructor(
    public auth: AuthService,      // جعلناه public لاستخدامه في الـ HTML
    private orderService: OrderService,
    private router: Router
  ) {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        if (window.innerWidth > 991) {
          this.closeMenu();
        }
      });
    }
  }

  ngOnInit(): void {
    // مراقبة السلة لحظياً من السيرفس
    this.orderService.cart$.subscribe(items => {
      this.cartItems = items;
      this.updateCartSummary();
    });

    // جلب السلة فور تسجيل الدخول
    if (this.auth.isLoggedIn()) {
      this.loadUserCart();
    }
  }

  loadUserCart() {
    this.orderService.getCurrentOrder().subscribe({
      next: (res) => {
        // نحدث السيرفس بالبيانات القادمة من الباك إند (res.product.products)
        if (res?.product?.products) {
          this.orderService.setCart(res.product.products);
        }
      },
      error: (err) => console.error('Error loading cart:', err)
    });
  }

  updateCartSummary() {
    this.cartCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    this.totalPrice = this.cartItems.reduce((total, item) => 
      total + (item.productId.price * item.quantity), 0);
  }

  // دوال التحكم الإضافية التي يحتاجها الـ HTML الجديد
  increaseQty(productId: string, currentQty: number, size: string) {
    this.orderService.addItemToCart(productId, 1, size).subscribe(() => this.loadUserCart());
  }

  decreaseQty(productId: string, currentQty: number, size: string) {
    if (currentQty > 1) {
      this.orderService.addItemToCart(productId, -1, size).subscribe(() => this.loadUserCart());
    }
  }

  removeItem(productId: string) {
    this.orderService.removeItemFromCart(productId).subscribe(() => this.loadUserCart());
  }

  openMenu() { this.isMenuOpen = true; }
  closeMenu() { this.isMenuOpen = false; }

  openCart() { 
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.isCartOpen = true; 
    this.loadUserCart();
  }
  
  closeCart() { this.isCartOpen = false; }
  
  goToCheckout() {
    this.closeCart();
    this.router.navigate(['/checkout']);
  }
}
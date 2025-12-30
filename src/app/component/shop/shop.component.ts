import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../service/product.service';
import { OrderService } from '../../service/order.service';
import { AuthService } from '../../service/auth.service';
import { Router, RouterModule } from '@angular/router'; // استيراد RouterModule أيضاً للـ HTML

@Component({
  selector: 'app-shop',
  standalone: true,
  // 1. أضفنا RouterModule بدلاً من Router هنا لأنه هو المسؤول عن التوجيه في الـ HTML
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  allProducts: any[] = [];
  filteredProducts: any[] = [];
  selectedProduct: any = null;
  selectedImageIndex: number = 0;

  categories = ["Bandage", "Covid Mask", "Injection", "Medikit", "Personal care", "Sanitizer", "Stethoscope", "Thermometer"];
  selectedCategory: string = '';
  minPrice: number = 0;
  maxPrice: number = 10000;

  constructor(
    private productService: ProductService, 
    private orderService: OrderService, // حقن الخدمة
    private auth: AuthService,           // حقن خدمة الأمان
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        if (res?.products) {
          this.allProducts = res.products;
          this.filteredProducts = res.products;
          if (this.allProducts.length > 0) {
            this.maxPrice = Math.max(...this.allProducts.map(p => p.price));
          }
        }
      },
      error: err => console.error(err)
    });
  }

  // --- دالة إضافة المنتج للسلة ---
  addToCart(product: any) {
    // 1. التأكد من تسجيل الدخول أولاً
    if (!this.auth.isLoggedIn()) {
      alert('يرجى تسجيل الدخول أولاً للإضافة إلى السلة');
      this.router.navigate(['/login']);
      return;
    }

    // 2. تحديد مقاس افتراضي إذا كان المنتج يدعم المقاسات (أو نتركه فارغاً)
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : '';

    // 3. استدعاء السيرفس
    this.orderService.addItemToCart(product._id, 1, size).subscribe({
      next: (res) => {
        alert('تم إضافة المنتج بنجاح! 🎉');
        // تحديث السلة في النافبار تلقائياً
        this.orderService.getCurrentOrder().subscribe(cartRes => {
          if (cartRes?.product?.products) {
            this.orderService.setCart(cartRes.product.products);
          }
        });
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        alert('حدث خطأ أثناء الإضافة');
      }
    });
  }

  applyFilters() {
    this.filteredProducts = this.allProducts.filter(p => {
      const matchCat = this.selectedCategory ? p.category === this.selectedCategory : true;
      const matchPrice = p.price >= this.minPrice && p.price <= this.maxPrice;
      return matchCat && matchPrice;
    });
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  resetFilters() {
    this.selectedCategory = '';
    this.minPrice = 0;
    this.maxPrice = this.allProducts.length > 0 ? Math.max(...this.allProducts.map(p => p.price)) : 10000;
    this.filteredProducts = this.allProducts;
  }

  openQuickView(product: any): void {
    this.selectedProduct = product;
    this.selectedImageIndex = 0;
    const modalEl = document.getElementById('productModal');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  goToDetails(id: string | undefined) {
    if (!id) return;
    this.router.navigate(['/detailsproduct', id]);
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-allproduct',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './allproduct.component.html',
  styleUrl: './allproduct.component.css'
})
export class AllproductComponent implements OnInit {
  products: any[] = [];
  loading = true;
  errorMessage = '';
  // رابط الباك إند على ريلواي
  private baseUrl = 'https://backend-production-c9008.up.railway.app';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        // بما أن الباك إند يرسل { success: true, products: [...] }
        this.products = res.products || []; 
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.errorMessage = 'فشل في تحميل المنتجات، تأكد من اتصال السيرفر.';
        this.loading = false;
      }
    });
  }

  // إنشاء رابط الصورة الكامل
  getImageUrl(img: string) {
    if (!img) return 'assets/no-image.png'; // صورة افتراضية
    // إذا كانت الصورة مخزنة بمسار يبدأ بـ /uploads
    return `${this.baseUrl}${img}`;
  }

  createProduct() {
    this.router.navigate(['/admin/createproduct']);
  }

  editProduct(id: string) {
    this.router.navigate(['/admin/updateproduct', id]);
  }

  deleteProduct(id: string) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          // تحديث القائمة فوراً بعد الحذف
          this.products = this.products.filter(p => p._id !== id);
          alert('تم حذف المنتج بنجاح');
        },
        error: (err) => alert('حدث خطأ أثناء الحذف: ' + err.message)
      });
    }
  }
}
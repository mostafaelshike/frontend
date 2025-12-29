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

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        this.products = res.products || res;
        this.loading = false;
        console.log('📦 المنتجات المحملة:', this.products);
      },
      error: (err) => {
        console.error('❌ خطأ جلب البيانات:', err);
        this.errorMessage = 'تعذر تحميل المنتجات من السيرفر.';
        this.loading = false;
      }
    });
  }

  /**
   * ✅ دالة عرض الصور (مع Cloudinary - أحسن حل)
   */
  getImageUrl(img: any): string {
    if (!img || typeof img !== 'string') {
      return 'assets/no-image.png';
    }

    // Cloudinary رابط كامل ومحسن تلقائيًا
    return img;
  }

  createProduct() {
    this.router.navigate(['/admin/createproduct']);
  }

  editProduct(id: string) {
    if (id) this.router.navigate(['/admin/updateproduct', id]);
  }

  deleteProduct(id: string) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p._id !== id);
          alert('تم الحذف بنجاح');
        },
        error: (err) => alert('فشل الحذف، تأكد من الصلاحيات.')
      });
    }
  }
}
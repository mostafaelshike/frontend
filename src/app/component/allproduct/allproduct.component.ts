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
  
  // ✅ رابط السيرفر على ريلواي
  private serverUrl = 'https://backend-production-c9008.up.railway.app';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        // استخراج المصفوفة حسب هيكلة الباك إند
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
   * ✅ دالة معالجة روابط الصور (الحل النهائي)
   */
getImageUrl(img: any): string {
  if (!img) return 'assets/no-image.png'; // صورة افتراضية لو مفيش صورة

  // 1. إذا كان الرابط من Uploadcare (يحتوي على ucarecdn)
  if (img.includes('ucarecdn.com')) {
    // التأكد من وجود /-/preview/ لضمان العرض
    if (!img.includes('/-/preview/')) {
      return img.replace('/-/', '/-/preview/-/');
    }
    return img;
  }

  // 2. إذا كان رابطاً كاملاً آخر (مثل Cloudinary أو غيره)
  if (img.startsWith('http')) return img;

  // 3. إذا كان مساراً محلياً (مثلاً من مجلد uploads)
  let cleanPath = img.replace(/\\/g, '/');
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }
  return `${this.serverUrl}${cleanPath}`;
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
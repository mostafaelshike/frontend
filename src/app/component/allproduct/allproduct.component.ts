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
  if (!img) return 'assets/no-image.png';

  // إذا كان الرابط من Uploadcare
  if (img.includes('ucarecdn.com')) {
    // لو الرابط فيه بالفعل تحسينات كافية (resize أو preview مع أبعاد)، نرجعه كما هو
    if (img.includes('/-/resize/') || img.includes('/-/preview/') && img.match(/\/\d+x\d+\//)) {
      return img;
    }

    // نستخرج الـ UUID ونبني رابط مضمون وسريع
    const uuidMatch = img.match(/ucarecdn\.com\/([a-f0-9\-]+)\//);
    if (uuidMatch) {
      const uuid = uuidMatch[1];
      // أفضل رابط: حجم مناسب + تحسين تلقائي + webp دعم
      return `https://ucarecdn.com/${uuid}/-/resize/400x400/-/format/auto/-/quality/smart/`;
    }

    // fallback لو حصل خطأ في الاستخراج
    return img;
  }

  // روابط قديمة محلية أو خارجية
  if (img.startsWith('http')) return img;
  return `${this.serverUrl}/${img.replace(/\\/g, '/')}`;
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
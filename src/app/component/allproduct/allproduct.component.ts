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
  getImageUrl(img: string): string {
    if (!img) return 'assets/no-image.png'; 

    // 1. إذا كان رابطاً كاملاً يبدأ بـ http، نرجعه كما هو
    if (img.startsWith('http')) return img;

    // 2. معالجة مشكلة الـ Backslash (\) وتحويلها لـ (/) لكي يفهمها الـ Browser
    // هذه الخطوة تحل مشكلة المسارات القادمة من ويندوز (uploads\image.jpg)
    let cleanPath = img.replace(/\\/g, '/');

    // 3. التأكد من وجود سلاش واحد فقط في البداية
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }

    // 4. دمج الرابط النهائي
    const finalUrl = `${this.serverUrl}${cleanPath}`;
    
    return finalUrl;
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
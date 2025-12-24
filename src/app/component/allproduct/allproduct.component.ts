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
  
  // ✅ الرابط الأساسي للسيرفر (بدون سلاش في النهاية)
  private serverUrl = 'https://backend-production-c9008.up.railway.app';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        // ✅ التأكد من استخراج المصفوفة بشكل صحيح
        if (res && res.products) {
          this.products = res.products;
        } else if (Array.isArray(res)) {
          this.products = res;
        } else {
          this.products = [];
        }
        
        this.loading = false;
        console.log('المنتجات المحملة:', this.products);
      },
      error: (err) => {
        console.error('خطأ أثناء جلب البيانات:', err);
        this.errorMessage = 'فشل في تحميل المنتجات. تأكد من تشغيل السيرفر ومن إعدادات CORS.';
        this.loading = false;
      }
    });
  }

  // ✅ تحسين دالة جلب الصور لتجنب تكرار السلاش أو المسارات الخاطئة
  getImageUrl(img: string): string {
    if (!img) return 'assets/no-image.png'; 
    
    // إذا كان المسار يبدأ بـ /uploads فنحن ندمجه مباشرة
    // أما إذا كان رابطاً كاملاً (URL) فنرجعه كما هو
    if (img.startsWith('http')) {
      return img;
    }
    
    // إزالة السلاش الإضافي إذا وجد في بداية المسار لتجنب //uploads
    const cleanImgPath = img.startsWith('/') ? img : `/${img}`;
    return `${this.serverUrl}${cleanImgPath}`;
  }

  createProduct() {
    this.router.navigate(['/admin/createproduct']);
  }

  editProduct(id: string) {
    // التأكد من تمرير المعرف بشكل صحيح
    if (id) {
      this.router.navigate(['/admin/updateproduct', id]);
    }
  }

  deleteProduct(id: string) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          // تحديث الواجهة فوراً بحذف المنتج محلياً
          this.products = this.products.filter(p => p._id !== id);
          alert('تم الحذف بنجاح');
        },
        error: (err) => {
          console.error('خطأ أثناء الحذف:', err);
          alert('فشل الحذف: قد لا تملك الصلاحية أو أن المنتج غير موجود.');
        }
      });
    }
  }
}
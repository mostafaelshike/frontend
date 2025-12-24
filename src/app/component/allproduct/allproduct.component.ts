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
  
  // رابط الباك إند على ريلواي لتركيب مسار الصور
  private serverUrl = 'https://backend-production-c9008.up.railway.app';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        // ✅ الباك إند يرسل { success: true, products: [...] }
        // نستخرج المصفوفة من res.products
        this.products = res.products || []; 
        this.loading = false;
        console.log('Data loaded:', this.products);
      },
      error: (err) => {
        console.error('Fetch Error:', err);
        this.errorMessage = 'فشل في تحميل المنتجات. تأكد من تشغيل السيرفر.';
        this.loading = false;
      }
    });
  }

  // ✅ بناء رابط الصورة: المسار مخزن في القاعدة كـ /uploads/name.jpg
  getImageUrl(img: string) {
    if (!img) return 'assets/no-image.png'; 
    return `${this.serverUrl}${img}`;
  }

  createProduct() {
    this.router.navigate(['/admin/createproduct']);
  }

  editProduct(id: string) {
    this.router.navigate(['/admin/updateproduct', id]);
  }

  deleteProduct(id: string) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p._id !== id);
          alert('تم الحذف بنجاح');
        },
        error: (err) => alert('خطأ أثناء الحذف: ' + err.message)
      });
    }
  }
}
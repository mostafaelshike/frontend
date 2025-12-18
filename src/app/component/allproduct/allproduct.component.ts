import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-allproduct',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ],
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
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  // إضافة الدالة لإرجاع رابط كامل للصورة
  getImageUrl(img: string) {
    return `http://localhost:5000${img}`; // غير 5000 إلى port السيرفر
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
        },
        error: (err) => alert('حدث خطأ أثناء الحذف: ' + err.message)
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  allProducts: any[] = [];
  filteredProducts: any[] = [];
  
  // قائمة التصنيفات
  categories = ["Bandage", "Covid Mask", "Injection", "Medikit", "Mom &baby", "Nutraceutical", "Personal care", "Sanitizer", "Stethoscope", "Thermometer"];
  
  // قيم الفلاتر الافتراضية
  selectedCategory: string = ''; // قيمة فارغة تعني "الكل"
  minPrice: number = 0;
  maxPrice: number = 10000; 

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        // فك تغليف المصفوفة من داخل الـ Object (res.products)
        if (res && res.products) {
          this.allProducts = res.products;
          this.filteredProducts = res.products;
          
          // تحديث السعر الأقصى تلقائياً بناءً على أغلى منتج متاح
          if (this.allProducts.length > 0) {
            this.maxPrice = Math.max(...this.allProducts.map(p => p.price));
          }
        }
      },
      error: (err) => console.error('خطأ في جلب البيانات:', err)
    });
  }

  applyFilters() {
    this.filteredProducts = this.allProducts.filter(p => {
      // إذا كانت selectedCategory فارغة، يعتبر الشرط محقق للكل
      const matchCat = this.selectedCategory ? p.category === this.selectedCategory : true;
      const matchPrice = p.price >= this.minPrice && p.price <= this.maxPrice;
      return matchCat && matchPrice;
    });
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat; // إذا ضغطنا على All نرسل ''
    this.applyFilters();
  }

  resetFilters() {
    this.selectedCategory = '';
    this.minPrice = 0;
    // إعادة ضبط السعر الأقصى لأعلى سعر موجود
    this.maxPrice = Math.max(...this.allProducts.map(p => p.price)) || 10000;
    this.filteredProducts = this.allProducts;
  }
}
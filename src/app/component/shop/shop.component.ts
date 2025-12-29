import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../service/product.service';

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

  // المودال
  selectedProduct: any = null;
  selectedImageIndex: number = 0;

  categories = [
    "Bandage",
    "Covid Mask",
    "Injection",
    "Medikit",
    "Personal care",
    "Sanitizer",
    "Stethoscope",
    "Thermometer"
  ];

  selectedCategory: string = '';
  minPrice: number = 0;
  maxPrice: number = 10000;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        if (res?.products) {
          this.allProducts = res.products;
          this.filteredProducts = res.products;
          this.maxPrice = Math.max(...this.allProducts.map(p => p.price));
        }
      },
      error: err => console.error(err)
    });
  }

  applyFilters() {
    this.filteredProducts = this.allProducts.filter(p => {
      const matchCat = this.selectedCategory
        ? p.category === this.selectedCategory
        : true;

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
    this.maxPrice = Math.max(...this.allProducts.map(p => p.price)) || 10000;
    this.filteredProducts = this.allProducts;
  }

  // فتح المودال مع التحكم بالصور المصغرة
  openQuickView(product: any): void {
    this.selectedProduct = product;
    this.selectedImageIndex = 0; // أول صورة عند فتح المودال

    const modalEl = document.getElementById('productModal');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  // اختيار صورة من الـ thumbnails
  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

}

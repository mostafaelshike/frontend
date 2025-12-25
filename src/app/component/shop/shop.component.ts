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
  selectedProductForModal: any = null; // للمودال
  
  categories = ["Bandage", "Covid Mask", "Injection", "Medikit", "Personal care", "Sanitizer", "Stethoscope", "Thermometer"];
  
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
        if (res && res.products) {
          this.allProducts = res.products;
          this.filteredProducts = res.products;
          // تعيين أقصى سعر بناءً على المنتجات
          if (this.allProducts.length > 0) {
            this.maxPrice = Math.max(...this.allProducts.map(p => p.price));
          }
        }
      },
      error: (err) => console.error('Error fetching products', err)
    });
  }

  applyFilters() {
    this.filteredProducts = this.allProducts.filter(p => {
      const matchCat = this.selectedCategory ? p.category === this.selectedCategory : true;
      const matchPrice = p.price >= this.minPrice && p.price <= this.maxPrice;
      return matchCat && matchPrice;
    });
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  openQuickView(product: any) {
    this.selectedProductForModal = product;
  }

  resetFilters() {
    this.selectedCategory = '';
    this.minPrice = 0;
    this.maxPrice = Math.max(...this.allProducts.map(p => p.price)) || 10000;
    this.filteredProducts = this.allProducts;
  }
}
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  imports: [CommonModule,FormsModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  allProducts: any[] = [];
  filteredProducts: any[] = [];
  
  // الفلاتر
  categories = ["Bandage", "Covid Mask", "Injection", "Medikit", "Personal care", "Sanitizer", "Stethoscope", "Thermometer"];
  selectedCategory: string = '';
  minPrice: number = 0;
  maxPrice: number = 2000; // قيمة افتراضية عليا

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.allProducts = res;
        this.filteredProducts = res;
      },
      error: (err) => console.error('Error loading products', err)
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
    this.selectedCategory = (this.selectedCategory === cat) ? '' : cat;
    this.applyFilters();
  }

  resetFilters() {
    this.selectedCategory = '';
    this.minPrice = 0;
    this.maxPrice = 2000;
    this.filteredProducts = this.allProducts;
  }
}
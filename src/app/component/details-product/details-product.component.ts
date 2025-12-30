import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../service/product.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// تعريف bootstrap للـ TypeScript
declare var bootstrap: any;
@Component({
  selector: 'app-details-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './details-product.component.html',
  styleUrl: './details-product.component.css'
})
export class DetailsProductComponent implements OnInit {
  product: any = null;
  selectedImage: string = '';
  qty: number = 1;
  selectedSize: string = '';
  btnHover: boolean = false;

  

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (res) => {
          this.product = res;
          this.selectedImage = res.images?.[0] || 'assets/placeholder.png';
        },
        error: (err: any) => console.error(err)
      });
    }
  }

  // اختيار الصورة الصغيرة
  selectImage(img: string) {
    this.selectedImage = img;
  }

  // زيادة / نقص الكمية
  increaseQty() { this.qty++; }
  decreaseQty() { if (this.qty > 1) this.qty--; }

  // اختيار المقاس


 

  }

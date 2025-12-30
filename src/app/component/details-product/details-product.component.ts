import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-details-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './details-product.component.html',
  styleUrl: './details-product.component.css'
})
export class DetailsProductComponent implements OnInit {
  product: any = null;
  selectedImage: string = '';
  qty: number = 1;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (res) => {
          // الباك إند يرسل المنتج داخل كائن product
          this.product = res.product;
          if (this.product && this.product.images?.length > 0) {
            this.selectedImage = this.product.images[0];
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching product:', err);
          this.loading = false;
        }
      });
    }
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  increaseQty() { this.qty++; }
  decreaseQty() { if (this.qty > 1) this.qty--; }

  addToCart() {
    console.log('تمت الإضافة للسلة:', { product: this.product.name, quantity: this.qty });
    // هنا يمكنك استدعاء CartService لاحقاً
  }
}
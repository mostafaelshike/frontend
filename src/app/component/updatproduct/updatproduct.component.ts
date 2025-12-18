import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './updatproduct.component.html',
  styleUrls: ['./updatproduct.component.css']
})
export class UpdatproductComponent implements OnInit {

  productForm!: FormGroup;
  productId!: string;

  loading = false;

  selectedFiles: File[] = [];
  existingImages: string[] = [];
  previewImages: string[] = [];

  categories: string[] = [
    "Bandage", "Covid Mask", "Feature Product", "Injection", "Medikit",
    "Mom &baby", "Nutraceutical", "Personal care",
    "Sanitizer", "Stethoscope", "Thermometer"
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadProduct();
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      inStock: [true]
    });
  }

  loadProduct() {
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          inStock: product.inStock
        });

        this.existingImages = product.images || [];
        this.previewImages = this.existingImages.map(
          (img: string) => `http://localhost:5000${img}`
        );
      },
      error: (err) => console.error('❌ Error loading product:', err)
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.selectedFiles = Array.from(input.files).slice(0, 4);

    // تحديث المعاينات الجديدة فقط
    const newPreviews = this.selectedFiles.map(file => URL.createObjectURL(file));
    this.previewImages = [...this.existingImages.map(img => `http://localhost:5000${img}`), ...newPreviews];
  }

  removeExistingImage(index: number) {
    if (confirm('هل تريد حذف هذه الصورة؟')) {
      this.existingImages.splice(index, 1);
      this.previewImages.splice(index, 1);
    }
  }

  onSubmit() {
    if (this.productForm.invalid) {
      alert('⚠️ أكمل كل الحقول المطلوبة');
      return;
    }

    const formData = new FormData();

    Object.entries(this.productForm.value).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    formData.append('existingImages', JSON.stringify(this.existingImages));
    this.selectedFiles.forEach(file => formData.append('images', file));

    this.loading = true;

    this.productService.updateProduct(this.productId, formData).subscribe({
      next: () => {
        this.loading = false;
        alert('✅ تم تحديث المنتج بنجاح');
        this.router.navigate(['admin/allproduct']);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        alert('❌ فشل تحديث المنتج');
      }
    });
  }
}

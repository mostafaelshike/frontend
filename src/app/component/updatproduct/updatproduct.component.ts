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
  existingImages: string[] = []; // المسارات القادمة من السيرفر
  previewImages: string[] = [];  // الروابط الكاملة للعرض

  // الرابط الخاص بالسيرفر على ريلواي
  private serverUrl = 'https://backend-production-c9008.up.railway.app';

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
      next: (res: any) => {
        // الوصول للبيانات من res.product كما يرسلها الباك إند
        const product = res.product || res;
        
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          inStock: product.inStock
        });

        this.existingImages = product.images || [];
        this.updatePreviewList();
      },
      error: (err) => console.error('❌ Error loading product:', err)
    });
  }

  // تحديث قائمة المعاينة لتشمل الصور القديمة والجديدة
  updatePreviewList() {
    const existingPreviews = this.existingImages.map(img => 
      img.startsWith('http') ? img : `${this.serverUrl}${img}`
    );
    
    const newPreviews = this.selectedFiles.map(file => URL.createObjectURL(file));
    this.previewImages = [...existingPreviews, ...newPreviews];
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.selectedFiles = Array.from(input.files).slice(0, 4);
    this.updatePreviewList();
  }

  removeExistingImage(index: number) {
    // إذا كان المؤشر يشير لصورة قديمة
    if (index < this.existingImages.length) {
      this.existingImages.splice(index, 1);
    } else {
      // إذا كان يشير لصورة مختارة حديثاً
      const newIndex = index - this.existingImages.length;
      this.selectedFiles.splice(newIndex, 1);
    }
    this.updatePreviewList();
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

    // إرسال مصفوفة الصور التي بقيت ولم تُحذف
    formData.append('existingImages', JSON.stringify(this.existingImages));
    
    // إضافة الصور الجديدة
    this.selectedFiles.forEach(file => formData.append('images', file));

    this.loading = true;
    this.productService.updateProduct(this.productId, formData).subscribe({
      next: () => {
        this.loading = false;
        alert('✅ تم تحديث المنتج بنجاح');
        this.router.navigate(['/admin/allproduct']);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        alert('❌ فشل تحديث المنتج');
      }
    });
  }
}
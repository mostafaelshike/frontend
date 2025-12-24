import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // أضفنا ChangeDetectorRef للتأكد من التحديث
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
  fetchingData = true; // مؤشر خاص بجلب البيانات في البداية

  selectedFiles: File[] = [];
  existingImages: string[] = []; 
  previewImages: string[] = [];  

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
    private productService: ProductService,
    private cdr: ChangeDetectorRef // لاكتشاف التغييرات يدوياً إذا لزم الأمر
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    if (this.productId) {
      this.loadProduct();
    }
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      inStock: [true]
    });
  }

  loadProduct() {
    this.fetchingData = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (res: any) => {
        console.log('📦 Raw response from server:', res);

        // ✅ محاولة استخراج المنتج بأكثر من طريقة لضمان الوصول إليه
        const product = res.product || res.data || res;

        if (product && product.name) {
          // ✅ ملء الفورم مع استخدام "emitEvent: true" للتأكد من التحديث
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            inStock: product.inStock
          });

          this.existingImages = product.images || [];
          this.updatePreviewList();
          
          console.log('✅ Form populated successfully');
        } else {
          console.error('❌ Product data structure is not as expected');
        }
        
        this.fetchingData = false;
        this.cdr.detectChanges(); // إجبار الأنجولار على تحديث الواجهة
      },
      error: (err) => {
        console.error('❌ Error fetching product details:', err);
        this.fetchingData = false;
        alert('فشل في تحميل بيانات المنتج، قد يكون الرابط غير صحيح.');
      }
    });
  }

  updatePreviewList() {
    const existingPreviews = this.existingImages.map(img => 
      img.startsWith('http') ? img : `${this.serverUrl}${img}`
    );
    const newPreviews = this.selectedFiles.map(file => URL.createObjectURL(file));
    this.previewImages = [...existingPreviews, ...newPreviews];
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files).slice(0, 4);
      this.updatePreviewList();
    }
  }

  removeExistingImage(index: number) {
    if (index < this.existingImages.length) {
      this.existingImages.splice(index, 1);
    } else {
      const newIndex = index - this.existingImages.length;
      this.selectedFiles.splice(newIndex, 1);
    }
    this.updatePreviewList();
  }

  onSubmit() {
    if (this.productForm.invalid) {
      alert('⚠️ يرجى التأكد من ملء جميع الحقول بشكل صحيح');
      return;
    }

    const formData = new FormData();
    // تحويل القيم إلى نصوص لضمان قبولها في FormData
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('description', this.productForm.get('description')?.value);
    formData.append('price', this.productForm.get('price')?.value.toString());
    formData.append('category', this.productForm.get('category')?.value);
    formData.append('inStock', this.productForm.get('inStock')?.value.toString());

    formData.append('existingImages', JSON.stringify(this.existingImages));
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
        console.error('Update error:', err);
        alert('❌ حدث خطأ أثناء التحديث');
      }
    });
  }
}
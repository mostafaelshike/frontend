import { Component, OnDestroy } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-creat-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './creatproduct.component.html',
  styleUrls: ['./creatproduct.component.css']
})
export class CreatproductComponent implements OnDestroy {

  product: any = {
    name: '',
    description: '',
    price: null,
    category: '',
    inStock: true,
  };

  categories: string[] = [
    "Bandage", "Covid Mask", "Feature Product", "Injection", "Medikit",
    "Mom & baby", "Nutraceutical", "Personal care",
    "Sanitizer", "Stethoscope", "Thermometer"
  ];

  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  loading = false;

  constructor(private productService: ProductService) {}

  // 📸 اختيار الصور
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const filesArray = Array.from(input.files);

    // ⛔ حد أقصى 5 صور (نفس الباك إند)
    if (this.selectedFiles.length + filesArray.length > 5) {
      alert('الحد الأقصى هو 5 صور فقط');
      return;
    }

    filesArray.forEach(file => {
      // تأكد إنه صورة
      if (!file.type.startsWith('image/')) return;

      this.selectedFiles.push(file);
      this.previewUrls.push(URL.createObjectURL(file));
    });

    // مهم: إعادة تعيين input علشان يسمح باختيار نفس الصورة مرة تانية
    input.value = '';
  }

  // ❌ حذف صورة
  removePreview(index: number) {
    URL.revokeObjectURL(this.previewUrls[index]);
    this.previewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  // 🚀 إرسال المنتج
  onSubmit() {
    if (!this.product.name || !this.product.price || !this.product.category) {
      alert('الرجاء إدخال الاسم والسعر والقسم');
      return;
    }

    if (this.selectedFiles.length === 0) {
      alert('من فضلك اختر صورة واحدة على الأقل');
      return;
    }

    this.loading = true;

    const formData = new FormData();

    // 🧾 بيانات المنتج
    formData.append('name', this.product.name.trim());
    formData.append('description', this.product.description?.trim() || '');
    formData.append('price', String(this.product.price));
    formData.append('category', this.product.category);
    formData.append('sectionType', this.product.category); // مهم للباك إند
    formData.append('inStock', String(this.product.inStock));

    // 🖼️ الصور (مهم جدًا الاسم = images)
    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    // 📡 API
    this.productService.createProduct(formData).subscribe({
      next: (res) => {
        console.log('✅ Created:', res);
        this.loading = false;
        alert('✅ تم إنشاء المنتج بنجاح');
        this.resetForm();
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Server Error:', err);
        alert(err?.error?.message || 'حدث خطأ في السيرفر');
      }
    });
  }

  // 🔄 إعادة تعيين
  private resetForm() {
    this.product = {
      name: '',
      description: '',
      price: null,
      category: '',
      inStock: true
    };

    this.selectedFiles = [];
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
    this.previewUrls = [];
  }

  ngOnDestroy() {
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
  }
}

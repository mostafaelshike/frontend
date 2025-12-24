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

  categories = [
    "Bandage", "Covid Mask", "Feature Product", "Injection", "Medikit",
    "Mom & baby", "Nutraceutical", "Personal care", "Sanitizer", "Stethoscope", "Thermometer"
  ];

  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  loading = false;

  constructor(private productService: ProductService) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const filesArray = Array.from(input.files);
    if (this.selectedFiles.length + filesArray.length > 4) {
      alert('الحد الأقصى هو 4 صور فقط');
      return;
    }

    filesArray.forEach(file => {
      this.selectedFiles.push(file);
      this.previewUrls.push(URL.createObjectURL(file));
    });
  }

  removePreview(index: number) {
    URL.revokeObjectURL(this.previewUrls[index]);
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  onSubmit() {
    // التحقق من الحقول الإجبارية
    if (!this.product.name || !this.product.price || !this.product.category) {
      alert('الرجاء إدخال الاسم والسعر والقسم على الأقل.');
      return;
    }

    this.loading = true;
    const formData = new FormData();

    // إضافة البيانات الأساسية
    formData.append('name', this.product.name);
    formData.append('description', this.product.description || '');
    formData.append('price', this.product.price.toString());
    formData.append('category', this.product.category);
    formData.append('inStock', this.product.inStock.toString());

    /** * ✅ إصلاح الخطأ: إضافة sectionType
     * السيرفر يطلب هذا الحقل، سنرسل القسم كنوع للقسم
     */
    formData.append('sectionType', this.product.category);

    // إضافة الصور (تأكد أن الباك إند يستخدم 'images' في Multer)
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => {
        formData.append('images', file);
      });
    }

    this.productService.createProduct(formData).subscribe({
      next: (res) => {
        this.loading = false;
        alert('✅ تم إنشاء المنتج بنجاح!');
        this.resetForm();
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Server Error Details:', err);
        // إظهار رسالة الخطأ القادمة من Railway
        const errorMsg = err.error?.message || 'حدث خطأ في السيرفر (500). تأكد من صحة البيانات.';
        alert(errorMsg);
      }
    });
  }

  private resetForm() {
    this.product = { name: '', description: '', price: null, category: '', inStock: true };
    this.selectedFiles = [];
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
    this.previewUrls = [];
  }

  ngOnDestroy() {
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
  }
}
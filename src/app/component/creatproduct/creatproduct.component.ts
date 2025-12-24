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
  loading = false; // لمتابعة حالة الإرسال

  constructor(private productService: ProductService) {}

  // رفع الصور ومعاينتها
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const filesArray = Array.from(input.files);
    
    if (filesArray.length + this.selectedFiles.length > 4) {
      alert('يمكنك رفع 4 صور كحد أقصى للمنتج الواحد');
      return;
    }

    filesArray.forEach(file => {
      this.selectedFiles.push(file);
      this.previewUrls.push(URL.createObjectURL(file));
    });
  }

  // إزالة صورة من المعاينة
  removePreview(index: number) {
    URL.revokeObjectURL(this.previewUrls[index]); // تحرير الذاكرة
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  // إرسال البيانات
  onSubmit() {
    if (!this.product.name || !this.product.description || this.product.price === null || !this.product.category) {
      alert('الرجاء ملء كافة الحقول الأساسية.');
      return;
    }

    if (this.selectedFiles.length === 0) {
      alert('الرجاء رفع صورة واحدة على الأقل للمنتج.');
      return;
    }

    this.loading = true;
    const formData = new FormData();
    
    // إضافة البيانات الأساسية
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('category', this.product.category);
    formData.append('inStock', this.product.inStock.toString());
    
    // إضافة حقل النوع (مهم للباك إند الخاص بك)
    formData.append('sectionType', this.product.category); 

    // إضافة الصور
    this.selectedFiles.forEach(file => {
      formData.append('images', file); // تأكد أن الباك إند يستقبل اسم 'images'
    });

    this.productService.createProduct(formData).subscribe({
      next: () => {
        this.loading = false;
        alert('✅ تم إضافة المنتج بنجاح وتوفره في المتجر!');
        this.resetForm();
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error creating product:', err);
        alert(err.error?.message || '❌ حدث خطأ أثناء الاتصال بالسيرفر.');
      }
    });
  }

  private resetForm() {
    this.product = { name: '', description: '', price: null, category: '', inStock: true };
    this.selectedFiles = [];
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
    this.previewUrls = [];
  }

  // تنظيف الروابط عند الخروج من الصفحة
  ngOnDestroy() {
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
  }
}
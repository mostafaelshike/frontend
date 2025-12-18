import { Component } from '@angular/core';
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
export class CreatproductComponent  {

  product: any = {
    name: '',
    description: '',
    price: null,
    category: '',
    inStock: true, // حالة المنتج
  };

  categories = [
    "Bandage", "Covid Mask","Feature Product","Injection","Medikit",
    "Mom &baby","Nutraceutical","Personal care","Sanitizer","Stethoscope","Thermometer"
  ];

  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  constructor(private productService: ProductService) {}

  // رفع الصور ومعاينة
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    // تنظيف المعاينات القديمة
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
    this.previewUrls = [];

    const filesArray = Array.from(input.files);
    if (filesArray.length > 4) {
      alert('يمكنك رفع 4 صور فقط');
    }

    this.selectedFiles = filesArray.slice(0, 4);
    this.previewUrls = this.selectedFiles.map(f => URL.createObjectURL(f));
  }

  // إزالة صورة من المعاينة
  removePreview(index: number) {
    if (index < 0 || index >= this.selectedFiles.length) return;
    URL.revokeObjectURL(this.previewUrls[index]);
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  // إرسال البيانات
  onSubmit() {
    if (
      !this.product.name ||
      !this.product.description ||
      this.product.price === null ||
      !this.product.category ||
      this.selectedFiles.length === 0
    ) {
      alert('الرجاء ملء جميع الحقول المطلوبة ورفع صورة واحدة على الأقل.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('category', this.product.category);
    formData.append('inStock', this.product.inStock.toString());

    this.selectedFiles.forEach(file => formData.append('images', file));

    this.productService.createProduct(formData).subscribe({
      next: () => {
        alert('✅ تم إنشاء المنتج بنجاح!');
        this.resetForm();
      },
      error: (err) => {
        console.error('❌ Error creating product:', err);
        alert(err.error?.message || '❌ حدث خطأ أثناء إنشاء المنتج.');
      }
    });
  }

  // إعادة تعيين النموذج
  private resetForm() {
    this.product = { name: '', description: '', price: null, category: '', inStock: true };
    this.selectedFiles = [];
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
    this.previewUrls = [];
  }
}

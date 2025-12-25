import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { ProductService } from '../../service/product.service';
import { CarouselModule } from 'primeng/carousel';
import { register } from 'swiper/element/bundle';
import AOS from 'aos';
import { RouterLink } from '@angular/router';

register();

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule,RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  @ViewChild('swiperRef') swiperRef!: ElementRef<any>;

  constructor(
    private elRef: ElementRef,
    private productService: ProductService
  ) {}

  // ===============================
  // Responsive
  // ===============================
  isMobile = false;

  checkScreen() {
    this.isMobile = window.innerWidth <= 1000;
  }

  // ===============================
  // Swiper Controls
  // ===============================
  nextSlide() {
    this.swiperRef.nativeElement.swiper.slideNext();
  }

  prevSlide() {
    this.swiperRef.nativeElement.swiper.slidePrev();
  }

  // ===============================
  // Slider Data
  // ===============================
  products = [
    {
      id: 1,
      name: 'Make your perfect smile even better',
      imageDesktop: 'assets/images/slider-1.webp',
      imageMobile: 'assets/images/mobile-slider-1.webp',
      prgraph: 'It is a long established fact that a reader will be distracted.'
    },
    {
      id: 2,
      name: 'Make your perfect smile even better',
      imageDesktop: 'assets/images/slider-2.webp',
      imageMobile: 'assets/images/mobile-slider-2.webp',
      prgraph: 'It is a long established fact that a reader will be distracted.'
    },
    {
      id: 3,
      name: 'Make your perfect smile even better',
      imageDesktop: 'assets/images/slider-3.webp',
      imageMobile: 'assets/images/mobile-slider-3.webp',
      prgraph: 'It is a long established fact that a reader will be distracted.'
    }
  ];

  // ===============================
  // Services Section
  // ===============================
  hoverService: { [key: number]: boolean } = {};

  service = [
    {
      id: 1,
      name: 'Bandage',
      imageDesktop: 'assets/images/band-aid.webp',
      hoverimage: 'assets/images/band-aid-1.webp',
      prgraph: '11 items'
    },
    {
      id: 2,
      name: 'Pressure',
      imageDesktop: 'assets/images/blood-pressure-gauge.webp',
      hoverimage: 'assets/images/blood-pressure-gauge-1.webp',
      prgraph: '8 items'
    },
    {
      id: 3,
      name: 'Sanitizer',
      imageDesktop: 'assets/images/hand-sanitizer.webp',
      hoverimage: 'assets/images/hand-sanitizer-1.webp',
      prgraph: '8 items'
    }
  ];

  // ===============================
  // Carousel Responsive
  // ===============================
  responsive: any[] = [
    { breakpoint: '1199px', numVisible: 4, numScroll: 1 },
    { breakpoint: '991px', numVisible: 4, numScroll: 1 },
    { breakpoint: '767px', numVisible: 2, numScroll: 1 },
    { breakpoint: '600px', numVisible: 1, numScroll: 1 }
  ];

  // ===============================
  // Products (8 فقط)
  // ===============================
  productsList: any[] = [];
  selectedProductForModal: any = null;

  // ===============================
  // Lifecycle
  // ===============================
  ngOnInit(): void {
    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());

    this.initAOS();
    this.fixAOSWithSwiper();

    this.loadProducts();
  }

  // ===============================
  // Load 8 Products Only
  // ===============================
  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        if (res && res.products) {
          this.productsList = res.products.slice(0, 8); // 👈 8 منتجات بس
        }
      },
      error: (err) => console.error('Error fetching products', err)
    });
  }

  openQuickView(product: any) {
    this.selectedProductForModal = product;
  }

  // ===============================
  // AOS
  // ===============================
  initAOS() {
    AOS.init({
      duration: 800,
      easing: 'ease',
      mirror: true,
      once: false,
    });
  }

  fixAOSWithSwiper() {
    const swiper = this.elRef.nativeElement.querySelector('swiper-container');

    if (swiper) {
      swiper.addEventListener('swipertransitionstart', () => {
        const elements =
          this.elRef.nativeElement.querySelectorAll('[data-aos]');
        elements.forEach((el: HTMLElement) => {
          el.classList.remove('aos-animate');
        });
      });

      swiper.addEventListener('swipertransitionend', () => {
        setTimeout(() => AOS.refreshHard(), 200);
      });
    }
  }
}




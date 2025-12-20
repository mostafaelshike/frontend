import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core'; 
import { CarouselModule, Carousel } from 'primeng/carousel'; 
import AOS from 'aos';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  @ViewChild('pc') carousel: Carousel | undefined;
  @ViewChild('slider2') slider2!: Carousel;

  products = [
    { 
      id: 1, 
      name: 'Make your perfect smile even better', 
      imageDesktop: 'assets/images/slider-1.webp',
      imageMobile: 'assets/images/mobile-slider-1.webp',
      prgraph:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.' 
    },
    { 
      id: 2, 
      name: 'Make your perfect smile even better', 
      imageDesktop: 'assets/images/slider-2.webp',
      imageMobile:'assets/images/mobile-slider-2.webp',
      prgraph:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.' 
    },
    { 
      id: 3, 
      name: 'Make your perfect smile even better', 
      imageDesktop: 'assets/images/slider-3.webp',
      imageMobile:'assets/images/mobile-slider-3.webp',
      prgraph:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.' 
    },
  ];

  activeProduct: any = this.products[0];

  responsiveOptions: any[] = [
    { breakpoint: '1199px', numVisible: 1, numScroll: 1 },
    { breakpoint: '991px', numVisible: 1, numScroll: 1 },
    { breakpoint: '767px', numVisible: 1, numScroll: 1 }
  ];

  isMobile: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) { }
hoverService: { [key: number]: boolean } = {};

service = [
    { 
      id: 1, 
      name: 'Bandage', 
      imageDesktop: 'assets/images/band-aid.webp',
      hoverimage:'assets/images/band-aid-1.webp',
    
      prgraph:'11items' 
    },
    { 
      id: 2, 
      name: 'Pressure', 
      imageDesktop: 'assets/images/blood-pressure-gauge.webp',
      hoverimage:'assets/images/blood-pressure-gauge-1.webp',
      prgraph:'8item' 
    },
    { 
      id: 3, 
      name: 'sanitizer', 
      imageDesktop: 'assets/images/hand-sanitizer.webp',
         hoverimage:'assets/images/hand-sanitizer-1.webp',
      prgraph:'8item' 
    },
     { 
      id: 4, 
      name: 'Bandage', 
      imageDesktop: 'assets/images/herbal.webp',
     hoverimage:'assets/images/herbal-1.webp',
      prgraph:'11items' 
    },
    { 
      id: 5, 
      name: 'Pressure', 
      imageDesktop: 'assets/images/inhaler.webp',
     hoverimage:'assets/images/inhaler-1.webp',
      prgraph:'8item' 
    },
    { 
      id: 6, 
      name: 'sanitizer', 
      imageDesktop: 'assets/images/medical.webp',
       hoverimage:'assets/images/medical-1.webp',
      prgraph:'8item' 
    },



  ];

   responsive: any[] = [
    { breakpoint: '1199px', numVisible: 4, numScroll: 1 },
    { breakpoint: '991px', numVisible: 4, numScroll: 1 },
    { breakpoint: '767px', numVisible: 2, numScroll: 1 },
     { breakpoint: '600px', numVisible: 1, numScroll: 1 }
  ];








  ngOnInit() {
    // ✅ فحص حجم الشاشة
    this.checkScreen();
    window.addEventListener('resize', () => {
      this.checkScreen();
    });

    // ✅ تشغيل AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out-quart',
      once: false,
      mirror: true
    });
  }

  checkScreen() {
    this.isMobile = window.innerWidth <= 767;
  }

  private createEvent(page: number = 0): any {
    return { page: page };
  }

  onSlideChange(event: any) {
    this.activeProduct = this.products[event.page];

    const elementsToAnimate = this.el.nativeElement.querySelectorAll('[data-aos]');
    
    elementsToAnimate.forEach((element: HTMLElement) => {
      this.renderer.removeClass(element, 'aos-animate');
      element.removeAttribute('data-aos-id');
    });

    setTimeout(() => {
      AOS.refreshHard(); 
    }, 200); 
  }

  next(): void {
    if (this.carousel) {
      this.carousel.navForward(this.createEvent());
      const nextPage = (this.carousel.page + 1) % this.products.length;
      this.onSlideChange({ page: nextPage });
    }
  }

  prev(): void {
    if (this.carousel) {
      this.carousel.navBackward(this.createEvent());
      let prevPage = this.carousel.page - 1;
      if (prevPage < 0) prevPage = this.products.length - 1;
      this.onSlideChange({ page: prevPage });
    }
  }

nextSlider2(event: MouseEvent | TouchEvent) {
  this.slider2.navForward(event);
}

prevSlider2(event: MouseEvent | TouchEvent) {
  this.slider2.navBackward(event);
}




}

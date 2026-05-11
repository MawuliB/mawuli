import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NAV_PATHS } from '../shared/nav.constants';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
})
export class CarouselComponent {
  private pages = NAV_PATHS;
  private currentIndex = 0;

  @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  constructor(private router: Router) {}

  nextPage() {
    this.currentIndex = (this.currentIndex + 1) % this.pages.length;
    this.router.navigate([this.pages[this.currentIndex]]);
  }

  previousPage() {
    this.currentIndex =
      (this.currentIndex - 1 + this.pages.length) % this.pages.length;
    this.router.navigate([this.pages[this.currentIndex]]);
  }

  // keyboard navigation — skip when the user is typing into an input/textarea/select
  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    if (target) {
      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) {
        return;
      }
    }
    // Don't hijack browser/system shortcuts (Alt+arrow = back/forward, etc.)
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    // Only paginate when the current URL is one of the carousel-paged routes
    // (don't blindly navigate from /404 to a portfolio page).
    const url = this.router.url.split('?')[0].split('#')[0];
    const path = url === '/' ? '/' : url.slice(1);
    if (!this.pages.includes(path)) return;

    if (event.key === 'ArrowRight') {
      this.nextPage();
    } else if (event.key === 'ArrowLeft') {
      this.previousPage();
    }
  }

  stopPropagation(event: KeyboardEvent) {
    event.stopPropagation();
  }

  blurButton(event: MouseEvent) {
    (event.target as HTMLElement).blur();
  }

  focusCarousel() {
    if (this.carousel?.nativeElement) {
      this.carousel.nativeElement.focus();
    }
  }
}

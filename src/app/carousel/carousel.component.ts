import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
})
export class CarouselComponent {
  private pages = [
    '/',
    'skills',
    'experience',
    'education',
    'projects',
    'contact',
  ];
  private currentIndex = 0;

  @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  constructor(private router: Router) {}

  nextPage() {
    console.log(this.currentIndex);
    this.currentIndex = (this.currentIndex + 1) % this.pages.length;
    this.router.navigate([this.pages[this.currentIndex]]);
  }

  previousPage() {
    console.log(this.currentIndex);
    this.currentIndex =
      (this.currentIndex - 1 + this.pages.length) % this.pages.length;
    this.router.navigate([this.pages[this.currentIndex]]);
  }

  // keyboard navigation
  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
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

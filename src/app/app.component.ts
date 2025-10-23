import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CarouselComponent } from './carousel/carousel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CarouselComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'mawuli';
  private trail: Array<{ x: number; y: number; timestamp: number }> = [];
  private maxTrailLength = 20;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    const cursorTrail = document.querySelector('.cursor-trail') as HTMLElement;

    if (cursor) {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    }

    // Add to trail
    this.trail.push({
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now(),
    });

    // Remove old trail points
    const now = Date.now();
    this.trail = this.trail.filter((point) => now - point.timestamp < 300);

    // Keep trail length manageable
    if (this.trail.length > this.maxTrailLength) {
      this.trail = this.trail.slice(-this.maxTrailLength);
    }

    // Update trail visualization
    if (cursorTrail) {
      this.updateTrail(cursorTrail);
    }
  }

  @HostListener('document:mousedown')
  onMouseDown() {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    if (cursor) {
      cursor.classList.add('cursor-click');
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    if (cursor) {
      cursor.classList.remove('cursor-click');
    }
  }

  private updateTrail(trailElement: HTMLElement) {
    // Create trail dots
    const trailHTML = this.trail
      .map((point, index) => {
        const opacity = ((index + 1) / this.trail.length) * 0.6;
        const size = 4 + (index / this.trail.length) * 8;
        return `<div class="trail-dot" style="left: ${point.x}px; top: ${point.y}px; opacity: ${opacity}; width: ${size}px; height: ${size}px;"></div>`;
      })
      .join('');

    trailElement.innerHTML = trailHTML;
  }
}

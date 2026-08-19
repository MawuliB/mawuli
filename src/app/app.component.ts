import { Component, HostListener } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CarouselComponent } from './carousel/carousel.component';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CarouselComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'mawuli';
  private trail: Array<{ x: number; y: number; timestamp: number }> = [];
  private maxTrailLength = 20;

  constructor(private seo: SeoService) {
    // Bakes per-route title/description/canonical/og into the prerendered HTML.
    this.seo.init();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    const cursorTrail = document.querySelector('.cursor-trail') as HTMLElement;

    if (cursor) {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    }

    this.trail.push({
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now(),
    });

    const now = Date.now();
    this.trail = this.trail.filter((point) => now - point.timestamp < 300);

    if (this.trail.length > this.maxTrailLength) {
      this.trail = this.trail.slice(-this.maxTrailLength);
    }

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
    // Build trail dots as real nodes (avoid innerHTML).
    const dots = this.trail.map((point, index) => {
      const opacity = ((index + 1) / this.trail.length) * 0.6;
      const size = 4 + (index / this.trail.length) * 8;
      const dot = document.createElement('div');
      dot.className = 'trail-dot';
      dot.style.left = `${point.x}px`;
      dot.style.top = `${point.y}px`;
      dot.style.opacity = String(opacity);
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      return dot;
    });
    trailElement.replaceChildren(...dots);
  }
}

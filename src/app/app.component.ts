import { Component, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CarouselComponent } from './carousel/carousel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, CarouselComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnDestroy {
  title = 'mawuli';
  chromeless = false;

  private trail: Array<{ x: number; y: number; timestamp: number }> = [];
  private maxTrailLength = 20;
  private routerSub: Subscription;

  constructor(private router: Router) {
    this.chromeless = this.deepestData()['chromeless'] === true;
    this.routerSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.chromeless = this.deepestData()['chromeless'] === true;
      });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }

  private deepestData(): Record<string, unknown> {
    let route: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    return route.data;
  }

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
    // Build trail dots as real nodes (avoid innerHTML — defensive against
    // future changes that could feed untrusted values into the markup).
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

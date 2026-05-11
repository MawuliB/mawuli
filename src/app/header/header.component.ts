import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { ThemeService, Theme } from '../services/theme.service';
import { NAV_ITEMS } from '../shared/nav.constants';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  menuOpen = false;
  showShortcuts = false;
  currentPath = '/';

  routes = NAV_ITEMS;

  constructor(private router: Router, private themeService: ThemeService) {
    // Track current route
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentPath = event.urlAfterRedirects;
        this.menuOpen = false; // Close mobile menu on navigation
      });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  get theme(): Theme {
    return this.themeService.get();
  }

  get showThemeHint(): boolean {
    return this.themeService.showHint;
  }

  cycleTheme(): void {
    this.themeService.cycle();
  }

  toggleShortcuts() {
    this.showShortcuts = !this.showShortcuts;
  }

  route(path: string) {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.currentPath === path;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent) {
    // Alt + Number shortcuts — driven from NAV_ITEMS so they stay in sync.
    if (event.altKey && !event.shiftKey && !event.ctrlKey) {
      const item = this.routes.find((r) => r.shortcutKey === event.key);
      if (item) {
        event.preventDefault();
        this.router.navigate([item.path]);
      }
    }

    // ? to toggle shortcuts display
    if (event.key === '?' && !event.shiftKey) {
      this.toggleShortcuts();
    }

    // Escape to close menu/shortcuts
    if (event.key === 'Escape') {
      this.menuOpen = false;
      this.showShortcuts = false;
    }
  }
}

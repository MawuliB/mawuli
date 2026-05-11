import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { ThemeService, Theme } from '../services/theme.service';

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

  routes = [
    { path: '/', label: 'home', shortcut: 'Alt+1' },
    { path: '/skills', label: 'skills', shortcut: 'Alt+2' },
    { path: '/experience', label: 'experience', shortcut: 'Alt+3' },
    { path: '/education', label: 'education', shortcut: 'Alt+4' },
    { path: '/projects', label: 'projects', shortcut: 'Alt+5' },
    { path: '/contact', label: 'contact', shortcut: 'Alt+6' },
  ];

  constructor(private router: Router, private themeService: ThemeService) {
    // Track current route
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
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
    // Alt + Number shortcuts
    if (event.altKey && !event.shiftKey && !event.ctrlKey) {
      const keyMap: { [key: string]: string } = {
        '1': '/',
        '2': '/skills',
        '3': '/experience',
        '4': '/education',
        '5': '/projects',
        '6': '/contact',
      };

      if (keyMap[event.key]) {
        event.preventDefault();
        this.router.navigate([keyMap[event.key]]);
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

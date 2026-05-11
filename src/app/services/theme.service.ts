import { Injectable } from '@angular/core';

export type Theme = 'green' | 'amber' | 'blue';

const STORAGE_KEY = 'mawuli.theme';
const HINT_KEY = 'mawuli.theme.hintSeen';
const THEMES: Theme[] = ['green', 'amber', 'blue'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private current: Theme = 'green';
  /** True until the visitor cycles the theme at least once. */
  readonly showHint: boolean;

  constructor() {
    const saved = (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)) as Theme | null;
    if (saved && THEMES.includes(saved)) {
      this.current = saved;
    }
    this.showHint =
      typeof localStorage === 'undefined' ||
      localStorage.getItem(HINT_KEY) !== 'true';
    this.apply(this.current);
  }

  dismissHint(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(HINT_KEY, 'true');
    }
  }

  get(): Theme {
    return this.current;
  }

  set(theme: Theme): void {
    this.current = theme;
    this.apply(theme);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }

  cycle(): Theme {
    const idx = THEMES.indexOf(this.current);
    const next = THEMES[(idx + 1) % THEMES.length];
    this.set(next);
    this.dismissHint();
    return next;
  }

  private apply(theme: Theme): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    THEMES.forEach((t) => root.classList.remove(`theme-${t}`));
    root.classList.add(`theme-${theme}`);
  }
}

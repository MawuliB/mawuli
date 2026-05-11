/**
 * Single source of truth for the portfolio's top-level routes.
 * Used by the header (renders the nav list + Alt+N shortcuts) and
 * the carousel (arrow-key pagination) so adding/removing a route
 * is a one-line change.
 *
 * The 404 route is intentionally NOT here — the carousel skips arrow
 * navigation on any URL not in this list.
 */

export interface NavItem {
  readonly path: string;
  readonly label: string;
  readonly shortcut: string;
  readonly shortcutKey: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { path: '/', label: 'home', shortcut: 'Alt+1', shortcutKey: '1' },
  { path: '/skills', label: 'skills', shortcut: 'Alt+2', shortcutKey: '2' },
  { path: '/experience', label: 'experience', shortcut: 'Alt+3', shortcutKey: '3' },
  { path: '/education', label: 'education', shortcut: 'Alt+4', shortcutKey: '4' },
  { path: '/projects', label: 'projects', shortcut: 'Alt+5', shortcutKey: '5' },
  { path: '/contact', label: 'contact', shortcut: 'Alt+6', shortcutKey: '6' },
] as const;

/** Bare path strings used by the carousel when checking "am I on a carouselable route?". */
export const NAV_PATHS: readonly string[] = NAV_ITEMS.map((n) => (n.path === '/' ? '/' : n.path.slice(1)));

import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

const ORIGIN = 'https://mawuli.thinks.work';
const DEFAULT_DESCRIPTION =
  'Mawuli Badassou — DevOps Engineer at AmaliTech and AWS Certified Solutions Architect. Terraform, CI/CD, observability, and backend-aware infrastructure on AWS.';

/**
 * Sets per-route <title>, meta description, canonical, and og/twitter tags on
 * every navigation. Because prerendering runs the router (a NavigationEnd fires
 * for each route being prerendered), these tags get baked into the static HTML —
 * so crawlers that don't run JS see the correct, per-route metadata instead of
 * the homepage shell's tags on every URL.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  init(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.update(e.urlAfterRedirects));
  }

  private update(url: string): void {
    let snapshot = this.route.snapshot;
    while (snapshot.firstChild) snapshot = snapshot.firstChild;

    const pageTitle = snapshot.title ?? this.title.getTitle();
    const description =
      (snapshot.data['description'] as string | undefined) ?? DEFAULT_DESCRIPTION;
    const path = url.split('#')[0].split('?')[0];
    const canonical = ORIGIN + (path === '/' ? '/' : path);

    if (pageTitle) this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:title', content: pageTitle ?? '' });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle ?? '' });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.setCanonical(canonical);
  }

  private setCanonical(href: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type SceneId =
  | 'call-to-order'
  | 'charges'
  | 'plea'
  | 'statement'
  | 'exhibit-a'
  | 'exhibit-b'
  | 'exhibit-c'
  | 'exhibit-d'
  | 'exhibit-e'
  | 'closing'
  | 'verdict'
  | 'verdict-loop-1'
  | 'verdict-loop-2'
  | 'sentencing'
  | 'adjourned';

@Component({
  selector: 'app-the-trial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './the-trial.component.html',
  styleUrl: './the-trial.component.css',
})
export class TheTrialComponent implements OnInit, OnDestroy {
  scene: SceneId = 'call-to-order';

  sentence = {
    cook: false,
    takeOut: false,
    buyTheThing: false,
    justHold: false,
  };

  private injectedNodes: HTMLElement[] = [];

  ngOnInit(): void {
    if (typeof document === 'undefined') return;

    // Strip site-wide CRT effects (scanlines, green glow, custom cursor) for this route.
    // We tag <html> instead of <body> because the same class is set pre-paint by an
    // inline script in index.html (which runs before <body> exists) to prevent FOUC.
    document.documentElement.classList.add('chromeless');

    // No-index even though /playground is already robots-disallowed.
    const noindex = document.createElement('meta');
    noindex.name = 'robots';
    noindex.content = 'noindex, nofollow';
    document.head.appendChild(noindex);
    this.injectedNodes.push(noindex);

    // Pull in romantic fonts only when this page loads.
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect1);
    this.injectedNodes.push(preconnect1);

    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);
    this.injectedNodes.push(preconnect2);

    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    // display=optional — reduces layout shift; falls back to system fonts if
    // the network is slow and only swaps in if loaded within ~100ms.
    fontLink.href =
      'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Lora:ital,wght@0,400;0,500;1,400&family=Caveat:wght@500;700&display=optional';
    document.head.appendChild(fontLink);
    this.injectedNodes.push(fontLink);

    // Swap the favicon to a heart for this route.
    const heartFavicon = document.createElement('link');
    heartFavicon.rel = 'icon';
    heartFavicon.type = 'image/svg+xml';
    heartFavicon.href =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ctext y='26' font-size='26'%3E%F0%9F%92%9F%3C/text%3E%3C/svg%3E";
    heartFavicon.id = 'trial-favicon';
    document.head.appendChild(heartFavicon);
    this.injectedNodes.push(heartFavicon);
  }

  ngOnDestroy(): void {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.remove('chromeless');
    this.injectedNodes.forEach((n) => n.parentNode?.removeChild(n));
    this.injectedNodes = [];
  }

  go(scene: SceneId): void {
    this.scene = scene;
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  whatsappUrl(): string {
    const picks: string[] = [];
    if (this.sentence.cook) picks.push('cook together (she teaches)');
    if (this.sentence.takeOut) picks.push('dinner — her pick');
    if (this.sentence.buyTheThing) picks.push('buy the thing she has been eyeing');
    if (this.sentence.justHold) picks.push('hold her, think about the rest later');
    const sentenceLine = picks.length ? `sentence: ${picks.join(' + ')}` : 'sentence: pending';
    const msg = `verdict: forgiven 💕\n${sentenceLine}\n— from Akua, your one allowed disturbance`;
    return `https://wa.me/233263633751?text=${encodeURIComponent(msg)}`;
  }

  hasPickedSentence(): boolean {
    return (
      this.sentence.cook ||
      this.sentence.takeOut ||
      this.sentence.buyTheThing ||
      this.sentence.justHold
    );
  }
}

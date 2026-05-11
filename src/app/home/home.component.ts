import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { Profile } from '../models/portfolio.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  profile: Profile | null = null;
  displayedText = '';
  displayedTagline = '';
  private subscription?: Subscription;
  private textIndex = 0;
  private taglineIndex = 0;
  private nameIntervalId: ReturnType<typeof setInterval> | null = null;
  private taglineIntervalId: ReturnType<typeof setInterval> | null = null;
  private taglineTimeoutId: ReturnType<typeof setTimeout> | null = null;

  asciiArt = `
    ███╗   ███╗ █████╗ ██╗    ██╗██╗   ██╗██╗     ██╗
    ████╗ ████║██╔══██╗██║    ██║██║   ██║██║     ██║
    ██╔████╔██║███████║██║ █╗ ██║██║   ██║██║     ██║
    ██║╚██╔╝██║██╔══██║██║███╗██║██║   ██║██║     ██║
    ██║ ╚═╝ ██║██║  ██║╚███╔███╔╝╚██████╔╝███████╗██║
    ╚═╝     ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝  ╚═════╝ ╚══════╝╚═╝
  `;

  constructor(private dataService: PortfolioDataService) {}

  ngOnInit() {
    this.subscription = this.dataService.getProfile().subscribe((profile) => {
      this.profile = profile;
      this.startTypingAnimation();
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    if (this.nameIntervalId) clearInterval(this.nameIntervalId);
    if (this.taglineIntervalId) clearInterval(this.taglineIntervalId);
    if (this.taglineTimeoutId) clearTimeout(this.taglineTimeoutId);
  }

  private startTypingAnimation() {
    if (!this.profile) return;

    this.nameIntervalId = setInterval(() => {
      if (!this.profile) return;
      if (this.textIndex < this.profile.name.length) {
        this.displayedText += this.profile.name[this.textIndex];
        this.textIndex++;
      } else {
        if (this.nameIntervalId) clearInterval(this.nameIntervalId);
        this.nameIntervalId = null;
        this.taglineTimeoutId = setTimeout(() => this.typeTagline(), 500);
      }
    }, 100);
  }

  private typeTagline() {
    if (!this.profile) return;

    this.taglineIntervalId = setInterval(() => {
      if (!this.profile) return;
      if (this.taglineIndex < this.profile.tagline.length) {
        this.displayedTagline += this.profile.tagline[this.taglineIndex];
        this.taglineIndex++;
      } else {
        if (this.taglineIntervalId) clearInterval(this.taglineIntervalId);
        this.taglineIntervalId = null;
      }
    }, 50);
  }
}

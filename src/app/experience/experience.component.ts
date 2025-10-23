import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { Experience } from '../models/portfolio.model';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
})
export class ExperienceComponent implements OnInit {
  experiences: Experience[] = [];
  commandOutput = '';
  isLoading = true;

  constructor(private portfolioService: PortfolioDataService) {}

  ngOnInit(): void {
    this.simulateCommandExecution();
  }

  simulateCommandExecution(): void {
    // Simulate terminal command execution
    setTimeout(() => {
      this.portfolioService
        .getAllExperience()
        .subscribe((data: Experience[]) => {
          this.experiences = data;
          this.isLoading = false;
        });
    }, 500);
  }

  calculateDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = endDate === 'Present' ? new Date() : new Date(endDate);

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${
        remainingMonths !== 1 ? 's' : ''
      }`;
    }
  }

  formatDate(date: string): string {
    if (date === 'Present') return 'Present';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  isCurrentJob(endDate: string): boolean {
    return endDate === 'Present';
  }
}

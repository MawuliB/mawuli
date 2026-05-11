import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { Experience } from '../models/portfolio.model';
import { PortfolioDatePipe, PortfolioDurationPipe } from '../shared/date-pipes';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, PortfolioDatePipe, PortfolioDurationPipe],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
})
export class ExperienceComponent implements OnInit {
  experiences: Experience[] = [];
  commandOutput = '';
  isLoading = true;

  constructor(private portfolioService: PortfolioDataService) {}

  ngOnInit(): void {
    this.loadExperience();
  }

  loadExperience(): void {
    this.portfolioService.getAllExperience().subscribe((data: Experience[]) => {
      this.experiences = data;
      this.isLoading = false;
    });
  }

  isCurrentJob(endDate: string): boolean {
    return endDate === 'Present';
  }
}

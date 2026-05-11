import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { Education, Certification } from '../models/portfolio.model';
import { forkJoin } from 'rxjs';
import { PortfolioDatePipe } from '../shared/date-pipes';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, PortfolioDatePipe],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css',
})
export class EducationComponent implements OnInit {
  educationList: Education[] = [];
  certifications: Certification[] = [];
  isLoading = true;

  constructor(private portfolioService: PortfolioDataService) {}

  ngOnInit(): void {
    this.loadEducation();
  }

  loadEducation(): void {
    forkJoin({
      edu: this.portfolioService.getAllEducation(),
      certs: this.portfolioService.getCertifications(),
    }).subscribe(({ edu, certs }) => {
      this.educationList = edu;
      this.certifications = certs;
      this.isLoading = false;
    });
  }

  calculateDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const years = end.getFullYear() - start.getFullYear();
    return `${years} years`;
  }

  getTotalItems(): number {
    let total = 0;
    for (const edu of this.educationList) {
      total += 4;
      if (edu.honors) total += edu.honors.length;
      if (edu.relevantCourses) total += edu.relevantCourses.length;
    }
    total += this.certifications.length;
    return total;
  }

  isExpired(cert: Certification): boolean {
    if (!cert.expiresDate) return false;
    return new Date(cert.expiresDate).getTime() < Date.now();
  }
}

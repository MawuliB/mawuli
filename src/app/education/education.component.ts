import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { Education } from '../models/portfolio.model';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css',
})
export class EducationComponent implements OnInit {
  educationList: Education[] = [];
  isLoading = true;

  constructor(private portfolioService: PortfolioDataService) {}

  ngOnInit(): void {
    this.loadEducation();
  }

  loadEducation(): void {
    setTimeout(() => {
      this.portfolioService.getAllEducation().subscribe((data: Education[]) => {
        this.educationList = data;
        this.isLoading = false;
      });
    }, 500);
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
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
      total += 4; // degree, location, date, gpa
      if (edu.honors) total += edu.honors.length;
      if (edu.relevantCourses) total += edu.relevantCourses.length;
    }
    return total;
  }
}

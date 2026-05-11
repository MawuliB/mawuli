import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { Project } from '../models/portfolio.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  isLoading = true;
  selectedFilter: 'all' | 'featured' | 'completed' | 'in-progress' = 'all';
  selectedProject: Project | null = null;

  constructor(private portfolioService: PortfolioDataService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.portfolioService.getAllProjects().subscribe((data: Project[]) => {
      this.projects = data;
      this.filteredProjects = data;
      this.isLoading = false;
    });
  }

  filterProjects(
    filter: 'all' | 'featured' | 'completed' | 'in-progress'
  ): void {
    this.selectedFilter = filter;
    switch (filter) {
      case 'all':
        this.filteredProjects = this.projects;
        break;
      case 'featured':
        this.filteredProjects = this.projects.filter((p) => p.featured);
        break;
      case 'completed':
        this.filteredProjects = this.projects.filter((p) => p.status === 'completed');
        break;
      case 'in-progress':
        this.filteredProjects = this.projects.filter((p) => p.status === 'in-progress');
        break;
    }
  }

  openProjectDetails(project: Project): void {
    this.selectedProject = project;
  }

  closeProjectDetails(): void {
    this.selectedProject = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.selectedProject) this.closeProjectDetails();
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  calculateDuration(startDate: string, endDate?: string): string {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    if (months < 1) return '< 1 month';
    if (months === 1) return '1 month';
    if (months < 12) return `${months} months`;

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
    return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${
      remainingMonths !== 1 ? 's' : ''
    }`;
  }

  getStatusIcon(status: string): string {
    return status === 'completed' ? '✓' : '⟳';
  }

  getStatusColor(status: string): string {
    return status === 'completed' ? 'completed' : 'in-progress';
  }
}

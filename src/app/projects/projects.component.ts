import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { Project } from '../models/portfolio.model';
import { PortfolioDatePipe, PortfolioDurationPipe } from '../shared/date-pipes';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, PortfolioDatePipe, PortfolioDurationPipe],
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

  getStatusIcon(status: string): string {
    return status === 'completed' ? '✓' : '⟳';
  }

  getStatusColor(status: string): string {
    return status === 'completed' ? 'completed' : 'in-progress';
  }
}

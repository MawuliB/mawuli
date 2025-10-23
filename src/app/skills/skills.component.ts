import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { Skill } from '../models/portfolio.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css',
})
export class SkillsComponent implements OnInit, OnDestroy {
  skills: Skill[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;
  private subscription?: Subscription;

  constructor(private readonly dataService: PortfolioDataService) {}

  ngOnInit() {
    this.subscription = this.dataService.getAllSkills().subscribe((skills) => {
      this.skills = skills;
      this.categories = [...new Set(skills.map((s) => s.category))];
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  getSkillsByCategory(category: string): Skill[] {
    return this.skills.filter((s) => s.category === category);
  }

  filterByCategory(category: string | null) {
    this.selectedCategory = category;
  }

  get filteredSkills(): Skill[] {
    if (!this.selectedCategory) {
      return this.skills;
    }
    return this.skills.filter((s) => s.category === this.selectedCategory);
  }

  getCategoryDisplayName(category: string): string {
    const names: { [key: string]: string } = {
      frontend: 'Frontend Development',
      backend: 'Backend Development',
      database: 'Database & Storage',
      devops: 'DevOps & Tools',
      tools: 'Development Tools',
      other: 'Other Skills',
    };
    return names[category] || category;
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      frontend: '🎨',
      backend: '⚙️',
      database: '💾',
      devops: '🚀',
      tools: '🛠️',
      other: '📦',
    };
    return icons[category] || '📁';
  }
}

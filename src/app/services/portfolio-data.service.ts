import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  PortfolioData,
  Profile,
  Skill,
  Experience,
  Education,
  Project,
  Contact,
} from '../models/portfolio.model';
import portfolioData from '../../assets/data/portfolio-data.json';

@Injectable({
  providedIn: 'root',
})
export class PortfolioDataService {
  private data: PortfolioData = portfolioData as PortfolioData;

  constructor() {}

  // Get all data
  getAllData(): Observable<PortfolioData> {
    return of(this.data);
  }

  // Profile
  getProfile(): Observable<Profile> {
    return of(this.data.profile);
  }

  // Skills
  getAllSkills(): Observable<Skill[]> {
    return of(this.data.skills);
  }

  getSkillsByCategory(category: string): Observable<Skill[]> {
    const filtered = this.data.skills.filter(
      (skill) => skill.category === category
    );
    return of(filtered);
  }

  getSkillCategories(): Observable<string[]> {
    const categories = [
      ...new Set(this.data.skills.map((skill) => skill.category)),
    ];
    return of(categories);
  }

  // Experience
  getAllExperience(): Observable<Experience[]> {
    return of(this.data.experience);
  }

  getExperienceById(id: number): Observable<Experience | undefined> {
    const exp = this.data.experience.find((e) => e.id === id);
    return of(exp);
  }

  // Education
  getAllEducation(): Observable<Education[]> {
    return of(this.data.education);
  }

  getEducationById(id: number): Observable<Education | undefined> {
    const edu = this.data.education.find((e) => e.id === id);
    return of(edu);
  }

  // Projects
  getAllProjects(): Observable<Project[]> {
    return of(this.data.projects);
  }

  getFeaturedProjects(): Observable<Project[]> {
    const featured = this.data.projects.filter((p) => p.featured);
    return of(featured);
  }

  getProjectById(id: number): Observable<Project | undefined> {
    const project = this.data.projects.find((p) => p.id === id);
    return of(project);
  }

  getProjectsByStatus(
    status: 'completed' | 'in-progress' | 'planned'
  ): Observable<Project[]> {
    const filtered = this.data.projects.filter((p) => p.status === status);
    return of(filtered);
  }

  // Contact
  getContact(): Observable<Contact> {
    return of(this.data.contact);
  }

  // Utility
  getLastUpdated(): Observable<string> {
    return of(this.data.lastUpdated);
  }
}

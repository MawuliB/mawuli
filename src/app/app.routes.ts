import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { EducationComponent } from './education/education.component';
import { ExperienceComponent } from './experience/experience.component';
import { ProjectsComponent } from './projects/projects.component';
import { SkillsComponent } from './skills/skills.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home' },
  { path: 'contact', component: ContactComponent, title: 'Contact' },
  { path: 'education', component: EducationComponent, title: 'Education' },
  { path: 'experience', component: ExperienceComponent, title: 'Experience' },
  { path: 'projects', component: ProjectsComponent, title: 'Projects' },
  { path: 'skills', component: SkillsComponent, title: 'Skills' },
];

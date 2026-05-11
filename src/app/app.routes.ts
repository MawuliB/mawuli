import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { EducationComponent } from './education/education.component';
import { ExperienceComponent } from './experience/experience.component';
import { ProjectsComponent } from './projects/projects.component';
import { SkillsComponent } from './skills/skills.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Mawuli Badassou — DevOps Engineer' },
  { path: 'contact', component: ContactComponent, title: 'Contact · Mawuli Badassou' },
  { path: 'education', component: EducationComponent, title: 'Education · Mawuli Badassou' },
  { path: 'experience', component: ExperienceComponent, title: 'Experience · Mawuli Badassou' },
  { path: 'projects', component: ProjectsComponent, title: 'Projects · Mawuli Badassou' },
  { path: 'skills', component: SkillsComponent, title: 'Skills · Mawuli Badassou' },
  {
    path: 'playground',
    loadChildren: () =>
      import('./playground/playground.routes').then((m) => m.PLAYGROUND_ROUTES),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: '404 · Not found',
  },
];

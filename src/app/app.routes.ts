import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    title: 'Mawuli Badassou — DevOps Engineer',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact.component').then((m) => m.ContactComponent),
    title: 'Contact · Mawuli Badassou',
  },
  {
    path: 'education',
    loadComponent: () =>
      import('./education/education.component').then((m) => m.EducationComponent),
    title: 'Education · Mawuli Badassou',
  },
  {
    path: 'experience',
    loadComponent: () =>
      import('./experience/experience.component').then((m) => m.ExperienceComponent),
    title: 'Experience · Mawuli Badassou',
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./projects/projects.component').then((m) => m.ProjectsComponent),
    title: 'Projects · Mawuli Badassou',
  },
  {
    path: 'skills',
    loadComponent: () =>
      import('./skills/skills.component').then((m) => m.SkillsComponent),
    title: 'Skills · Mawuli Badassou',
  },
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

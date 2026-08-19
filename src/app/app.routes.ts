import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    title: 'Mawuli Badassou — DevOps Engineer',
    data: {
      description:
        'Mawuli Badassou — DevOps Engineer at AmaliTech and AWS Certified Solutions Architect. Terraform, CI/CD, observability, and backend-aware infrastructure on AWS.',
    },
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact.component').then((m) => m.ContactComponent),
    title: 'Contact · Mawuli Badassou',
    data: {
      description:
        'Get in touch with Mawuli Badassou — DevOps Engineer based in Accra, Ghana. Available for DevOps, cloud, and backend engineering work.',
    },
  },
  {
    path: 'education',
    loadComponent: () =>
      import('./education/education.component').then((m) => m.EducationComponent),
    title: 'Education · Mawuli Badassou',
    data: {
      description:
        "Mawuli Badassou's education: BSc Computer Science, University of Ghana, plus AWS certifications and cloud training.",
    },
  },
  {
    path: 'experience',
    loadComponent: () =>
      import('./experience/experience.component').then((m) => m.ExperienceComponent),
    title: 'Experience · Mawuli Badassou',
    data: {
      description:
        "Mawuli Badassou's DevOps and software engineering experience at AmaliTech — AWS infrastructure automation, Terraform, CI/CD, and production observability.",
    },
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./projects/projects.component').then((m) => m.ProjectsComponent),
    title: 'Projects · Mawuli Badassou',
    data: {
      description:
        'Selected DevOps and cloud projects by Mawuli Badassou — Terraform migrations, AWS disaster recovery, observability stacks, and cost automation.',
    },
  },
  {
    path: 'skills',
    loadComponent: () =>
      import('./skills/skills.component').then((m) => m.SkillsComponent),
    title: 'Skills · Mawuli Badassou',
    data: {
      description:
        "Mawuli Badassou's technical skills — AWS, Terraform, CI/CD, Docker, Kubernetes, Prometheus, Grafana, Python, and more.",
    },
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: '404 · Not found',
  },
];

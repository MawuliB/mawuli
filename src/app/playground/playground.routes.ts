import { Routes } from '@angular/router';

export const PLAYGROUND_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./playground.component').then((m) => m.PlaygroundComponent),
    title: 'Playground',
  },
  {
    path: 'dummy-flow',
    loadComponent: () =>
      import('./experiments/dummy-flow/dummy-flow.component').then(
        (m) => m.DummyFlowComponent
      ),
    title: 'Playground · Dummy Flow',
  },
];

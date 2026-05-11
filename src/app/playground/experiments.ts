export interface Experiment {
  slug: string;
  title: string;
  description: string;
  status: 'live' | 'wip' | 'draft';
  addedOn: string;
}

export const EXPERIMENTS: Experiment[] = [
  {
    slug: 'dummy-flow',
    title: 'Dummy Flow',
    description: 'A clickable multi-step form for stakeholder reviews.',
    status: 'live',
    addedOn: '2026-05-11',
  },
];

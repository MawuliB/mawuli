import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EXPERIMENTS, Experiment } from './experiments';

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.css',
})
export class PlaygroundComponent {
  experiments: Experiment[] = EXPERIMENTS;

  statusBadge(status: Experiment['status']): string {
    switch (status) {
      case 'live':
        return '✓ live';
      case 'wip':
        return '⟳ wip';
      case 'draft':
        return '… draft';
    }
  }
}

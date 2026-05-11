import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Step {
  id: number;
  label: string;
}

@Component({
  selector: 'app-dummy-flow',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dummy-flow.component.html',
  styleUrl: './dummy-flow.component.css',
})
export class DummyFlowComponent {
  readonly steps: Step[] = [
    { id: 1, label: 'Details' },
    { id: 2, label: 'Preferences' },
    { id: 3, label: 'Review' },
    { id: 4, label: 'Done' },
  ];

  currentStep = 1;

  form = {
    name: '',
    email: '',
    role: '',
    plan: 'free' as 'free' | 'pro' | 'team',
    notify: true,
  };

  next() {
    if (this.currentStep < this.steps.length) this.currentStep++;
  }

  back() {
    if (this.currentStep > 1) this.currentStep--;
  }

  reset() {
    this.currentStep = 1;
    this.form = { name: '', email: '', role: '', plan: 'free', notify: true };
  }
}

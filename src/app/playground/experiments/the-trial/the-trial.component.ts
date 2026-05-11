import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type SceneId =
  | 'call-to-order'
  | 'charges'
  | 'plea'
  | 'statement'
  | 'exhibit-a'
  | 'exhibit-b'
  | 'exhibit-c'
  | 'exhibit-d'
  | 'exhibit-e'
  | 'closing'
  | 'verdict'
  | 'verdict-loop-1'
  | 'verdict-loop-2'
  | 'sentencing'
  | 'adjourned';

@Component({
  selector: 'app-the-trial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './the-trial.component.html',
  styleUrl: './the-trial.component.css',
})
export class TheTrialComponent implements OnInit {
  scene: SceneId = 'call-to-order';

  // Sentencing — she ticks what he owes her
  sentence = {
    cook: false,
    takeOut: false,
    buyTheThing: false,
    justHold: false,
  };

  ngOnInit(): void {
    // No-index this page even though /playground is already robots-disallowed.
    if (typeof document !== 'undefined') {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow';
      document.head.appendChild(meta);
    }
  }

  go(scene: SceneId): void {
    this.scene = scene;
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  whatsappUrl(): string {
    const picks: string[] = [];
    if (this.sentence.cook) picks.push('cook together (she teaches)');
    if (this.sentence.takeOut) picks.push('dinner — her pick');
    if (this.sentence.buyTheThing) picks.push('buy the thing she has been eyeing');
    if (this.sentence.justHold) picks.push('hold her, think about the rest later');
    const sentenceLine = picks.length ? `sentence: ${picks.join(' + ')}` : 'sentence: pending';
    const msg = `verdict: forgiven ✓\n${sentenceLine}\n— from your one allowed disturbance`;
    return `https://wa.me/233244065972?text=${encodeURIComponent(msg)}`;
  }

  hasPickedSentence(): boolean {
    return (
      this.sentence.cook ||
      this.sentence.takeOut ||
      this.sentence.buyTheThing ||
      this.sentence.justHold
    );
  }
}

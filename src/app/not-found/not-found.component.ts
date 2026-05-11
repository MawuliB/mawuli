import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="not-found terminal-window">
      <div class="terminal-header">
        <div class="terminal-buttons">
          <span class="btn-close" style="background:#ff5f56"></span>
          <span class="btn-minimize" style="background:#ffbd2e"></span>
          <span class="btn-maximize" style="background:#27c93f"></span>
        </div>
        <div class="terminal-title">user&#64;portfolio:~/404</div>
      </div>
      <div class="body">
        <p><span class="prompt">$</span> cat /etc/route</p>
        <p class="err">bash: route not found: <code>{{ path }}</code></p>
        <p class="muted"># exit code 404</p>
        <p>
          <a routerLink="/" class="cta">[ go home ]</a>
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .not-found { max-width: 700px; margin: var(--spacing-2xl) auto; }
      .terminal-buttons { display:flex; gap: var(--spacing-xs); }
      .btn-close, .btn-minimize, .btn-maximize { width:12px; height:12px; border-radius:50%; display:inline-block; }
      .body { padding: var(--spacing-md) 0; }
      .body p { margin-bottom: var(--spacing-md); }
      .prompt { color: var(--terminal-primary-bright); margin-right: var(--spacing-sm); }
      .err { color: #ff7777; }
      .muted { color: var(--terminal-text-muted); }
      code { background: var(--terminal-bg-alt); padding: 2px 6px; border:1px solid var(--terminal-border); border-radius: var(--border-radius); color: var(--terminal-primary-bright); }
      .cta { display:inline-block; margin-right: var(--spacing-md); color: var(--terminal-primary-bright); }
    `,
  ],
})
export class NotFoundComponent {
  path = typeof window !== 'undefined' ? window.location.pathname : '';
}

import { bootstrapApplication } from '@angular/platform-browser';
import { inject as injectVercelAnalytics } from '@vercel/analytics';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Vercel Analytics — no-op outside production deploys.
// Auto-tracks pageviews via the History API as Angular routes change.
injectVercelAnalytics();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

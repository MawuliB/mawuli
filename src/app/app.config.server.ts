import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering()],
};

// Server/prerender config = the browser app config + server rendering.
// No provideClientHydration() on the browser side — this app re-renders on
// the client (typing animation, cursor trail, theme classes), so the
// prerendered HTML is for crawlers only, not for hydration.
export const config = mergeApplicationConfig(appConfig, serverConfig);

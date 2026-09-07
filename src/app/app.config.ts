import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { RTL } from '@progress/kendo-angular-l10n';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: LOCALE_ID, useFactory: originalLocaleIdFactory },
    { provide: RTL, useFactory: isRtl, deps: [] },
  ],
};


export function originalLocaleIdFactory(originalLocalId: string): string {
  return localStorage.getItem('localeId') || 'fa-IR';
}

export function isRtl(): boolean {
  return localStorage.getItem('localeId')?.startsWith('fa');
}
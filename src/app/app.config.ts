import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localeRu from '@angular/common/locales/ru';
import { provideRouter } from '@angular/router';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { PRIMENG_RU } from './core/i18n/primeng-ru';

registerLocaleData(localeRu);

/** Aura с синим primary */
const CalendarPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'ru' },
    providePrimeNG({
      theme: {
        preset: CalendarPreset,
        options: { darkModeSelector: false },
      },
      translation: PRIMENG_RU,
      license:
        'eyJpZCI6IjFhMWUwYWFkLWExZGUtNDU0NS1iMzhjLWVjNzgxNzVkMDc2MiIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTA5MjU3MTUsImV4cCI6MTgyMjQ2MTcxNX0.D0NYEXZQ-z1ZZ-3pKZkcfgiD_uovs3j5CrwqBZiETsIBzYePAZNmS2QNjgOfCGVvMa07WxHnaFmYu7xFQfz6BA',
    }),
  ],
};

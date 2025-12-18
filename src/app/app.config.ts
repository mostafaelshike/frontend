// src/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
// ✨ الخطوة الأهم: استيراد وتوفير Animations
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // أو provideAnimations

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),
    // ✨ أضف هذا السطر لتمكين Angular Animations
    provideAnimationsAsync() 
  ]
};
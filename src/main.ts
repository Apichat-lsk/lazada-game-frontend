import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
declare global {
  interface Window {
    onRecaptchaLoadCallback: () => void;
  }
}
bootstrapApplication(App, appConfig).catch((err) => console.error(err));

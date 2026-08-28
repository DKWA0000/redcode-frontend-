import { AppComponent } from './app/app'; // 👈 Change here
import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, appConfig) // 👈 Change here
  .catch((err) => console.error(err));

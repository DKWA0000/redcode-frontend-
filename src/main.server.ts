import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app'; 
import { config } from './app/app.config.server';

// 1. Accept the context argument directly from the server runner
const bootstrap = (context: any) => 
  // 2. Pass it directly as the THIRD separate parameter
  bootstrapApplication(AppComponent, config, context); 

export default bootstrap;

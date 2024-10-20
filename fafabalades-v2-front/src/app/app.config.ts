import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DateParserFormatter } from './tools/dateParserFormatter';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideToastr(),
    provideAnimations(),
    provideRouter(routes),
    {
      provide: NgbDateParserFormatter,
      useClass: DateParserFormatter
    }
  ]
};

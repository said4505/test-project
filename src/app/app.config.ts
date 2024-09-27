import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {MatDateFormats} from "@angular/material/core";
import {provideMomentDateAdapter} from "@angular/material-moment-adapter";
import {provideHttpClient} from "@angular/common/http";

const appDateFormat: MatDateFormats = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync('animations'), provideMomentDateAdapter(appDateFormat), provideHttpClient()]
};

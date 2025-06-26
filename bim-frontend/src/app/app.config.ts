import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { IonicModule } from '@ionic/angular';

export const appConfig = {
  providers: [
    importProvidersFrom(IonicModule.forRoot()),
    provideRouter(routes),
  ],
};
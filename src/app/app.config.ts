import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApmModule } from '@elastic/apm-rum-angular';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgxPermissionsModule } from 'ngx-permissions';
import { HttpRequestInterceptor } from './core/interceptors/http-request.interceptor';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      ApmModule,
    ),
    provideRouter(routes),
    importProvidersFrom(
      JwtModule.forRoot({
      }),
    ),
    importProvidersFrom(
      NgxPermissionsModule.forRoot({
      }),
    ),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    },
    { provide: JwtHelperService },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    provideClientHydration(),
    provideAnimationsAsync()
  ]
};

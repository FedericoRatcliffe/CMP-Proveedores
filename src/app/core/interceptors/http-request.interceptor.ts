import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private inject: Injector, private _authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let authService = this.inject.get(AuthService);
    let jwt = authService.getToken();

    if (jwt) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + jwt
        }
      })
    }
    
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let data = {};
        data = {
          reason: error && error.error && error.error.reason ? error.error.reason : '',
          status: error.status
        };
        if (error.status === 401)
          this._authService.logout();

        return throwError(error);
      }));
  }
}

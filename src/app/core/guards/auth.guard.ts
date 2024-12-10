import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _authService: AuthService, private _router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this._authService.isLoggedIn()) {
      return true;
    }
    else {
      const targetUrl = state.url.replace('/', '');
      if (typeof window !== 'undefined') {
        localStorage.setItem('targetUrl', targetUrl);
      }
      this._authService.login();
      return false;
    }
  }

}

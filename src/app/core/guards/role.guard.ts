import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private _authService: AuthService, private _route: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    var permissions = route.data['permissions'];
    
    // Verificar acceso general a las demás rutas/recursos
    var haveAccess = this._authService.haveAccess(permissions);

    if (!haveAccess) {
      this._route.navigate(['403-forbidden-8fj4n39vn8v23']);
    }

    return haveAccess;
  }

}

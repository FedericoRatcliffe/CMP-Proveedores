import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Buffer } from 'buffer';
import { NgxPermissionsService } from 'ngx-permissions';
import { ApmService } from '@elastic/apm-rum-angular';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tknStr = 'tkn_' + environment.app + '_' + environment.env;


  constructor(@Inject(PLATFORM_ID) private _platformId: Object, @Inject(JwtHelperService) private _jwtHelperService: JwtHelperService, @Inject(CookieService) private _cookieService: CookieService, @Inject(Router) private _router: Router, @Inject(NgxPermissionsService) private _permissionsService: NgxPermissionsService, @Inject(ApmService) private _apmService: ApmService) {

  }



  login() {
    if (environment.SingleSignOn)
      if (isPlatformBrowser(this._platformId)) window.location.href = environment.adfs.url + '/login';
      else
        this._router.navigate(['login']);
  }


  loginResponse() {
    if (this.isLoggedIn()) {

      const targetUrl = localStorage.getItem('targetUrl') || '';
      this._router.navigate([targetUrl]);
    }
    else {
      this.login();
    }
  }



  isLoggedIn() {
    const token = this.getToken();
    if (!token)
      return false;
    else if (this._jwtHelperService.isTokenExpired(token)) {
      this._router.navigate(['logout']);
      return false;
    }

    const permissions = this._permissionsService.getPermissions();
    if (permissions[0] == undefined) {
      let roles = this.getJwtPermissions();
      this._permissionsService.loadPermissions(roles);
    }

    const user = this.getTokenJson();
    this._apmService.apm.setUserContext(
      { id: user.nameid, username: user.family_name }
    )
    return true;
  }


  private getTokenJson(): any {

    let token = this.getToken();

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    const tokenObject = JSON.parse(jsonPayload);
    return tokenObject;
  }

  
  getJwtPermissions(): string[] {
    const finalData = this.getTokenJson();

    if (!finalData) return []; // Devolver un array vacío si no se puede obtener finalData

    let roles = finalData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (!roles) return []; // Devolver un array vacío si roles es null o undefined

    if (typeof roles === 'string') {
      // Si roles es un string, dividirlo por comas y limpiar los espacios
      roles = roles.split(',').map(role => role.trim());
    }

    if (Array.isArray(roles)) {
      // Si roles es un array, devolverlo directamente
      return roles;
    }

    this._router.navigate(['logout']);
    return []; // Devolver un array vacío si no se encuentran roles válidos
  }


  getToken(): string {
    return isPlatformBrowser(this._platformId) ? sessionStorage.getItem(this.tknStr) || this._cookieService.get(this.tknStr) : '';
  }


  byPass(token: string) {
    if (environment.SingleSignOn) return;
    const date = this.getTokenExpirationDate(token);
    this._cookieService.set(this.tknStr, token, date!);
    this.loginResponse()
  }


  private getTokenExpirationDate(token: string): Date | null {
    const decodedToken = this._jwtHelperService.decodeToken(token);

    if (decodedToken.exp === undefined) { return null; }

    const date = new Date(0);
    date.setUTCSeconds(decodedToken.exp);
    return date;
  }
  

  logout() {
    this.deleteAllTokens();
    if (environment.SingleSignOn) {
      this._router.navigate(['logout']);
    } else {
      this._router.navigate(['login']);
    }
  }


  goToLogout(a: boolean = false) {
    if (environment.SingleSignOn) {
      const urlRedirect = environment.adfs.url + '/logout' + ((a) ? '?a=true' : '');
      window.location.href = urlRedirect;
    }
    else
      this._router.navigate(['login']);
  }

  private deleteAllTokens() {
    this.deleteCookie();
  }

  private deleteCookie() {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 1);
    this._cookieService.set(this.tknStr, '', expiredDate, '/', '.cooperacionseguros.com.ar');
  }




  haveAccess(requiredRoles: string[]) {
    let finalData = this.getTokenJson();

    if (!finalData) return false;

    let roles = finalData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (typeof roles === 'string') {
      return (requiredRoles.find(i => i === roles) != undefined);
    }

    if (!requiredRoles) return true;

    const isAuthorized = roles?.some((r: string) => requiredRoles.includes(r));

    return isAuthorized;
  }

  private getUserIdFromToken(token: string): string | null {
    try {
      const decodedToken = this._jwtHelperService.decodeToken(token);
      return decodedToken ? decodedToken.nameid || null : '';
    } catch (error) {
      return '';
    }
  }


}

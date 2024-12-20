import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem(key);
    }
    return null;
  }

  setItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(key, value);
    }
  }

  removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(key);
    }
  }
}

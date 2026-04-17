import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    return this.check();
  }

  canActivateChild(): boolean | UrlTree {
    return this.check();
  }

  private check(): boolean | UrlTree {
    if (this.authService.isLoggedIn) return true;
    return this.router.createUrlTree(['/auth/login']);
  }
}

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isAdmin) return true;
    return this.router.createUrlTree(['/dashboard']);
  }
}

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (!this.authService.isLoggedIn) return true;
    return this.router.createUrlTree(['/dashboard']);
  }
}

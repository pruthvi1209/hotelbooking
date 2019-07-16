
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { AuthService } from './authService';
import { Injectable } from '@angular/core';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot , state: RouterStateSnapshot) {
        return this.authService.isUserLoggedIn().then((authenticated) => {
            if (authenticated) {
                return true;
            } else {
                this.router.navigate(['/signUp']);
            }
        });
    }
}

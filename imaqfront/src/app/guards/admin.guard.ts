import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from '../services/user.service';
import { SweetAlert } from 'sweetalert/typings/core';
import { UserProfileDTO } from '../models/User';
import { ApiResult } from '../models/ApiResult';
import { LoginEventService } from '../services/login-event.service';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(
    private userService: UserService,
    private loginEventService: LoginEventService,
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userService.myProfile().pipe(
      map((result: ApiResult) => {
        const user = result.result as UserProfileDTO;
        if (user.rol == 'ADMIN') {
          return true;
        }
        swal({ title: 'Error!', text: 'No tienes permitido el acceso a esta pagina!', icon: 'error' }).then(() => {
          this.loginEventService.triggerLoginEvent(true);
          this.router.navigate(['home']);
        });
        return false;
      }),
      catchError(() => {
        swal({ title: 'Error!', text: 'No tienes permitido el acceso a esta pagina!', icon: 'error' }).then(() => {
          this.loginEventService.triggerLoginEvent(true);
          this.router.navigate(['home']);
        });
        return of(false);
      }));

  }

}

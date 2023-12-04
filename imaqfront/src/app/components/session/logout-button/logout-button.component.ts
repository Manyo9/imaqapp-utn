import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { LoginEventService } from 'src/app/services/login-event.service';
import { UserService } from 'src/app/services/user.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.scss']
})
export class LogoutButtonComponent implements OnDestroy {

  private subs: Subscription = new Subscription();
  constructor(
    private userService: UserService,
    private loginEventService: LoginEventService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  logout() {
    this.subs.add(
      this.userService.logout().subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Éxito', text: `Cerraste sesión exitosamente.`, icon: 'success' });
            this.loginEventService.triggerLoginEvent(false);
            this.router.navigate(['/inicio']);
          } else {
            swal({ title: 'Oops!', text: `Error al cerrar sesión: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al cerrar sesión: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al cerrar sesión.`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }
}

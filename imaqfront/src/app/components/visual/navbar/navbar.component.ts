import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { UserProfileDTO } from 'src/app/models/User';
import { LoginEventService } from 'src/app/services/login-event.service';
import { UserService } from 'src/app/services/user.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  role: string;
  private subs: Subscription = new Subscription();

  constructor(private userService: UserService, private loginEventService: LoginEventService) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  ngOnInit(): void {
    this.getRole();
    this.subs.add(
      this.loginEventService.onSideNavToggle()
        .subscribe((logged) => {
          if (logged) {
            this.getRole();
          } else {
            this.role = 'NOTLOGGED'
          }
        })
    );
  }
  getRole(): void {
    this.subs.add(
      this.userService.myProfile().subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            const user = result.result as UserProfileDTO;
            this.role = user.rol ? user.rol : 'NOTLOGGED';
          } else {
            this.role = 'NOTLOGGED';
            console.error(`Error al obtener perfil: ${result.message}`);
          }
        },
        error: (error) => {
          if (error.error.message) {
            console.error(`Error al obtener perfil: ${error.error.message}`);
          } else {
            console.error(error);
          }
          this.role = 'NOTLOGGED';
        },
        complete: () => {
          console.log(this.role);
        }
      })
    )
  }
}

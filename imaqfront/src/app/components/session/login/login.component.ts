import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { UserLoginDTO } from 'src/app/models/User';
import { LoginEventService } from 'src/app/services/login-event.service';
import { UserService } from 'src/app/services/user.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  user: UserLoginDTO;
  formg: FormGroup;
  private subs: Subscription = new Subscription();

  constructor(private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private loginEventService: LoginEventService
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.formg = this.formBuilder.group({
      usuario: [, [Validators.required, Validators.maxLength(64)]],
      password: [, [Validators.required, Validators.maxLength(64)]]
    })
  }

  logIn(): void {
    if (!this.formg.valid) {
      swal({ title: 'Atención!', text: `Revisá los campos`, icon: 'warning' });
      return;
    }

    this.user = this.formg.value as UserLoginDTO;
    this.subs.add(
      this.userService.login(this.user).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Éxito', text: `Bienvenido/a! ${result.message}`, icon: 'success' });
            this.loginEventService.triggerLoginEvent(true);
            this.router.navigate(['/inicio']);
          } else {
            swal({ title: 'Oops!', text: `Error al iniciar sesión: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al iniciar sesión: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al iniciar sesión.`, icon: 'error' });
            console.error(error);
          }

        }
      })
    )
  }

  cancel(): void {
    this.router.navigate(['/inicio']);
  }
}

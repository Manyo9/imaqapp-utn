import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { UserLoginDTO } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  formg: FormGroup;
  passwords: {
    oldPassword: string
    newPassword: string
  }
  private subs: Subscription = new Subscription();

  constructor(private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.formg = this.formBuilder.group({
      oldPassword: [, [Validators.required, Validators.maxLength(64)]],
      newPassword: [, [Validators.required, Validators.minLength(8), Validators.maxLength(64)]]
    })
  }

  changePass(): void {
    if (!this.formg.valid) {
      swal({ title: 'Atención!', text: `Revisá los campos`, icon: 'warning' });
      return;
    }

    this.passwords = this.formg.value;

    this.subs.add(
      this.userService.changePasswordSelf(this.passwords.oldPassword,
        this.passwords.newPassword)
        .subscribe({
          next: (result: ApiResult) => {
            if (result.ok) {
              swal({ title: 'Éxito', text: `Listo! ${result.message}`, icon: 'success' });
              this.router.navigate(['/inicio']);
            } else {
              swal({ title: 'Oops!', text: `Error al cambiar contraseña: ${result.message}`, icon: 'error' });
              console.error(result.message);
            }
          },
          error: (error) => {
            if (error.error.message) {
              swal({ title: 'Oops!', text: `Error al cambiar contraseña: ${error.error.message}`, icon: 'error' });
            } else {
              swal({ title: 'Oops!', text: `Error al cambiar contraseña.`, icon: 'error' });
              console.error(error);
            }
          }
        })
    )
  }

  cancel(): void {
    this.router.navigate(['/perfil']);
  }
}


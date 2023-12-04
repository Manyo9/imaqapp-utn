import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserNewDTO } from 'src/app/models/User';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ApiResult } from 'src/app/models/ApiResult';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit, OnDestroy {
  user: UserNewDTO;
  formg: FormGroup;
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
      usuario: [, [Validators.required, Validators.maxLength(64)]],
      password: [, [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
      email: [, [Validators.required, Validators.maxLength(64), Validators.email]],
      nombre: [, [Validators.required, Validators.maxLength(64)]],
      apellido: [, [Validators.required, Validators.maxLength(64)]]
    })
  }

  save(): void {
    if (!this.formg.valid) {
      swal({ title: 'Atención!', text: `Formulario inválido. Revisá los campos.`, icon: 'warning' });
      return;
    }

    this.user = this.formg.value as UserNewDTO;
    this.subs.add(
      this.userService.addManager(this.user).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Todo ok!', text: `Se creó el usuario con éxito`, icon: 'success' });
            this.router.navigate(['/admin/usuarios']);
          } else {
            swal({ title: 'Oops!', text: `Error al crear usuario: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al crear usuario: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al crear usuario`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }

  cancel(): void {
    swal({
      title: "Volver",
      text: "¿Seguro que quiere volver? No se guardarán los cambios",
      icon: "warning", dangerMode: true,
      buttons: { cancel: true, confirm: true }
    }).then((volver) => {
      if (volver) {
        this.router.navigate(['/admin/usuarios']);
      }
    })
  }
}

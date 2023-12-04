import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { UserEditDTO, UserReadIDDTO } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {
  user: UserEditDTO;
  formg: FormGroup;
  private subs: Subscription = new Subscription();

  constructor(private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.formg = this.formBuilder.group({
      email: [, [Validators.required, Validators.maxLength(64), Validators.email]],
      nombre: [, [Validators.required, Validators.maxLength(64)]],
      apellido: [, [Validators.required, Validators.maxLength(64)]]
    })
    this.loadForm();
  }

  edit(): void {
    if (!this.formg.valid) {
      swal({ title: 'Atención!', text: `Formulario inválido. Revisá los campos.`, icon: 'warning' });
      return;
    }

    let request: UserEditDTO = this.formg.value as UserEditDTO;
    request.idUsuario = this.user.idUsuario;
    this.subs.add(
      this.userService.editUser(request).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Todo ok!', text: `Se editó el usuario con éxito`, icon: 'success' });
            this.router.navigate(['/admin/usuarios'])
          } else {
            swal({ title: 'Oops!', text: `Error al editar usuario: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al editar usuario: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al editar usuario`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }

  loadForm(): void {
    this.subs.add(
      this.activatedRoute.params.subscribe((params) => {
        let id = parseInt(params['id']);
        if (!id) {
          swal({ title: 'Oops!', text: `Error en el parámetro ID. Revisar URL.`, icon: 'error' });
          return;
        }
        this.subs.add(
          this.userService.getById(id).subscribe({
            next: (result: ApiResult) => {
              if (result.ok && result.result) {
                this.user = result.result[0] as UserReadIDDTO;
                this.formg.patchValue(this.user);
              } else {
                swal({ title: 'Oops!', text: `Error al obtener el usuario con ID ${id}: ${result.message}`, icon: 'error' });
                console.log(result.message);
              }
            },
            error: (err) => {
              swal({ title: 'Oops!', text: `Error al obtener el producto con ID ${id}`, icon: 'error' });
              console.log(err);
            }
          })
        )
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

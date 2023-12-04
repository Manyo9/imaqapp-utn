import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { UserListDTO } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit, OnDestroy {
  public list: UserListDTO[];
  private sub = new Subscription();
  filtros: FormGroup;
  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.filtros = this.formBuilder.group({
      eliminados: [false,]
    })
    this.updateList();
    this.filtros.valueChanges.subscribe(() => {
      this.updateList();
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  updateList(): void {
    let eliminados: boolean | undefined = this.filtros.get('eliminados')?.value
    if (eliminados === undefined) {
      eliminados = false;
    }
    this.sub.add(
      this.userService.getAll(eliminados).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            this.list = result.result as UserListDTO[];
          } else {
            swal({ title: 'Oops!', text: `Error al obtener el listado de usuarios: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al obtener el listado de usuarios: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al obtener el listado de usuarios`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }

  newUser(): void {
    this.router.navigate(['admin/usuarios/nuevo']);
  }

  editUser(id: number): void {
    this.router.navigate([`admin/usuarios/editar/${id}`]);
  }
}

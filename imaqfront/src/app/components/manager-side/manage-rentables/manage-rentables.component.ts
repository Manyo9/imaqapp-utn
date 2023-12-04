import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { MachineListDTO } from 'src/app/models/Machine';
import { MachineService } from 'src/app/services/machine.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-manage-rentables',
  templateUrl: './manage-rentables.component.html',
  styleUrls: ['./manage-rentables.component.scss']
})

export class ManageRentablesComponent implements OnInit, OnDestroy{
  public list: MachineListDTO[];
  private sub = new Subscription();
  constructor(private machineService: MachineService,
    private router: Router) { }

  ngOnInit(): void {
    this.updateList();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  updateList(): void {
    this.sub.add(
      this.machineService.getAll().subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            this.list = result.result as MachineListDTO[];
          } else {
            swal({title:'Oops!', text:`Error al obtener el listado de maquinas: ${result.message}`, icon: 'error'});
          }
        },
        error: (error) => {
          if(error.error.message){
            swal({ title: 'Oops!', text: `Error al obtener el listado de maquinas: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al obtener el listado de maquinas.`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }

  newRentable(): void {
    this.router.navigate(['gestion/maquinas/nuevo']);
  }

  editRentable(id: number): void {
    this.router.navigate([`gestion/maquinas/editar/${id}`]);
  }
}

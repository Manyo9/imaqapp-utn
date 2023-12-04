import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { RequestListDTO } from 'src/app/models/Request';
import { StatusGeneric, TypeGeneric } from 'src/app/models/TypeGeneric';
import { RequestService } from 'src/app/services/request.service';
import { TypeService } from 'src/app/services/type.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent {
  list: RequestListDTO[] = [];
  filtros: FormGroup;
  private subs = new Subscription();
  estadosSolicitud: StatusGeneric[] = [];
  tiposSolicitud: TypeGeneric[] = [];
  pageNumber: number = 1;

  constructor(
    private typeService: TypeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private requestService: RequestService
  ) { }

  ngOnInit(): void {
    this.filtros = this.formBuilder.group({
      razonSocial: ['', [Validators.maxLength(64)]],
      idTipoSolicitud: [0,],
      idEstadoSolicitud: [0,]
    })
    this.loadTypes();
    this.loadStatuses();
    this.updateList();
    this.filtros.controls['idTipoSolicitud'].valueChanges.subscribe(() => {
      this.updateList();
    })
    this.filtros.controls['idEstadoSolicitud'].valueChanges.subscribe(() => {
      this.updateList();
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private loadTypes(): void {
    this.subs.add(
      this.typeService.getRequestTypes().subscribe({
        next: (result: ApiResult) => {
          if (result.ok && result.result) {
            this.tiposSolicitud = result.result as TypeGeneric[];
          } else {
            swal({ title: 'Oops!', text: `Error cargar el combo de tipos: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        }, error: (error) => {
          swal({ title: 'Oops!', text: `Error cargar el combo de tipos.`, icon: 'error' });
          console.log(error);
        }
      })
    )
  }

  private loadStatuses(): void {
    this.subs.add(
      this.typeService.getRequestStatuses().subscribe({
        next: (result: ApiResult) => {
          if (result.ok && result.result) {
            this.estadosSolicitud = result.result as StatusGeneric[];
          } else {
            swal({ title: 'Oops!', text: `Error cargar el combo de estados: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        }, error: (error) => {
          swal({ title: 'Oops!', text: `Error cargar el combo de estados.`, icon: 'error' });
          console.log(error);
        }
      })
    )
  }

  updateList(): void {
    let idestado: number | undefined = this.filtros.get('idEstadoSolicitud')?.value;
    let idtipo: number | undefined = this.filtros.get('idTipoSolicitud')?.value;
    let razonsocial: string | undefined = this.filtros.get('razonSocial')?.value;

    if (idestado === undefined) {
      idestado = 0;
    }

    if (idtipo === undefined) {
      idtipo = 0;
    }

    if (razonsocial === undefined) {
      razonsocial = "";
    }

    if (!this.filtros.valid) {
      swal({ title: 'Atención!', text: `Filtros inválidos.`, icon: 'warning' });
      return;
    }

    this.subs.add(
      this.requestService.getAll(this.pageNumber, idestado, idtipo, razonsocial)
        .subscribe({
          next: (result: ApiResult) => {
            if (result.ok) {
              this.list = result.result as RequestListDTO[];
              if (result.result.length === 0) {
                swal({ title: 'Oops!', text: `No hay resultados en esa página o filtro.`, icon: 'warning' });
              }
            } else {
              swal({ title: 'Oops!', text: `Error al obtener el listado de solicitudes: ${result.message}`, icon: 'error' });
            }
          },
          error: (error) => {
            if (error.error.message) {
              swal({ title: 'Oops!', text: `Error al obtener el listado de solicitudes: ${error.error.message}`, icon: 'error' });
            } else {
              swal({ title: 'Oops!', text: `Error al obtener el listado de solicitudes.`, icon: 'error' });
              console.error(error);
            }
          }
        })
    )
  }

  seeDetails(id: number, type: string): void {
    if (type === 'ALQUILER') {
      this.router.navigate([`gestion/solicitudes/alquileres/${id}`])
    } else if (type === 'OFERTA') {
      this.router.navigate([`gestion/solicitudes/ofertas/${id}`])
    } else if (type === 'REPUESTOS') {
      this.router.navigate([`gestion/solicitudes/repuestos/${id}`])
    } else if (type === 'SERVICIO') {
      this.router.navigate([`gestion/solicitudes/servicios/${id}`])
    } else {
      swal({ title: 'Oops!', text: `Tipo de solicitud inválida`, icon: 'error' });
    }
  }

  nextPage(): void {
    this.pageNumber++;
    this.updateList();
  }

  previousPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.updateList();
    } else {
      this.pageNumber = 1;
      this.updateList();
    }
  }
}
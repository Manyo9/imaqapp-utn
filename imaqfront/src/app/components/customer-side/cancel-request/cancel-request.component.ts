import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { RequestTokenDTO } from 'src/app/models/Request';
import { RequestService } from 'src/app/services/request.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-cancel-request',
  templateUrl: './cancel-request.component.html',
  styleUrls: ['./cancel-request.component.scss']
})
export class CancelRequestComponent implements OnInit, OnDestroy {

  request: RequestTokenDTO = {
    idSolicitud: 0,
    estadoSolicitud: '',
    tipoSolicitud: '',
    nombreSolicitante: '',
    razonSocial: '',  
  }
  private subs: Subscription = new Subscription();
  private token: string;

  constructor(
    private requestService: RequestService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }
  
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.loadReq();
  }

  loadReq(): void {
    this.subs.add(
      this.activatedRoute.params.subscribe((params) => {
        this.token = params['token'];
        if (!this.token || this.token === '') {
          swal({ title: 'Oops!', text: `Error en el parámetro "token". Revisar URL.`, icon: 'error' });
          this.router.navigate(['/inicio']);
          return;
        }
        this.subs.add(
          this.requestService.getByToken(this.token).subscribe({
            next: (result: ApiResult) => {
              if (result.ok && result.result) {
                this.request = result.result as RequestTokenDTO;
              } else {
                swal({ title: 'Oops!', text: `No se encontró una solicitud con ese token.`, icon: 'error' });
                this.router.navigate(['/inicio']);
                console.log(result.message);
              }
            },
            error: (error) => {
              if (error.error.message) {
                swal({ title: 'Oops!', text: `Error al consultar solicitud: ${error.error.message}`, icon: 'error' });
                this.router.navigate(['/inicio']);
              } else {
                swal({ title: 'Oops!', text: `Error al consultar solicitud`, icon: 'error' });
                this.router.navigate(['/inicio']);
                console.error(error);
              }
            }
          })
        )
      })
    )
  }

  cancelRequest() {
    swal({
      title: "Cancelar solicitud",
      text: "¿Seguro que quiere cancelar su solicitud?",
      icon: "warning", dangerMode: true,
      buttons: { cancel: true, confirm: true }
    }).then((eliminar) => {
      if (eliminar) {
        this.subs.add(
          this.requestService.cancelByToken(this.token).subscribe({
            next: (result: ApiResult) => {
              if (result.ok){
                swal({ title: 'Ok!', text: `Se canceló la solicitud # ${this.request.idSolicitud} correctamente`, icon: 'success' });
              } else {
                swal({ title: 'Atención!', text: `${result.message}`, icon: 'warning' });
              }
            },
            error: (error) => {
              if (error.error.message) {
                swal({ title: 'Oops!', text: `Error al cancelar solicitud: ${error.error.message}`, icon: 'error' });
              } else {
                swal({ title: 'Oops!', text: `Error al cancelar solicitud`, icon: 'error' });
                console.error(error);
              }
            }
          })
        )
      }
    })
  }
}

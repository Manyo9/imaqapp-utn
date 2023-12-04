import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { Offer, PurchaseRequestIDDTO } from 'src/app/models/Offer';
import { RequestIDDTO } from 'src/app/models/Request';
import { StatusGeneric } from 'src/app/models/TypeGeneric';
import { RequestService } from 'src/app/services/request.service';
import { TypeService } from 'src/app/services/type.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-details-offers',
  templateUrl: './details-offers.component.html',
  styleUrls: ['./details-offers.component.scss']
})
export class DetailsOffersComponent {

  request: RequestIDDTO;
  purchaseReq: PurchaseRequestIDDTO;
  offer: Offer
  estadosSolicitud: StatusGeneric[];

  formst: FormGroup;

  private subs: Subscription = new Subscription();

  constructor(
    private requestService: RequestService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private typeService: TypeService,
    private formBuilder: FormBuilder
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.formst = this.formBuilder.group({
      idEstadoSolicitud: [0, [Validators.required, Validators.min(1)]]
    })
    this.loadRequest();
    this.loadStatuses();
  }

  return() {
    this.router.navigate([`solicitudes`])
  }

  generateBudget(idSolicitud: number): void {
    this.router.navigate([`gestion/generarPresupuesto/${idSolicitud}`])
  }

  reject(): void {

    let idEstadoSolicitud: number = 7;

    this.subs.add(
      this.requestService.updateStatus(this.request.idSolicitud, idEstadoSolicitud).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Todo ok!', text: `Estado actualizado`, icon: 'success' });
            this.loadRequest();
          } else {
            swal({ title: 'Oops!', text: `Error al actualizar estado: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al actualizar estado: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al actualizar estado.`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }

  updateStatus(): void {
    if (!this.formst.valid) {
      swal({ title: 'Atención!', text: `Ingresá un estado antes de actualizar.`, icon: 'warning' });
      return;
    }

    let idEstadoSolicitud: number = this.formst.get('idEstadoSolicitud')?.value;

    this.subs.add(
      this.requestService.updateStatus(this.request.idSolicitud, idEstadoSolicitud).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Todo ok!', text: `Estado actualizado`, icon: 'success' });
            this.loadRequest();
          } else {
            swal({ title: 'Oops!', text: `Error al actualizar estado: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al actualizar estado: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al actualizar estado.`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }

  private loadRequest(): void {
    this.subs.add(
      this.activatedRoute.params.subscribe((params) => {
        let id = parseInt(params['id']);
        if (!id) {
          swal({ title: 'Oops!', text: `Error en el parámetro ID. Revisar URL.`, icon: 'error' });
          return;
        }
        this.subs.add(
          this.requestService.getPurchaseRequest(id).subscribe({
            next: (result: ApiResult) => {
              if (result.ok && result.result) {
                this.offer = result.result.offer as Offer;
                this.purchaseReq = result.result.purchaseReq as PurchaseRequestIDDTO;
                this.request = result.result.request as RequestIDDTO;
              } else {
                swal({ title: 'Oops!', text: `Error al obtener la solicitud con ID ${id}. Es posible que no exista.`, icon: 'error' });
                this.router.navigate(['/gestion/ofertas']);
              }
            },
            error: (error) => {
              if (error.error.message) {
                swal({ title: 'Oops!', text: `Error al obtener la solicitud ${error.error.message}`, icon: 'error' });
              } else {
                swal({ title: 'Oops!', text: `Error al obtener la solicitud.`, icon: 'error' });
                console.error(error);
              }
            }
          })
        )
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
}

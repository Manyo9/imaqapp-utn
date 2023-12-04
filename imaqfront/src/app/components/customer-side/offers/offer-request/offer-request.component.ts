import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { OfferShortDTO } from 'src/app/models/Offer';
import { RequestNewDTO } from 'src/app/models/Request';
import { OfferService } from 'src/app/services/offer.service';
import { RequestService } from 'src/app/services/request.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-offer-request',
  templateUrl: './offer-request.component.html',
  styleUrls: ['./offer-request.component.scss']
})
export class OfferRequestComponent implements OnInit, OnDestroy {

  private subs: Subscription = new Subscription();
  offer: OfferShortDTO = { nombre: '', descripcion: '', precio: 0, fechaFin: '' };
  formreq: FormGroup;
  request: RequestNewDTO;
  idOferta: number;

  constructor(
    private offerService: OfferService,
    private requestService: RequestService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.loadOffer();
    this.formreq = this.formBuilder.group({
      nombreSolicitante: [, [Validators.required, Validators.maxLength(64)]],
      razonSocial: [, [Validators.required, Validators.maxLength(64)]],
      telefonoContacto: [, [Validators.required, Validators.maxLength(15)]],
      emailContacto: [, [Validators.required, Validators.maxLength(64), Validators.email]],
      comentario: [, [Validators.maxLength(512)]]
    })
  }

  cancel(): void {
    swal({
      title: "Volver",
      text: "¿Seguro que quiere volver? No se guardarán los cambios",
      icon: "warning", dangerMode: true,
      buttons: { cancel: true, confirm: true }
    }).then((volver) => {
      if (volver) {
        this.router.navigate(['/ofertas']);
      }
    })
  }

  loadOffer(): void {
    this.subs.add(
      this.activatedRoute.params.subscribe((params) => {
        this.idOferta = parseInt(params['id']);
        if (!this.idOferta || isNaN(this.idOferta)) {
          swal({ title: 'Oops!', text: `Error en el parámetro ID. Revisar URL.`, icon: 'error' });
          return;
        }
        this.subs.add(
          this.offerService.getByIdShort(this.idOferta).subscribe({
            next: (result: ApiResult) => {
              if (result.ok && result.result) {
                this.offer = result.result as OfferShortDTO;
              } else {
                swal({ title: 'Oops!', text: `Error al obtener la oferta con ID ${this.idOferta}. Es posible que no exista.`, icon: 'error' });
                this.router.navigate(['/ofertas']);
              }
            },
            error: (error) => {
              if (error.error.message) {
                swal({ title: 'Oops!', text: `Error al obtener la oferta: ${error.error.message}`, icon: 'error' });
              } else {
                swal({ title: 'Oops!', text: `Error al obtener la oferta.`, icon: 'error' });
                console.error(error);
              }
            }
          })
        )
      })
    )
  }

  save(): void {
    if (!this.formreq.valid) {
      swal({ title: 'Atención!', text: `Formulario inválido. Revisá los campos.`, icon: 'warning' });
      return;
    }

    this.request = this.formreq.value as RequestNewDTO;

    this.subs.add(
      this.requestService.addPurchaseRequest(this.request, this.idOferta).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Todo ok!', text: `${result.message}.`, icon: 'success' });
            this.router.navigate(['/inicio']);
          } else {
            swal({ title: 'Oops!', text: `Error al solicitar alquiler: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al solicitar alquiler: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al solicitar alquiler`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }
}
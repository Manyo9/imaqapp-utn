import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { OfferShortDTO, OfferDetailIDShortDTO } from 'src/app/models/Offer';
import { OfferService } from 'src/app/services/offer.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-offer-details-customer',
  templateUrl: './offer-details-customer.component.html',
  styleUrls: ['./offer-details-customer.component.scss']
})
export class OfferDetailsCustomerComponent {
  offer: OfferShortDTO = { nombre: '', descripcion: '', precio: 0, fechaFin: '' };
  details: OfferDetailIDShortDTO[];
  idOferta: number;
  private subs: Subscription = new Subscription();

  constructor(
    private offerService: OfferService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.loadOffer();
    this.loadTable();
  }

  return(): void {
    this.router.navigate(['/ofertas']);
  }

  toRequest(): void {
    this.router.navigate([`/ofertas/solicitar/${this.idOferta}`]);
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

  loadTable(): void {
    this.subs.add(
      this.activatedRoute.params.subscribe((params) => {
        let id = parseInt(params['id']);
        if (!id) {
          swal({ title: 'Oops!', text: `Error en el parámetro ID. Revisar URL.`, icon: 'error' });
          return;
        }

        this.offerService.getDetailsShort(id).subscribe({
          next: (result: ApiResult) => {
            if (result.ok && result.result) {
              this.details = result.result as OfferDetailIDShortDTO[];
            } else {
              swal({ title: 'Oops!', text: `Error al obtener detalles de la oferta # ${id}: ${result.message}`, icon: 'error' });
            }
          },
          error: (error) => {
            if (error.error.message) {
              swal({ title: 'Oops!', text: `Error al obtener los detalles: ${error.error.message}`, icon: 'error' });
            } else {
              swal({ title: 'Oops!', text: `Error al obtener los detalles.`, icon: 'error' });
              console.error(error);
            }
          }
        })
      }
      ))
  }
}

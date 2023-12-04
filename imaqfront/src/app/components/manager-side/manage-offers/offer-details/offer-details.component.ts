import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { Offer, OfferDetailIDDTO } from 'src/app/models/Offer';
import { OfferService } from 'src/app/services/offer.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss']
})
export class OfferDetailsComponent implements OnInit, OnDestroy {
  offer: Offer;
  details: OfferDetailIDDTO[];
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
    this.router.navigate(['/gestion/ofertas']);
  }

  loadOffer(): void {
    this.subs.add(
      this.activatedRoute.params.subscribe((params) => {
        let id = parseInt(params['id']);
        if (!id) {
          swal({ title: 'Oops!', text: `Error en el parámetro ID. Revisar URL.`, icon: 'error' });
          return;
        }
        this.subs.add(
          this.offerService.getById(id).subscribe({
            next: (result: ApiResult) => {
              if (result.ok && result.result) {
                this.offer = result.result as Offer;
                this.offer.idOferta = id;
              } else {
                swal({ title: 'Oops!', text: `Error al obtener la oferta con ID ${id}. Es posible que no exista.`, icon: 'error' });
                this.router.navigate(['/gestion/ofertas']);
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

        this.offerService.getDetails(id).subscribe({
          next: (result: ApiResult) => {
            if (result.ok && result.result) {
              this.details = result.result as OfferDetailIDDTO[];
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

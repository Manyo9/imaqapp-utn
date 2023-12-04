import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { OfferListFrontDTO } from 'src/app/models/Offer';
import { OfferService } from 'src/app/services/offer.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit, OnDestroy {

  offers: OfferListFrontDTO[] = [];

  private subs: Subscription = new Subscription();

  constructor(
    private offerService: OfferService,
    private router: Router) { }

  ngOnInit(): void {
    this.getOffers();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  seeDetails(id: number): void {
    this.router.navigate([`ofertas/ver/${id}`]);
  }

  private getOffers(): void {
    this.subs.add(
      this.offerService.getAvailable()
        .subscribe({
          next: (result: ApiResult) => {
            if (result.ok) {
              this.offers = result.result as OfferListFrontDTO[];
            } else {
              swal({ title: 'Oops!', text: `Error al obtener ofertas: ${result.message}`, icon: 'error' });
            }
          },
          error: (error) => {
            if (error.error.message) {
              swal({ title: 'Oops!', text: `Error al obtener ofertas: ${error.error.message}`, icon: 'error' });
            } else {
              swal({ title: 'Oops!', text: `Error al obtener ofertas.`, icon: 'error' });
              console.error(error);
            }
          }
        })
    )
  }
}

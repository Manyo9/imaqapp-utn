import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { Offer } from 'src/app/models/Offer';
import { OfferService } from 'src/app/services/offer.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-mark-sold-offer',
  templateUrl: './mark-sold-offer.component.html',
  styleUrls: ['./mark-sold-offer.component.scss']
})
export class MarkSoldOfferComponent implements OnDestroy, OnInit {
  @Input() offer: Offer;
  @Output() onMarked = new EventEmitter();
  isDisabled: boolean;
  constructor(private offerService: OfferService) { }

  private subscription = new Subscription();

  ngOnInit(): void {
    this.checkDisabled();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  checkDisabled() {
    let curDate = new Date();
    let offerDate = new Date(this.offer.fechaFin)
    if (offerDate < curDate || this.offer.vendida) {
      this.isDisabled = true;
    }
  }

  markSold(): void {
    swal({
      title: "Venta de Oferta",
      text: "¿Seguro que quiere marcar la oferta como vendida?",
      icon: "warning", dangerMode: true,
      buttons: { cancel: true, confirm: true }
    }).then((eliminar) => {
      if (eliminar) {
        this.subscription.add(
          this.offerService.markSold(this.offer.idOferta).subscribe({
            next: (result: ApiResult) => {
              if (result.ok) {
                swal({ title: 'Ok!', text: `Se actualizó la oferta con ID ${this.offer.idOferta} correctamente`, icon: 'success' });
                this.onMarked.emit();
              } else {
                swal({ title: 'Oops!', text: `Error al actualizar la oferta: ${result.message}`, icon: 'error' });
              }
            },
            error: (error) => {
              if (error.error.message) {
                swal({ title: 'Oops!', text: `Error al actualizar la oferta: ${error.error.message}`, icon: 'error' });
              } else {
                swal({ title: 'Oops!', text: `Error al actualizar la oferta`, icon: 'error' });
                console.error(error);
              }
            }
          })
        )
      }
    })
  }
}
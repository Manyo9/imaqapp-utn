import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { Offer } from 'src/app/models/Offer';
import { OfferService } from 'src/app/services/offer.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-cancel-offer',
  templateUrl: './cancel-offer.component.html',
  styleUrls: ['./cancel-offer.component.scss']
})
export class CancelOfferComponent implements OnDestroy, OnInit{
  @Input() offer: Offer;
  @Output() onDeleted = new EventEmitter();
  isDisabled: boolean = false;
  constructor(private offerService: OfferService) { }

  private subscription = new Subscription();

  ngOnInit(): void {
    this.checkDisabled();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  checkDisabled(){
    let curDate = new Date();
    let offerDate = new Date(this.offer.fechaFin)
    if(offerDate < curDate || this.offer.vendida){
      this.isDisabled = true;
    }
  }

  cancelOffer() {
    swal({
      title: "Cancelar oferta",
      text: "¿Seguro que quiere cancelar la oferta?",
      icon: "warning", dangerMode: true,
      buttons: { cancel: true, confirm: true }
    }).then((eliminar) => {
      if (eliminar) {
        this.subscription.add(
          this.offerService.cancelOffer(this.offer.idOferta).subscribe({
            next: (result: ApiResult) => {
              if(result.ok){
                swal({ title: 'Ok!', text: `Se canceló la oferta con ID ${this.offer.idOferta} correctamente`, icon: 'success' });
                this.onDeleted.emit();
              } else {
                swal({ title: 'Oops!', text: `Error al cancelar la oferta: ${result.message}`, icon: 'error' });
              }
            },
            error: (error) => {
              if (error.error.message) {
                swal({ title: 'Oops!', text: `Error al cancelar la oferta: ${error.error.message}`, icon: 'error' });
              } else {
                swal({ title: 'Oops!', text: `Error al cancelar la oferta`, icon: 'error' });
                console.error(error);
              }
            }
          })
        )
      }
    })
  }
}
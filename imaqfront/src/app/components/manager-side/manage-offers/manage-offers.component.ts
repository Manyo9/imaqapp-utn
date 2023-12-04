import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { Offer, OfferListFrontDTO } from 'src/app/models/Offer';
import { OfferService } from 'src/app/services/offer.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-manage-offers',
  templateUrl: './manage-offers.component.html',
  styleUrls: ['./manage-offers.component.scss']
})
export class ManageOffersComponent implements OnInit, OnDestroy {
  public list: Offer[];
  filtros: FormGroup;
  private sub = new Subscription();
  constructor(
    private offerService: OfferService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.filtros = this.formBuilder.group({
      vigentes: [false,]
    })
    this.updateList();
    this.filtros.valueChanges.subscribe(() => {
      this.updateList();
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  updateList(): void {
    let vigentes: boolean | undefined = this.filtros.get('vigentes')?.value
    if (vigentes === undefined) {
      vigentes = false;
    }
    this.sub.add(
      this.offerService.getAll(vigentes).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            this.list = result.result as Offer[];
          } else {
            swal({ title: 'Oops!', text: `Error al obtener el listado de ofertas: ${result.message}`, icon: 'error' });
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al obtener el listado de ofertas: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al obtener el listado de ofertas.`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }

  newOffer(): void {
    this.router.navigate(['gestion/ofertas/nuevo']);
  }

  editOffer(id: number): void {
    this.router.navigate([`gestion/ofertas/editar/${id}`]);
  }

  seeDetails(id: number): void {
    this.router.navigate([`gestion/ofertas/ver/${id}`]);
  }
}

import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { Offer, OfferEditDTO } from 'src/app/models/Offer';
import { Product } from 'src/app/models/Product';
import { OfferService } from 'src/app/services/offer.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss']
})
export class EditOfferComponent {
  formg: FormGroup;
  offer: OfferEditDTO;
  private subs: Subscription = new Subscription();

  constructor(
    private offerService: OfferService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.formg = this.formBuilder.group({
      nombre: [, [Validators.required, Validators.maxLength(64)]],
      descripcion: [, [Validators.maxLength(256)]],
      precio: [, [Validators.required, Validators.min(0), Validators.max(999999999.99)]],
      fechaInicio: [, [Validators.required]],
      fechaFin: [, [Validators.required]]
    })
    this.loadForm();
  }

  edit(): void {
    if (!this.formg.valid) {
      swal({ title: 'Atención!', text: `Formulario inválido. Revisá los campos.`, icon: 'warning' });
      return;
    }

    let year, month, day: number;
    let startdate = this.formg.get('fechaInicio')!.value
    let enddate = this.formg.get('fechaFin')!.value

    let parts = startdate.split('-');
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);

    startdate = new Date(Date.UTC(year, month, day, 3, 0, 0));

    parts = enddate.split('-');
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);

    enddate = new Date(Date.UTC(year, month, day + 1, 3, 0, 0));

    let request: OfferEditDTO = this.formg.value as OfferEditDTO;
    request.fechaInicio = startdate;
    request.fechaFin = enddate;
    request.idOferta = this.offer.idOferta;

    this.subs.add(
      this.offerService.editOffer(request).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Todo ok!', text: `${result.message}`, icon: 'success' });
            this.router.navigate(['/gestion/ofertas']);
          } else {
            swal({ title: 'Oops!', text: `Error al editar oferta: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al editar oferta: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al editar oferta`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }

  cancel(): void {
    swal({
      title: "Volver",
      text: "¿Seguro que quiere volver? No se guardarán los cambios",
      icon: "warning", dangerMode: true,
      buttons: { cancel: true, confirm: true }
    }).then((volver) => {
      if (volver) {
        this.router.navigate(['/gestion/ofertas']);
      }
    })
  }

  loadForm(): void {
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
                this.offer = result.result as OfferEditDTO;
                this.offer.idOferta = id;
                this.formg.patchValue(this.offer);
              } else {
                swal({ title: 'Oops!', text: `Error al obtener la oferta con ID ${id}: ${result.message}`, icon: 'error' });
                console.log(result.message);
              }
            },
            error: (err) => {
              swal({ title: 'Oops!', text: `Error al obtener la ofertala oferta con ID ${id}`, icon: 'error' });
              console.log(err);
            }
          })
        )
      })
    )
  }
}

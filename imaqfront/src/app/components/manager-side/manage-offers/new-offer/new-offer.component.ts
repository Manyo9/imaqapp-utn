import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { OfferDetailNewFrontDTO, OfferNewDTO } from 'src/app/models/Offer';
import { ProductListDTO } from 'src/app/models/Product';
import { OfferService } from 'src/app/services/offer.service';
import { ProductService } from 'src/app/services/product.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.component.html',
  styleUrls: ['./new-offer.component.scss']
})
export class NewOfferComponent {
  formg: FormGroup;
  offer: OfferNewDTO;
  details: OfferDetailNewFrontDTO[];
  products: ProductListDTO[] = [];
  selectedProducts: ProductListDTO[] = [];
  private subs: Subscription = new Subscription();

  constructor(
    private offerService: OfferService,
    private productService: ProductService,
    private router: Router,
    private formBuilder: FormBuilder) { }

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
    this.loadProducts();
  }

  save(): void {
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

    if (this.selectedProducts.length < 1) {
      swal({ title: 'Atención!', text: `Seleccione por lo menos una máquina`, icon: 'warning' });
      return;
    }

    this.offer = this.formg.value as OfferNewDTO;
    this.offer.fechaInicio = startdate;
    this.offer.fechaFin = enddate;
    this.details = this.selectedProducts.map(product => ({ idProducto: product.idProducto, cantidad: 1 }));

    this.subs.add(
      this.offerService.addOffer(this.offer, this.details).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Todo ok!', text: `Oferta creada con éxito.`, icon: 'success' });
            this.router.navigate(['/gestion/ofertas']);
          } else {
            swal({ title: 'Oops!', text: `Error al crear oferta: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al crear oferta: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al crear oferta`, icon: 'error' });
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

  loadProducts(): void {

    this.subs.add(
      this.productService.getOfferable().subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            this.products = result.result as ProductListDTO[];
            if (result.result.length === 0) {
              swal({ title: 'Atención', text: `No se encontraron productos disponibles para ofertar`, icon: 'warning' });
            }
          } else {
            swal({ title: 'Oops!', text: `Error al obtener productos disponibles: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al obtener productos disponibles: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al obtener productos disponibles`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }

  addProduct(product: ProductListDTO) {
    const index = this.products.findIndex(p => p.idProducto === product.idProducto);
    if (index !== -1) {
      this.selectedProducts.push(this.products[index]);
      this.products.splice(index, 1);
    }
  }

  removeProduct(product: ProductListDTO) {
    const index = this.selectedProducts.findIndex(p => p.idProducto === product.idProducto);
    if (index !== -1) {
      this.products.push(this.selectedProducts[index]);
      this.selectedProducts.splice(index, 1);
    }
  }
}
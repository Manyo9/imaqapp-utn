import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { ProductNewDTO } from 'src/app/models/Product';
import { TypeGeneric } from 'src/app/models/TypeGeneric';
import { ProductService } from 'src/app/services/product.service';
import { TypeService } from 'src/app/services/type.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit, OnDestroy {
  product: ProductNewDTO;
  formg: FormGroup;
  tiposProducto: TypeGeneric[];
  private subs: Subscription = new Subscription();

  constructor(
    private productService: ProductService,
    private typeService: TypeService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.formg = this.formBuilder.group({
      idTipoProducto: [, [Validators.required]],
      nombre: [, [Validators.required, Validators.maxLength(64)]],
      descripcion: [, [Validators.maxLength(256)]],
      precio: [, [Validators.required, Validators.min(0), Validators.max(999999999.99)]],
      codigoParte: [, [Validators.maxLength(20)]]
    })
    this.loadTypes();
  }

  save(): void {
    if (!this.formg.valid) {
      swal({ title: 'Atención!', text: `Formulario inválido. Revisá los campos.`, icon: 'warning' });
      return;
    }

    this.product = this.formg.value as ProductNewDTO;
    this.subs.add(
      this.productService.addProduct(this.product).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Todo ok!', text: `Se creó el producto con éxito`, icon: 'success' });
            this.router.navigate(['/gestion/productos']);
          } else {
            swal({ title: 'Oops!', text: `Error al crear producto: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al crear producto: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al crear producto`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }

  loadTypes(): void {
    this.subs.add(
      this.typeService.getProductTypes().subscribe({
        next: (result: ApiResult) => {
          if (result.ok && result.result) {
            this.tiposProducto = result.result as TypeGeneric[];
          } else {
            swal({ title: 'Oops!', text: `Error cargar el combo de tipos: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        }, error: (error) => {
          swal({ title: 'Oops!', text: `Error cargar el combo de tipos.`, icon: 'error' });
          console.log(error);
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
        this.router.navigate(['/gestion/productos']);
      }
    })
  }
}
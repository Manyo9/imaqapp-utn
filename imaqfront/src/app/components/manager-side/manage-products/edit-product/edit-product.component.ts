import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { Product, ProductEditDTO } from 'src/app/models/Product';
import { TypeGeneric } from 'src/app/models/TypeGeneric';
import { ProductService } from 'src/app/services/product.service';
import { TypeService } from 'src/app/services/type.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit, OnDestroy {
  product: ProductEditDTO;
  formg: FormGroup;
  tiposProducto: TypeGeneric[];
  private subs: Subscription = new Subscription();

  constructor(
    private productService: ProductService,
    private typeService: TypeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.formg = this.formBuilder.group({
      idTipoProducto: [, [Validators.required]],
      nombre: [, [Validators.required, Validators.maxLength(64)]],
      descripcion: [, [Validators.maxLength(256)]],
      precio: [, [Validators.required, Validators.min(0), Validators.max(999999999.99)]],
      codigoParte: [, [Validators.maxLength(20)]],
      activo: [,]
    })
    this.loadTypes();
    this.loadForm();
  }

  edit(): void {
    if (!this.formg.valid) {
      swal({ title: 'Atención!', text: `Formulario inválido. Revisá los campos.`, icon: 'warning' });
      return;
    }
    
    let request: ProductEditDTO = this.formg.value as ProductEditDTO;
    request.idProducto = this.product.idProducto;
    this.subs.add(
      this.productService.editProduct(request).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Todo ok!', text: `Se editó el producto con éxito`, icon: 'success' });
            this.router.navigate(['/gestion/productos'])
          } else {
            swal({ title: 'Oops!', text: `Error al editar producto: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if(error.error.message){
            swal({ title: 'Oops!', text: `Error al editar producto: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al editar producto`, icon: 'error' });
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

  loadForm(): void {
    this.subs.add(
      this.activatedRoute.params.subscribe((params) => {
        let id = parseInt(params['id']);
        if (!id) {
          swal({ title: 'Oops!', text: `Error en el parámetro ID. Revisar URL.`, icon: 'error' });
          return;
        }
        this.subs.add(
          this.productService.getById(id).subscribe({
            next: (result: ApiResult) => {
              if (result.ok && result.result) {
                this.product = result.result[0] as Product;
                this.formg.patchValue(this.product);
              } else {
                swal({ title: 'Oops!', text: `Error al obtener el producto con ID ${id}: ${result.message}`, icon: 'error' });
                console.log(result.message);
              }
            },
            error: (err) => {
              swal({ title: 'Oops!', text: `Error al obtener el producto con ID ${id}`, icon: 'error' });
              console.log(err);
            }
          })
        )
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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { ProductListDTO } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent implements OnInit, OnDestroy {
  public list: ProductListDTO[];
  filtros: FormGroup;
  private sub = new Subscription();
  constructor(
    private productService: ProductService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.filtros = this.formBuilder.group({
      eliminados: [false,]
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
    let eliminados: boolean | undefined = this.filtros.get('eliminados')?.value
    if (eliminados === undefined) {
      eliminados = false;
    }
    this.sub.add(
      this.productService.getAll(eliminados).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            this.list = result.result as ProductListDTO[];
          } else {
            swal({ title: 'Oops!', text: `Error al obtener el listado de productos: ${result.message}`, icon: 'error' });
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al obtener el listado de productos: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al obtener el listado de productos.`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }

  newProduct(): void {
    this.router.navigate(['gestion/productos/nuevo']);
  }

  editProduct(id: number): void {
    this.router.navigate([`gestion/productos/editar/${id}`]);
  }
}


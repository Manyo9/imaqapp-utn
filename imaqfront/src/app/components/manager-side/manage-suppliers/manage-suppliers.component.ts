import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { SupplierListDTO } from 'src/app/models/Supplier';
import { SupplierService } from 'src/app/services/supplier.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-manage-suppliers',
  templateUrl: './manage-suppliers.component.html',
  styleUrls: ['./manage-suppliers.component.scss']
})
export class ManageSuppliersComponent implements OnInit, OnDestroy {
  public list: SupplierListDTO[];
  filtros: FormGroup;
  private sub = new Subscription();
  constructor(
    private supplierService: SupplierService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.filtros = this.formBuilder.group({
      eliminados: [false,]
    })
    this.filtros.valueChanges.subscribe(() => {
      this.updateList();
    })
    this.updateList();
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
      this.supplierService.getAll(eliminados).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            this.list = result.result as SupplierListDTO[];
          } else {
            swal({ title: 'Oops!', text: `Error al obtener el listado de proveedores: ${result.message}`, icon: 'error' });
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al obtener el listado de proveedores: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al obtener el listado de proveedores.`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }

  newSupplier(): void {
    this.router.navigate(['gestion/proveedores/nuevo']);
  }

  editSupplier(id: number): void {
    this.router.navigate([`gestion/proveedores/editar/${id}`]);
  }
}


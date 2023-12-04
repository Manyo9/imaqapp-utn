import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { SupplierNewDTO } from 'src/app/models/Supplier';
import { SupplierService } from 'src/app/services/supplier.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-new-supplier',
  templateUrl: './new-supplier.component.html',
  styleUrls: ['./new-supplier.component.scss']
})
export class NewSupplierComponent implements OnInit, OnDestroy {
  supplier: SupplierNewDTO;
  formg: FormGroup;
  private subs: Subscription = new Subscription();

  constructor(private supplierService: SupplierService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.formg = this.formBuilder.group({
      cuit: [, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      razonSocial: [, [Validators.required, Validators.maxLength(64)]],
      nombreContacto: [, [Validators.required, Validators.maxLength(64)]],
      calle: [, [Validators.required, Validators.maxLength(64)]],
      numCalle: [, [Validators.required, Validators.min(0), Validators.max(9999999)]],
      observaciones: [, [Validators.required, Validators.maxLength(256)]],
      email: [, [Validators.required, Validators.maxLength(64), Validators.email]],
      telefono: [, [Validators.required, Validators.maxLength(15)]]
    })
  }

  save(): void {
    if (!this.formg.valid) {
      swal({ title: 'Atención!', text: `Formulario inválido. Revisá los campos.`, icon: 'warning' });
      return;
    }

    this.supplier = this.formg.value as SupplierNewDTO;
    this.subs.add(
      this.supplierService.add(this.supplier).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Todo ok!', text: `Se guardó el proveedor con éxito`, icon: 'success' });
            this.router.navigate(['/gestion/proveedores']);
          } else {
            swal({ title: 'Oops!', text: `Error al guardar proveedor: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al guardar proveedor: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al guardar proveedor.`, icon: 'error' });
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
        this.router.navigate(['/gestion/proveedores']);
      }
    })
  }
}

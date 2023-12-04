import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { Supplier, SupplierEditDTO } from 'src/app/models/Supplier';
import { SupplierService } from 'src/app/services/supplier.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.scss']
})
export class EditSupplierComponent implements OnInit, OnDestroy {
  supplier: SupplierEditDTO;
  formg: FormGroup;
  private subs: Subscription = new Subscription();

  constructor(private supplierService: SupplierService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
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
      telefono: [, [Validators.required, Validators.maxLength(15)]],
      activo: [,]
    })
    this.loadForm();
  }

  edit(): void {
    if (!this.formg.valid) {
      swal({ title: 'Atención!', text: `Formulario inválido. Revisá los campos.`, icon: 'warning' });
      return;
    }

    let request: SupplierEditDTO = this.formg.value as SupplierEditDTO;
    request.idProveedor = this.supplier.idProveedor;
    this.subs.add(
      this.supplierService.editSupplier(request).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Todo ok!', text: `Se editó el proveedor con éxito`, icon: 'success' });
            this.router.navigate(['/gestion/proveedores'])
          } else {
            swal({ title: 'Oops!', text: `Error al editar proveedor: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al editar proveedor: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al editar proveedor.`, icon: 'error' });
            console.error(error);
          }
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
          this.supplierService.getById(id).subscribe({
            next: (result: ApiResult) => {
              if (result.ok && result.result) {
                this.supplier = result.result[0] as Supplier;
                this.formg.patchValue(this.supplier);
              } else {
                swal({ title: 'Oops!', text: `Error al obtener el proveedor con ID ${id}: ${result.message}`, icon: 'error' });
                console.log(result.message);
              }
            },
            error: (err) => {
              swal({ title: 'Oops!', text: `Error al obtener el proveedor con ID ${id}`, icon: 'error' });
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
        this.router.navigate(['/gestion/proveedores']);
      }
    })
  }
}
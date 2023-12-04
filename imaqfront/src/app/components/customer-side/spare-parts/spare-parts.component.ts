import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { RequestNewFrontDTO } from 'src/app/models/Request';
import { SparePartDetailNewFrontDTO } from 'src/app/models/SparePart';
import { SparePartService } from 'src/app/services/spare-part.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-spare-parts',
  templateUrl: './spare-parts.component.html',
  styleUrls: ['./spare-parts.component.scss']
})
export class SparePartsComponent {

  formreq: FormGroup;
  formpart: FormGroup;

  private request: RequestNewFrontDTO;
  private details: SparePartDetailNewFrontDTO[];

  parts: SparePartDetailNewFrontDTO[] = [];

  private subs: Subscription = new Subscription();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private sPartService: SparePartService) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.formreq = this.formBuilder.group({
      nombreSolicitante: [, [Validators.required, Validators.maxLength(64)]],
      razonSocial: [, [Validators.required, Validators.maxLength(64)]],
      telefonoContacto: [, [Validators.required, Validators.maxLength(15)]],
      emailContacto: [, [Validators.required, Validators.maxLength(64), Validators.email]],
      comentario: [, [Validators.maxLength(512)]]
    })

    this.formpart = this.formBuilder.group({
      marca: [, [Validators.required, Validators.maxLength(32)]],
      modelo: [, [Validators.required, Validators.maxLength(64)]],
      serie: [, [Validators.required, Validators.maxLength(20)]],
      codigoRepuesto: [, [Validators.maxLength(20)]],
      cantidad: [1, [Validators.required, Validators.min(1), Validators.max(60000)]],
      descripcionRepuesto: [, [Validators.required, Validators.maxLength(64)]]
    });
  }

  cancel(): void {
    swal({
      title: "Volver",
      text: "¿Seguro que quiere volver? No se guardarán los cambios",
      icon: "warning", dangerMode: true,
      buttons: { cancel: true, confirm: true }
    }).then((volver) => {
      if (volver) {
        this.router.navigate(['/inicio']);
      }
    })
  }

  save(): void {
    if (!this.formreq.valid) {
      swal({ title: 'Atención!', text: `Formulario inválido.`, icon: 'warning' });
      return;
    }

    if (this.parts.length === 0) {
      swal({ title: 'Atención!', text: `Agregue por lo menos un repuesto.`, icon: 'warning' });
      return;
    }

    this.request = this.formreq.value;
    this.details = this.parts;

    this.subs.add(
      this.sPartService.addSparePartRequest(this.request, this.details).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Todo ok!', text: `${result.message}`, icon: 'success' });
            this.router.navigate(['/inicio']);
          } else {
            swal({ title: 'Oops!', text: `Error al solicitar servicio: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al solicitar servicio: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al solicitar servicio`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }

  addPart(): void {
    if (!this.formpart.valid) {
      return;
    }
    const m: SparePartDetailNewFrontDTO = this.formpart.value;
    this.parts.push(m);
    this.formpart.reset();
  }

  removePart(p: SparePartDetailNewFrontDTO): void {
    const index = this.parts.findIndex(part => part.marca === p.marca
      && part.modelo === p.modelo && part.serie === p.serie);
    if (index !== -1) {
      this.parts.splice(index, 1);
    }
  }

  cleanPartForm(): void {
    this.formpart.reset();
    this.formpart.patchValue({ cantidad: 1 });
  }
}


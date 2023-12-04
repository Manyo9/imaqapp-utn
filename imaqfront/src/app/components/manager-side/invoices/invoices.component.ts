import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { InvoiceDetailNewFrontDTO, InvoiceNewDTO } from 'src/app/models/Invoice';
import { TypeGeneric } from 'src/app/models/TypeGeneric';
import { InvoiceService } from 'src/app/services/invoice.service';
import { RequestService } from 'src/app/services/request.service';
import { TypeService } from 'src/app/services/type.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit, OnDestroy {

  formg: FormGroup;
  formdet: FormGroup;

  invoice: InvoiceNewDTO;
  details: InvoiceDetailNewFrontDTO[] = [];
  idSolicitud: number;

  invoicetypes: TypeGeneric[] = [];

  private subs: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private typeService: TypeService,
    private invoiceService: InvoiceService,
    private requestService: RequestService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.formg = this.formBuilder.group({
      idTipoPresupuesto: [1, [Validators.min(1), Validators.max(255)]],
      razonSocial: [, [Validators.required, Validators.maxLength(64)]],
      cuit: [, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      direccion: [, [Validators.required, Validators.maxLength(64)]],
      nombreContacto: [, [Validators.required, Validators.maxLength(64)]],
      fechaCreacion: [, [Validators.required]],
      observaciones: [, [Validators.maxLength(512)]],
      diasValidez: [, [Validators.min(1), Validators.max(65535)]],
      porcentajeImpuestos: ['21.0', [Validators.required]],
    });
    this.formdet = this.formBuilder.group({
      descripcion: [, [Validators.required, Validators.maxLength(512)]],
      plazoEntrega: [, [Validators.min(1), Validators.max(65535)]],
      cantidad: [1, [Validators.required, Validators.min(1), Validators.max(65535)]],
      precioUnitario: [0, [Validators.required, Validators.min(-9999999999.99), Validators.max(9999999999.99)]]
    })

    this.loadBudgetTypes();
    this.loadForm();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private loadForm(): void {
    this.subs.add(
      this.activatedRoute.params.subscribe((params) => {
        const id = parseInt(params['id']);
        if (!id) {
          swal({ title: 'Oops!', text: `Error en el parámetro ID. Revisar URL.`, icon: 'error' });
          return;
        }
        this.idSolicitud = id;

        this.subs.add(
          this.invoiceService.fillForm(this.idSolicitud).subscribe({
            next: (result: ApiResult) => {
              if (result.ok && result.result) {
                this.formg.patchValue(result.result.request);
                this.details = result.result.details as InvoiceDetailNewFrontDTO[];
              } else {
                swal({ title: 'Oops!', text: `Error al obtener la solicitud con ID ${id}. Es posible que no exista.`, icon: 'error' });
                this.router.navigate(['/solicitudes']);
              }
            },
            error: (error) => {
              if (error.error.message) {
                swal({ title: 'Oops!', text: `Error al obtener la solicitud ${error.error.message}`, icon: 'error' });
              } else {
                swal({ title: 'Oops!', text: `Error al obtener la solicitud.`, icon: 'error' });
                console.error(error);
              }
            }
          })
        )
      })
    )
  }

  save(): void {
    if (!this.formg.valid) {
      swal({ title: 'Atención!', text: `Formulario inválido.`, icon: 'warning' });
      return;
    }

    if (this.details.length === 0) {
      swal({ title: 'Atención!', text: `Agregue por lo menos un detalle.`, icon: 'warning' });
      return;
    }

    this.invoice = this.formg.value as InvoiceNewDTO;
    let year, month, day: number;
    let fecha = this.formg.get('fechaCreacion')!.value

    let parts = fecha.split('-');
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);

    fecha = new Date(Date.UTC(year, month, day, 4, 0, 0));

    this.invoice.fechaCreacion = new Date(fecha).toISOString();

    this.subs.add(
      this.invoiceService.addInvoice(this.invoice, this.details, this.idSolicitud).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Todo ok!', text: `${result.message}`, icon: 'success' });
            this.router.navigate(['/solicitudes']);
          } else {
            swal({ title: 'Oops!', text: `Error al crear presupuesto: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al crear presupuesto: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al crear presupuesto`, icon: 'error' });
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
        this.router.navigate(['/solicitudes']);
      }
    })
  }

  addDetail(): void {
    if (!this.formdet.valid) {
      return;
    }
    const d: InvoiceDetailNewFrontDTO = this.formdet.value as InvoiceDetailNewFrontDTO;
    this.details.push(d);
    this.clearDetailForm();
  }

  removeDetail(d: InvoiceDetailNewFrontDTO): void {
    const index = this.details.findIndex(detail => detail.descripcion === d.descripcion);
    if (index !== -1) {
      this.details.splice(index, 1);
    }
  }

  getDetailIndex = (array: InvoiceDetailNewFrontDTO[], target: InvoiceDetailNewFrontDTO): number =>
    array.findIndex((item) => item === target);

  editDetail(event: { newDetail: InvoiceDetailNewFrontDTO, index: number }): void {
    if (event.index >= 0 && event.index < this.details.length) {
      this.details[event.index] = event.newDetail;
    }
  }

  clearDetailForm(): void {
    this.formdet.reset();
    this.formdet.patchValue({
      cantidad: 1,
      precioUnitario: 0
    });
  }

  loadBudgetTypes(): void {
    this.subs.add(
      this.typeService.getBudgetTypes().subscribe({
        next: (result: ApiResult) => {
          if (result.ok && result.result) {
            this.invoicetypes = result.result as TypeGeneric[];
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

  mapInvoiceType(id: number): string | undefined {
    const matchedObject = this.invoicetypes.find((item) => item.idTipo === id);
    return matchedObject?.nombre;
  }
}

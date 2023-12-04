import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { InvoiceDetailIDDTO, InvoiceIDDTO } from 'src/app/models/Invoice';
import { InvoiceService } from 'src/app/services/invoice.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss']
})
export class ViewInvoiceComponent implements OnInit, OnDestroy {

  invoice: InvoiceIDDTO;
  details: InvoiceDetailIDDTO[] = [];

  netoGravado: number;
  total: number;
  private token: string

  private subs: Subscription = new Subscription();

  constructor(
    private router: Router,
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadInvoice();
  }

  ngAfterViewInit(): void {
    this.calculate();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  acceptBudget(value: string): void {

    const word = value == 'true' ? 'aceptar' : 'rechazar'

    swal({
      title: "Confirmación",
      text: `Seguro que quiere ${word} el presupuesto?`,
      icon: "warning", dangerMode: true,
      buttons: { cancel: true, confirm: true }
    }).then((confirm) => {
      if (confirm) {
        this.subs.add(
          this.invoiceService.acceptBudget(this.token, value).subscribe({
            next: (result: ApiResult) => {
              if (result.ok) {
                swal({ title: 'Todo ok!', text: `Éxito al ${word} el presupuesto.`, icon: 'success' });
              } else {
                swal({ title: 'Oops!', text: `Error al ${word} el presupuesto: ${result.message}`, icon: 'error' });
                console.error(result.message);
              }
            },
            error: (error) => {
              if (error.error.message) {
                swal({ title: 'Oops!', text: `Error al ${word} el presupuesto: ${error.error.message}`, icon: 'error' });
              } else {
                swal({ title: 'Oops!', text: `Error al ${word} el presupuesto`, icon: 'error' });
                console.error(error);
              }
            }
          })
        )
      }
    })
  }

  private calculate(): void {
    this.netoGravado = this.calculateNetAmount();
    this.total = this.netoGravado * (1 + (this.invoice.porcentajeImpuestos / 100))
  }

  private calculateNetAmount(): number {
    let total = 0;
    for (const d of this.details) {
      total += d.cantidad * d.precioUnitario;
    }
    return total;
  }

  private loadInvoice(): void {
    this.subs.add(
      this.activatedRoute.params.subscribe((params) => {
        const token = params['token'];
        if (!token) {
          swal({ title: 'Oops!', text: `Error en el parámetro ID. Revisar URL.`, icon: 'error' });
          return;
        }

        this.token = token;
        this.subs.add(
          this.invoiceService.getByToken(token).subscribe({
            next: (result: ApiResult) => {
              if (result.ok && result.result) {
                this.invoice = result.result.invoice as InvoiceIDDTO;
                this.details = result.result.details as InvoiceDetailIDDTO[];
              } else {
                swal({
                  title: 'Oops!', text: `Error al obtener la presupuesto con ese token.
                 Es posible que no exista un presupuesto para ese token.`, icon: 'error'
                });
                this.router.navigate(['/inicio']);
              }
            },
            error: (error) => {
              if (error.error.message) {
                swal({ title: 'Oops!', text: `Error al obtener la presupuesto con ese token: ${error.error.message}`, icon: 'error' });
              } else {
                swal({ title: 'Oops!', text: `Error al obtener la presupuesto con ese token.`, icon: 'error' });
                console.error(error);
              }
            }
          })
        )
      })
    )
  }

  toPDF(): void {
    const elementToCapture: HTMLElement = document.getElementById('presupuesto')!;

    html2canvas(elementToCapture, {
      scale: 2
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Presupuesto_${this.invoice.idPresupuesto}.pdf`);
    });
  }
}

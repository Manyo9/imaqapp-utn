import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
  selector: 'app-view-invoice-manager',
  templateUrl: './view-invoice-manager.component.html',
  styleUrls: ['./view-invoice-manager.component.scss']
})
export class ViewInvoiceManagerComponent implements OnDestroy, OnInit {

  @Input() idPresupuesto: number;
  invoice: InvoiceIDDTO;
  details: InvoiceDetailIDDTO[] = [];

  netoGravado: number;
  total: number;

  private subs: Subscription = new Subscription();

  constructor(
    private router: Router,
    private invoiceService: InvoiceService
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
      this.invoiceService.getById(this.idPresupuesto).subscribe({
        next: (result: ApiResult) => {
          if (result.ok && result.result) {
            this.invoice = result.result.invoice as InvoiceIDDTO;
            this.details = result.result.details as InvoiceDetailIDDTO[];
          } else {
            swal({
              title: 'Oops!', text: `Error al obtener el presupuesto con ese ID. Es posible que no exista.`, icon: 'error'
            });
            this.router.navigate(['/inicio']);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al obtener el presupuesto con ese ID: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al obtener el presupuesto con ese ID.`, icon: 'error' });
            console.error(error);
          }
        }
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
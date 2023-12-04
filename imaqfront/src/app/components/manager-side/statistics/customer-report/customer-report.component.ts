import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { ReportService } from 'src/app/services/report.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-customer-report',
  templateUrl: './customer-report.component.html',
  styleUrls: ['./customer-report.component.scss']
})
export class CustomerReportComponent {
  formg: FormGroup

  private subs = new Subscription();

  reporteClientes: { razonSocial: string, cantidad: number }[];
  dataEntry: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private reportService: ReportService
  ) { }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.formg = this.formBuilder.group({
      fechaInicio: [, [Validators.required]],
      fechaFin: [, [Validators.required]],
    });
  }

  return() {
    this.router.navigate(['estadisticas'])
  }

  private generateGraphs(): void {
    this.generateStatusGraph();
  }

  private generateStatusGraph(): void {
    this.dataEntry = this.reporteClientes.map(item => ({
      label: item.razonSocial.split(' '),
      data: item.cantidad
    }))
  }

  generateReport(): void {

    if (!this.formg.valid) {
      swal({ title: 'Atención!', text: `Revisá las fechas ingresadas.`, icon: 'warning' });
      return;
    }
    let year, month, day: number;
    let startdate = this.formg.get('fechaInicio')!.value
    let enddate = this.formg.get('fechaFin')!.value

    let parts = startdate.split('-');
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);

    startdate = new Date(Date.UTC(year, month, day, 3, 0, 0));

    parts = enddate.split('-');
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);

    enddate = new Date(Date.UTC(year, month, day + 1, 3, 0, 0));

    this.subs.add(
      this.reportService.generateCustomerReport(startdate.toISOString(), enddate.toISOString()).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            this.reporteClientes = result.result;
            this.generateGraphs();
          } else {
            swal({ title: 'Oops!', text: `Error al generar el reporte: ${result.message}`, icon: 'error' });
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al generar el reporte: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al generar el reporte.`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }
}

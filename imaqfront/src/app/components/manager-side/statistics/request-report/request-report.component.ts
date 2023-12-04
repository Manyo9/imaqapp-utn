import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { ReportService } from 'src/app/services/report.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-request-report',
  templateUrl: './request-report.component.html',
  styleUrls: ['./request-report.component.scss']
})
export class RequestReportComponent implements OnInit, OnDestroy {
  formg: FormGroup
  formyear: FormGroup

  private subs = new Subscription();

  reporteAnio: { mes: number, cantidad: number }[];
  reporteTipos: { cantidadPorTipo: number, tipoSolicitud: any }[];
  reporteEstados: { cantidadPorEstado: number, estadoSolicitud: any }[];
  typesDataEntry: any;
  statusDataEntry: any;
  cantidadSolicitudes: number = 0;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private datePipe: DatePipe
  ) { }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.formg = this.formBuilder.group({
      fechaInicio: [, [Validators.required]],
      fechaFin: [, [Validators.required]],
    });
    this.formyear = this.formBuilder.group({
      anio: [new Date().getFullYear(), [Validators.required, Validators.min(1980), Validators.max(2100)]]
    });
  }

  getMonthName(monthNumber: number): string {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    const monthName = this.datePipe.transform(date, 'MMMM');
    return monthName || '';
  }

  return() {
    this.router.navigate(['estadisticas'])
  }

  private generateGraphs(): void {
    this.generateTypeGraph();
    this.generateStatusGraph();
  }

  private generateTypeGraph(): void {
    this.typesDataEntry = this.reporteTipos.map(item => ({
      label: item.tipoSolicitud.split(' '),
      data: item.cantidadPorTipo
    }))
  }

  private generateStatusGraph(): void {
    this.statusDataEntry = this.reporteEstados.map(item => ({
      label: item.estadoSolicitud.split(' '),
      data: item.cantidadPorEstado
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
      this.reportService.generateRequestReport(startdate.toISOString(), enddate.toISOString()).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            this.cantidadSolicitudes = result.result.cantidadSolicitudes;
            this.reporteTipos = result.result.reporteTipos;
            this.reporteEstados = result.result.reporteEstados;
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

  getRequestsByYear(): void {

    const year = parseInt(this.formyear.get('anio')?.value)

    if (!year || isNaN(year) || !this.formyear.valid) {
      swal({ title: 'Atención!', text: `Revisá el año ingresado.`, icon: 'warning' });
      return;
    }

    this.subs.add(
      this.reportService.generateRequestByYear(year).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            this.reporteAnio = result.result;
            this.reporteAnio.sort((a, b) => a.mes - b.mes);
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

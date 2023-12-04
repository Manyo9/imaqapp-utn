import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { MachineRentableDTO } from 'src/app/models/Machine';
import { RentalDetailNewFrontDTO, RentalNewFrontDTO } from 'src/app/models/Rental';
import { RequestNewFrontDTO } from 'src/app/models/Request';
import { RentalService } from 'src/app/services/rental.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');


@Component({
  selector: 'app-rentals',
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.scss']
})
export class RentalsComponent implements OnInit, OnDestroy {

  formreq: FormGroup;
  formrent: FormGroup;
  request: RequestNewFrontDTO;
  rental: RentalNewFrontDTO;
  details: RentalDetailNewFrontDTO[];
  machines: MachineRentableDTO[];
  selectedMachines: MachineRentableDTO[] = [];
  isDisabledButton: boolean = false;
  private subs: Subscription = new Subscription();

  constructor(
    private rentalService: RentalService,
    private router: Router,
    private formBuilder: FormBuilder) { }

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
    this.formrent = this.formBuilder.group({
      fechaInicio: [, [Validators.required]],
      fechaFin: [, [Validators.required]]
    });
  }

  save(): void {
    if (!this.formreq.valid || !this.formrent.valid) {
      swal({ title: 'Atención!', text: `Formulario inválido. Revisá los campos.`, icon: 'warning' });
      return;
    }

    this.request = this.formreq.value as RequestNewFrontDTO;
    let year, month, day: number;
    let startdate = this.formrent.get('fechaInicio')!.value
    let enddate = this.formrent.get('fechaFin')!.value

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

    this.rental = {
      fechaInicio: startdate,
      fechaFin: enddate
    }


    const check1: boolean = this.selectedMachines.length > 0;
    const check2: boolean = this.formreq.get('comentario')?.value !== undefined && this.formreq.get('comentario')?.value !== '' && this.formreq.get('comentario')?.value !== null;
    const check3: boolean = this.selectedMachines.length === 0 && check2;
    const puedeEnviarForm: boolean = check1 || check3

    if (!puedeEnviarForm) {
      swal({ title: 'Atención!', text: `Seleccione por lo menos una máquina o ingrese un comentario`, icon: 'warning' });
      return;
    }

    this.details = this.selectedMachines.map(machine => ({ idMaquinaAlq: machine.idMaquinaAlq }));

    this.subs.add(
      this.rentalService.addRental(this.request, this.rental, this.details).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Todo ok!', text: `${result.message}`, icon: 'success' });
            this.router.navigate(['/inicio']);
          } else {
            swal({ title: 'Oops!', text: `Error al solicitar alquiler: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al solicitar alquiler: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al solicitar alquiler`, icon: 'error' });
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
        this.router.navigate(['/inicio']);
      }
    })
  }

  enableButton(): void {
    this.isDisabledButton = false;
  }

  loadMachines(): void {
    if (!this.formrent.valid) {
      swal({ title: 'Atención!', text: `Revisa las fechas ingresadas.`, icon: 'warning' });
      return;
    }

    this.selectedMachines = [];

    let year, month, day: number;
    let startdate = this.formrent.get('fechaInicio')!.value
    let enddate = this.formrent.get('fechaFin')!.value

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
      this.rentalService.getRentable(startdate, enddate).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            this.machines = result.result as MachineRentableDTO[];
            if (result.result.length !== 0) {
              this.isDisabledButton = true;
            } else {
              swal({ title: 'Atención', text: `No se encontraron máquinas disponibles en ese rango de fechas`, icon: 'warning' });
            }
          } else {
            swal({ title: 'Oops!', text: `Error al obtener máquinas disponibles: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al obtener máquinas disponibles: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al obtener máquinas disponibles`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }

  addMachine(machine: MachineRentableDTO) {
    const index = this.machines.findIndex(m => m.idMaquinaAlq === machine.idMaquinaAlq);
    if (index !== -1) {
      this.selectedMachines.push(this.machines[index]);
      this.machines.splice(index, 1);
    }
    console.log(this.formrent);
    console.log(this.formreq);
  }

  removeMachine(machine: MachineRentableDTO) {
    const index = this.selectedMachines.findIndex(m => m.idMaquinaAlq === machine.idMaquinaAlq);
    if (index !== -1) {
      this.machines.push(this.selectedMachines[index]);
      this.selectedMachines.splice(index, 1);
    }
  }


}
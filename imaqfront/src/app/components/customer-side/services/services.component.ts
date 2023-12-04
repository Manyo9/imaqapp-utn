import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { RequestNewFrontDTO } from 'src/app/models/Request';
import { ServiceDetailNewFrontDTO, ServicesNewFrontDTO } from 'src/app/models/Service';
import { TypeGeneric } from 'src/app/models/TypeGeneric';
import { ServiceService } from 'src/app/services/service.service';
import { TypeService } from 'src/app/services/type.service';

import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, OnDestroy {

  formreq: FormGroup;
  formmach: FormGroup;
  formserv: FormGroup;

  tiposServicio: TypeGeneric[];
  tiposMaquina: TypeGeneric[];

  private request: RequestNewFrontDTO;
  private service: ServicesNewFrontDTO;
  private details: ServiceDetailNewFrontDTO[];

  machines: ServiceDetailNewFrontDTO[] = [];

  private subs: Subscription = new Subscription();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private typeService: TypeService,
    private serviceService: ServiceService) { }

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
    this.formserv = this.formBuilder.group({
      idTipoServicio: [0, [Validators.required, Validators.min(1)]]
    });
    this.formmach = this.formBuilder.group({
      idTipoMaquina: [0, [Validators.required, Validators.min(1)]],
      marcaMaquina: [, [Validators.required, Validators.maxLength(32)]],
      modeloMaquina: [, [Validators.required, Validators.maxLength(64)]],
      serieMaquina: [, [Validators.required, Validators.maxLength(20)]],
      cantidadMaquinas: [1, [Validators.required, Validators.min(1), Validators.max(999999)]]
    });
    this.loadMachineTypes();
    this.loadServiceTypes();
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
    if (!this.formreq.valid || !this.formserv.valid) {
      swal({ title: 'Atención!', text: `Formulario inválido.`, icon: 'warning' });
      return;
    }

    if (this.machines.length === 0) {
      swal({ title: 'Atención!', text: `Agregue por lo menos una máquina.`, icon: 'warning' });
      return;
    }

    this.request = this.formreq.value;
    this.service = this.formserv.value;
    this.details = this.machines;

    this.subs.add(
      this.serviceService.addService(this.request, this.service, this.details).subscribe({
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

  addMachine(): void {
    if (!this.formmach.valid) {
      return;
    }
    const m: ServiceDetailNewFrontDTO = this.formmach.value as ServiceDetailNewFrontDTO;
    this.machines.push(m);
    this.formmach.reset();
  }

  removeMachine(m: ServiceDetailNewFrontDTO): void {
    const index = this.machines.findIndex(mach => mach.marcaMaquina === m.marcaMaquina
      && mach.modeloMaquina === m.modeloMaquina && mach.serieMaquina === m.serieMaquina);
    if (index !== -1) {
      this.machines.splice(index, 1);
    }
  }

  loadMachineTypes(): void {
    this.subs.add(
      this.typeService.getMachineTypes().subscribe({
        next: (result: ApiResult) => {
          if (result.ok && result.result) {
            this.tiposMaquina = result.result as TypeGeneric[];
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

  loadServiceTypes(): void {
    this.subs.add(
      this.typeService.getServiceTypes().subscribe({
        next: (result: ApiResult) => {
          if (result.ok && result.result) {
            this.tiposServicio = result.result as TypeGeneric[];
            console.log(this.tiposServicio)
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

  cleanMachineForm(): void {
    this.formmach.reset();
    this.formmach.patchValue({
      idTipoMaquina: 0,
      cantidadMaquinas: 1
    });
  }
}

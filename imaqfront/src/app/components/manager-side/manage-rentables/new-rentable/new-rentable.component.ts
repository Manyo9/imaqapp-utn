import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { MachineNewDTO } from 'src/app/models/Machine';
import { TypeGeneric } from 'src/app/models/TypeGeneric';
import { MachineService } from 'src/app/services/machine.service';
import { TypeService } from 'src/app/services/type.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-new-rentable',
  templateUrl: './new-rentable.component.html',
  styleUrls: ['./new-rentable.component.scss']
})
export class NewRentableComponent implements OnInit, OnDestroy{
  machine: MachineNewDTO;
  formg: FormGroup;
  tiposMaquina: TypeGeneric[];
  private subs: Subscription = new Subscription();

  constructor(
    private machineService: MachineService,
    private typeService: TypeService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.formg = this.formBuilder.group({
      idTipoMaquina: [, [Validators.required, Validators.min(0), Validators.max(255)]],
      marcaMaquina: [, [Validators.required, Validators.maxLength(32)]],
      modeloMaquina: [, [Validators.required, Validators.maxLength(64)]],
      serieMaquina: [, [Validators.required, Validators.maxLength(20)]],
      alturaTorre: [, [Validators.required, Validators.min(0), Validators.max(65535)]],
      capacidadCarga: [, [Validators.required, Validators.min(0), Validators.max(16777215)]]
    })
    this.loadTypes();
  }

  save(): void {
    if (!this.formg.valid) {
      swal({ title: 'Atención!', text: `Formulario inválido. Revisá los campos.`, icon: 'warning' });
      return;
    }

    this.machine = this.formg.value as MachineNewDTO;
    this.subs.add(
      this.machineService.addMachine(this.machine).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Todo ok!', text: `Se creó la máquina con éxito`, icon: 'success' });
            this.router.navigate(['/gestion/maquinas']);
          } else {
            swal({ title: 'Oops!', text: `Error al crear máquina: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if(error.error.message){
            swal({ title: 'Oops!', text: `Error al crear máquina: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al crear máquina`, icon: 'error' });
            console.error(error);
          }
        }
      })
    )
  }

  loadTypes(): void {
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

  cancel(): void {
    swal({
      title: "Volver",
      text: "¿Seguro que quiere volver? No se guardarán los cambios",
      icon: "warning", dangerMode: true,
      buttons: { cancel: true, confirm: true }
    }).then((volver) => {
      if (volver) {
        this.router.navigate(['/gestion/maquinas']);
      }
    })
  }
}
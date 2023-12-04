import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { Machine, MachineEditDTO } from 'src/app/models/Machine';
import { TypeGeneric } from 'src/app/models/TypeGeneric';
import { MachineService } from 'src/app/services/machine.service';
import { TypeService } from 'src/app/services/type.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');


@Component({
  selector: 'app-edit-rentable',
  templateUrl: './edit-rentable.component.html',
  styleUrls: ['./edit-rentable.component.scss']
})
export class EditRentableComponent {
  machine: MachineEditDTO;
  formg: FormGroup;
  tiposMaquina: TypeGeneric[];
  private subs: Subscription = new Subscription();

  constructor(
    private machineService: MachineService,
    private typeService: TypeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.formg = this.formBuilder.group({
      idTipoMaquina: [, [Validators.required, Validators.min(0), Validators.max(255)]],
      marcaMaquina: [, [Validators.required, Validators.maxLength(32)]],
      modeloMaquina: [, [Validators.required, Validators.maxLength(64)]],
      serieMaquina: [, [Validators.required, Validators.maxLength(20)]],
      alturaTorre: [, [Validators.min(0), Validators.max(65535)]],
      capacidadCarga: [, [Validators.required, Validators.min(0), Validators.max(16777215)]]
    })
    this.loadTypes();
    this.loadForm();
  }

  edit(): void {
    if (!this.formg.valid) {
      swal({ title: 'Atención!', text: `Formulario inválido. Revisá los campos.`, icon: 'warning' });
      return;
    }

    let request: MachineEditDTO = this.formg.value as MachineEditDTO;
    request.idMaquinaAlq = this.machine.idMaquinaAlq;
    this.subs.add(
      this.machineService.editMachine(request).subscribe({
        next: (result: ApiResult) => {
          if (result.ok) {
            swal({ title: 'Todo ok!', text: `Se editó la maquina con éxito`, icon: 'success' });
            this.router.navigate(['/gestion/maquinas'])
          } else {
            swal({ title: 'Oops!', text: `Error al editar maquina: ${result.message}`, icon: 'error' });
            console.error(result.message);
          }
        },
        error: (error) => {
          if (error.error.message) {
            swal({ title: 'Oops!', text: `Error al editar maquina: ${error.error.message}`, icon: 'error' });
          } else {
            swal({ title: 'Oops!', text: `Error al editar maquina`, icon: 'error' });
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

  loadForm(): void {
    this.subs.add(
      this.activatedRoute.params.subscribe((params) => {
        let id = parseInt(params['id']);
        if (!id) {
          swal({ title: 'Oops!', text: `Error en el parámetro ID. Revisar URL.`, icon: 'error' });
          return;
        }
        this.subs.add(
          this.machineService.getById(id).subscribe({
            next: (result: ApiResult) => {
              if (result.ok && result.result) {
                this.machine = result.result[0] as Machine;
                this.formg.patchValue(this.machine);
              } else {
                swal({ title: 'Oops!', text: `Error al obtener la maquina con ID ${id}: ${result.message}`, icon: 'error' });
                console.log(result.message);
              }
            },
            error: (err) => {
              swal({ title: 'Oops!', text: `Error al obtener la maquina con ID ${id}`, icon: 'error' });
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
        this.router.navigate(['/gestion/maquinas']);
      }
    })
  }
}


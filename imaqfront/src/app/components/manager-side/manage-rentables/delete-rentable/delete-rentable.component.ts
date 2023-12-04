import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MachineService } from 'src/app/services/machine.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-delete-rentable',
  templateUrl: './delete-rentable.component.html',
  styleUrls: ['./delete-rentable.component.scss']
})
export class DeleteRentableComponent {
  @Input() id: number;
  @Output() onDeleted = new EventEmitter();
  @Input() isDisabled: boolean;
  constructor(private machineService: MachineService) { }

  private subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  deleteRentable() {
    swal({
      title: "Eliminar máquina",
      text: "¿Seguro que quiere eliminar la maquina?",
      icon: "warning", dangerMode: true,
      buttons: { cancel: true, confirm: true }
    }).then((eliminar) => {
      if (eliminar) {
        this.subscription.add(
          this.machineService.deleteMachine(this.id).subscribe({
            next: () => {
              swal({ title: 'Ok!', text: `Se eliminó la maquina con ID ${this.id} correctamente`, icon: 'success' });
              this.onDeleted.emit();
            },
            error: (error) => {
              if (error.error.message) {
                swal({ title: 'Oops!', text: `Error al eliminar máquina: ${error.error.message}`, icon: 'error' });
              } else {
                swal({ title: 'Oops!', text: `Error al eliminar máquina`, icon: 'error' });
                console.error(error);
              }
            }
          })
        )
      }
    })
  }
}

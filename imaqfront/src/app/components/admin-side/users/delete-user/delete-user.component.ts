import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnDestroy {
  @Input() id: number;
  @Output() onDeleted = new EventEmitter();
  @Input() isDisabled: boolean;
  constructor(private userService: UserService) { }

  private subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  deleteUser() {
    swal({
      title: "Eliminar usuario",
      text: "¿Seguro que quiere eliminar el usuario?",
      icon: "warning", dangerMode: true,
      buttons: { cancel: true, confirm: true }
    }).then((eliminar) => {
      if (eliminar) {
        this.subscription.add(
          this.userService.deleteUser(this.id).subscribe({
            next: () => {
              swal({ title: 'Ok!', text: `Se eliminó el usuario con ID ${this.id} correctamente`, icon: 'success' });
              this.onDeleted.emit();
            },
            error: (error) => {
              if(error.error.message){
                swal({ title: 'Oops!', text: `Error al eliminar: ${error.error.message}`, icon: 'error' });
              } else {
                swal({ title: 'Error!', text: `Error al eliminar.`, icon: 'error' });
                console.error(error);
              }
            }
          })
        )
      }
    })
  }
}
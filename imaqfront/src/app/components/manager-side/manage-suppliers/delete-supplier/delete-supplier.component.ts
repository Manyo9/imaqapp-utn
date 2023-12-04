import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiResult } from 'src/app/models/ApiResult';
import { SupplierService } from 'src/app/services/supplier.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');


@Component({
  selector: 'app-delete-supplier',
  templateUrl: './delete-supplier.component.html',
  styleUrls: ['./delete-supplier.component.scss']
})
export class DeleteSupplierComponent implements OnDestroy {
  @Input() id: number;
  @Output() onDeleted = new EventEmitter();
  @Input() isDisabled: boolean;
  constructor(private supplierService: SupplierService) { }

  private subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  deleteSupplier() {
    swal({
      title: "Eliminar proveedor",
      text: "¿Seguro que quiere eliminar el proveedor?",
      icon: "warning", dangerMode: true,
      buttons: { cancel: true, confirm: true }
    }).then((eliminar) => {
      if (eliminar) {
        this.subscription.add(
          this.supplierService.deleteSupplier(this.id).subscribe({
            next: (result: ApiResult) => {
              if (result.ok) {
                swal({ title: 'Ok!', text: `Se eliminó el proveedor con ID ${this.id} correctamente`, icon: 'success' });
                this.onDeleted.emit();
              } else {
                swal({title:'Oops!', text:`Error al eliminar proveedor: ${result.message}`, icon: 'error'});
              }

            },
            error: (error) => {
              if(error.error.message){
                swal({title:'Oops!', text:`Error al eliminar proveedor: ${error.error.message}`, icon: 'error'});
              } else {
                swal({title:'Oops!', text:`Error al eliminar proveedor.`, icon: 'error'});
                console.error(error);
              }
            }
          })
        )
      }
    })
  }
}

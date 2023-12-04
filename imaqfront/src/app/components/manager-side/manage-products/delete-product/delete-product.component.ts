import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.scss']
})
export class DeleteProductComponent implements OnDestroy {
  @Input() id: number;
  @Output() onDeleted = new EventEmitter();
  @Input() isDisabled: boolean;
  constructor(private productService: ProductService) { }

  private subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  deleteProduct() {
    swal({
      title: "Eliminar producto",
      text: "¿Seguro que quiere eliminar el producto?",
      icon: "warning", dangerMode: true,
      buttons: { cancel: true, confirm: true }
    }).then((eliminar) => {
      if (eliminar) {
        this.subscription.add(
          this.productService.deleteProduct(this.id).subscribe({
            next: () => {
              swal({ title: 'Ok!', text: `Se eliminó el producto con ID ${this.id} correctamente`, icon: 'success' });
              this.onDeleted.emit();
            },
            error: (error) => {
              if (error.error.message) {
                swal({ title: 'Oops!', text: `Error al eliminar producto: ${error.error.message}`, icon: 'error' });
              } else {
                swal({ title: 'Oops!', text: `Error al eliminar producto`, icon: 'error' });
                console.error(error);
              }
            }
          })
        )
      }
    })
  }
}

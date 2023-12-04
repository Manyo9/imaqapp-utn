import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceDetailNewFrontDTO } from 'src/app/models/Invoice';

@Component({
  selector: 'app-edit-invoice-detail',
  templateUrl: './edit-invoice-detail.component.html',
  styleUrls: ['./edit-invoice-detail.component.scss']
})
export class EditInvoiceDetailComponent {
  @Input() modalId: number;
  @Input() detail: InvoiceDetailNewFrontDTO;
  newDetail: InvoiceDetailNewFrontDTO;
  @Output() onEdit = new EventEmitter();

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      descripcion: [, [Validators.required, Validators.maxLength(512)]],
      plazoEntrega: [, [Validators.min(1), Validators.max(65535)]],
      cantidad: [1, [Validators.required, Validators.min(1), Validators.max(65535)]],
      precioUnitario: [0, [Validators.required, Validators.min(-9999999999.99), Validators.max(9999999999.99)]]
    })
    this.loadForm();
  }

  private loadForm() {
    this.form.patchValue(this.detail);
  }

  editDetail() {
    this.newDetail = this.form.value as InvoiceDetailNewFrontDTO;
    this.onEdit.emit({newDetail: this.newDetail, index: this.modalId});
  }
}

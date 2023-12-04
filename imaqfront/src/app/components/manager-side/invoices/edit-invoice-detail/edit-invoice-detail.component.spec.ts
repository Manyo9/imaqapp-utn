import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInvoiceDetailComponent } from './edit-invoice-detail.component';

describe('EditInvoiceDetailComponent', () => {
  let component: EditInvoiceDetailComponent;
  let fixture: ComponentFixture<EditInvoiceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInvoiceDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInvoiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

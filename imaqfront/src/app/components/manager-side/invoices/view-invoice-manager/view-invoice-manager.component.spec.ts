import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInvoiceManagerComponent } from './view-invoice-manager.component';

describe('ViewInvoiceManagerComponent', () => {
  let component: ViewInvoiceManagerComponent;
  let fixture: ComponentFixture<ViewInvoiceManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewInvoiceManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewInvoiceManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

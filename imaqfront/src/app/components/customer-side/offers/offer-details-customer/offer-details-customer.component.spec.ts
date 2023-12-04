import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDetailsCustomerComponent } from './offer-details-customer.component';

describe('OfferDetailsCustomerComponent', () => {
  let component: OfferDetailsCustomerComponent;
  let fixture: ComponentFixture<OfferDetailsCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferDetailsCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferDetailsCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

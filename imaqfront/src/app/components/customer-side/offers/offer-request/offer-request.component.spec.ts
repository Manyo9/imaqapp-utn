import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferRequestComponent } from './offer-request.component';

describe('OfferRequestComponent', () => {
  let component: OfferRequestComponent;
  let fixture: ComponentFixture<OfferRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

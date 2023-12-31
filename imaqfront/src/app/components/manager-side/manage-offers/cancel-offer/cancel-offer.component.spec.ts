import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelOfferComponent } from './cancel-offer.component';

describe('CancelOfferComponent', () => {
  let component: CancelOfferComponent;
  let fixture: ComponentFixture<CancelOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelOfferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

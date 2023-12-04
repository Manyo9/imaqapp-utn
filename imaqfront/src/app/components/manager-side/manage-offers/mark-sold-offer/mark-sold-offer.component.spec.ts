import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkSoldOfferComponent } from './mark-sold-offer.component';

describe('MarkSoldOfferComponent', () => {
  let component: MarkSoldOfferComponent;
  let fixture: ComponentFixture<MarkSoldOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkSoldOfferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkSoldOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

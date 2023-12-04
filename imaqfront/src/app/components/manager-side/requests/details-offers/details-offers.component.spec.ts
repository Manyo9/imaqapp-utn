import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsOffersComponent } from './details-offers.component';

describe('DetailsOffersComponent', () => {
  let component: DetailsOffersComponent;
  let fixture: ComponentFixture<DetailsOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsOffersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

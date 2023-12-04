import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsRentalsComponent } from './details-rentals.component';

describe('DetailsRentalsComponent', () => {
  let component: DetailsRentalsComponent;
  let fixture: ComponentFixture<DetailsRentalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsRentalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsRentalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

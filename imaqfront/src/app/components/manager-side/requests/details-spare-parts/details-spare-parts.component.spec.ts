import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsSparePartsComponent } from './details-spare-parts.component';

describe('DetailsSparePartsComponent', () => {
  let component: DetailsSparePartsComponent;
  let fixture: ComponentFixture<DetailsSparePartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsSparePartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsSparePartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

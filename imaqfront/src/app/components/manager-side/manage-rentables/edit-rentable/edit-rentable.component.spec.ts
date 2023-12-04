import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRentableComponent } from './edit-rentable.component';

describe('EditRentableComponent', () => {
  let component: EditRentableComponent;
  let fixture: ComponentFixture<EditRentableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRentableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRentableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

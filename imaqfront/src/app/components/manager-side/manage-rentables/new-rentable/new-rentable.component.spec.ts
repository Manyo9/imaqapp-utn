import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRentableComponent } from './new-rentable.component';

describe('NewRentableComponent', () => {
  let component: NewRentableComponent;
  let fixture: ComponentFixture<NewRentableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRentableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRentableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

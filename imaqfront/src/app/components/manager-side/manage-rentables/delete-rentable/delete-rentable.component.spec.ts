import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRentableComponent } from './delete-rentable.component';

describe('DeleteRentableComponent', () => {
  let component: DeleteRentableComponent;
  let fixture: ComponentFixture<DeleteRentableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteRentableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRentableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

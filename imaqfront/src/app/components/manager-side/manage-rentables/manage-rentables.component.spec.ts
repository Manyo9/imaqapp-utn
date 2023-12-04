import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRentablesComponent } from './manage-rentables.component';

describe('ManageRentablesComponent', () => {
  let component: ManageRentablesComponent;
  let fixture: ComponentFixture<ManageRentablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRentablesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRentablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

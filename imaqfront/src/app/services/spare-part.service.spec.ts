import { TestBed } from '@angular/core/testing';

import { SparePartService } from './spare-part.service';

describe('SparePartService', () => {
  let service: SparePartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SparePartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

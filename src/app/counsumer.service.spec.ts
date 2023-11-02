import { TestBed } from '@angular/core/testing';

import { CounsumerService } from './counsumer.service';

describe('CounsumerService', () => {
  let service: CounsumerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CounsumerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { InstitutosService } from './institutos.service';

describe('InstitutosService', () => {
  let service: InstitutosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstitutosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

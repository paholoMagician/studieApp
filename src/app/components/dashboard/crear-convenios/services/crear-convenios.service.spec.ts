import { TestBed } from '@angular/core/testing';

import { CrearConveniosService } from './crear-convenios.service';

describe('CrearConveniosService', () => {
  let service: CrearConveniosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrearConveniosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

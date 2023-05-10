import { TestBed } from '@angular/core/testing';

import { AsignacionesService } from './asignaciones.service';

describe('AsignacionesService', () => {
  let service: AsignacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsignacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

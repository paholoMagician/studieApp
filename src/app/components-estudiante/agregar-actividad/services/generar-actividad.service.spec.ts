import { TestBed } from '@angular/core/testing';

import { GenerarActividadService } from './generar-actividad.service';

describe('GenerarActividadService', () => {
  let service: GenerarActividadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerarActividadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { RegistroAlumnoService } from './registro-alumno.service';

describe('RegistroAlumnoService', () => {
  let service: RegistroAlumnoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroAlumnoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

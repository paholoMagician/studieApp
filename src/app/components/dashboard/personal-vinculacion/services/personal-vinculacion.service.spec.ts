import { TestBed } from '@angular/core/testing';

import { PersonalVinculacionService } from './personal-vinculacion.service';

describe('PersonalVinculacionService', () => {
  let service: PersonalVinculacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalVinculacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ConfigurationServicesService } from './configuration-services.service';

describe('ConfigurationServicesService', () => {
  let service: ConfigurationServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurationServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

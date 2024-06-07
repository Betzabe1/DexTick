import { TestBed } from '@angular/core/testing';

import { OptionsServiceService } from './options-service.service';

describe('OptionsServiceService', () => {
  let service: OptionsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

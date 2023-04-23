import { TestBed } from '@angular/core/testing';

import { SharedHttpService } from './shared-http.service';

describe('SharedHttpService', () => {
  let service: SharedHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

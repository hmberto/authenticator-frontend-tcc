import { TestBed } from '@angular/core/testing';

import { IsUserloggedInService } from './is-userlogged-in.service';

describe('IsUserloggedInService', () => {
  let service: IsUserloggedInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsUserloggedInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

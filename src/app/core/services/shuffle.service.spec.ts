import { TestBed } from '@angular/core/testing';

import { ShuffleService } from './shuffle.service';

xdescribe('ShuffleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShuffleService = TestBed.get(ShuffleService);
    expect(service).toBeTruthy();
  });
});

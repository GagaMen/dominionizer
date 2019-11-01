import { TestBed, async, inject } from '@angular/core/testing';

import { ConfigurationGuard } from './configuration.guard';

describe('ConfigurationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigurationGuard]
    });
  });

  it('should ...', inject([ConfigurationGuard], (guard: ConfigurationGuard) => {
    expect(guard).toBeTruthy();
  }));
});

import { TestBed } from '@angular/core/testing';

import { MathJsService } from './math-js.service';

describe('MathJsService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: MathJsService = TestBed.get(MathJsService);
        expect(service).toBeTruthy();
    });
});

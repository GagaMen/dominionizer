import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';

import { CardDisplayMode, ViewService } from './view.service';

describe('ViewService', () => {
    let viewService: ViewService;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        viewService = TestBed.inject(ViewService);
    });

    describe('cardDisplayMode$', () => {
        it('with service just initialized should emit default card display mode', () => {
            const expected$ = cold('a', { a: ViewService.defaultCardDisplayMode });

            const actual$ = viewService.cardDisplayMode$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('updateCardDisplayMode', () => {
        it('should update card display mode', () => {
            const cardDisplayMode: CardDisplayMode = 'fullSize';
            const expected$ = cold('a', { a: cardDisplayMode });

            viewService.updateCardDisplayMode(cardDisplayMode);
            const actual$ = viewService.cardDisplayMode$;

            expect(cardDisplayMode)
                .withContext('test value')
                .not.toBe(ViewService.defaultCardDisplayMode);
            expect(actual$).toBeObservable(expected$);
        });
    });
});

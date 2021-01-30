import { TestBed } from '@angular/core/testing';

import { ChanceService } from './chance.service';
import { DataFixture } from 'src/testing/data-fixture';

describe('ChanceService', () => {
    let chanceService: ChanceService;
    let mathRandomSpy: jasmine.Spy<() => number>;
    let dataFixture: DataFixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ChanceService],
        });

        dataFixture = new DataFixture();

        mathRandomSpy = spyOn(Math, 'random');
        mathRandomSpy.and.callThrough();

        chanceService = TestBed.inject(ChanceService);
    });

    describe('pickCards', () => {
        it('with amount is greater than candidates size should return all candidates', () => {
            const amount = 10;
            const candidates = dataFixture.createCards(amount - 1);

            const actual = chanceService.pickCards(candidates, amount);

            expect(actual).toEqual(candidates);
            expect(actual).not.toBe(candidates);
        });

        it('with amount equals candidates size should return all candidates', () => {
            const amount = 10;
            const candidates = dataFixture.createCards(amount);

            const actual = chanceService.pickCards(candidates, amount);

            expect(actual).toEqual(candidates);
            expect(actual).not.toBe(candidates);
        });

        it('with amount is 1 and candidates size is greater should return one random card', () => {
            const amount = 1;
            const candidates = dataFixture.createCards(10);
            mathRandomSpy.and.returnValue(0.15);
            const expected = candidates.slice(1, 2);

            const actual = chanceService.pickCards(candidates, amount);

            expect(actual).toEqual(expected);
        });
    });
});

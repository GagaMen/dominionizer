import { TestBed } from '@angular/core/testing';

import { MathService } from './math.service';
import { DataFixture } from 'src/testing/data-fixture';

describe('MathService', () => {
    let mathService: MathService;
    let mathRandomSpy: jasmine.Spy<() => number>;
    let dataFixture: DataFixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MathService],
        });

        dataFixture = new DataFixture();

        mathRandomSpy = spyOn(Math, 'random');
        mathRandomSpy.and.callThrough();

        mathService = TestBed.inject(MathService);
    });

    describe('pickRandomCards', () => {
        it('with amount is greater than candidates size should return all candidates', () => {
            const amount = 10;
            const candidates = dataFixture.createCards(amount - 1);

            const actual = mathService.pickRandomCards(candidates, amount);

            expect(actual).toEqual(candidates);
            expect(actual).not.toBe(candidates);
        });

        it('with amount equals candidates size should return all candidates', () => {
            const amount = 10;
            const candidates = dataFixture.createCards(amount);

            const actual = mathService.pickRandomCards(candidates, amount);

            expect(actual).toEqual(candidates);
            expect(actual).not.toBe(candidates);
        });

        it('with amount is 1 and candidates size is greater should return one random card', () => {
            const amount = 1;
            const candidates = dataFixture.createCards(10);
            mathRandomSpy.and.returnValue(0.15);
            const expected = candidates.slice(1, 2);

            const actual = mathService.pickRandomCards(candidates, amount);

            expect(actual).toEqual(expected);
        });
    });
});

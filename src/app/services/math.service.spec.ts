import { TestBed } from '@angular/core/testing';

import { MathService, MathJsStaticInjectionToken } from './math.service';
import { DataFixture } from 'src/testing/data-fixture';
import * as math from 'mathjs';
import { SpyObj } from 'src/testing/spy-obj';

describe('MathJsStaticInjectionToken', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: MathJsStaticInjectionToken }],
        });
    });

    it('should provide "math" constant', () => {
        const actual = TestBed.inject<math.MathJsStatic>(MathJsStaticInjectionToken);

        expect(actual).toBe(math);
    });
});

describe('MathService', () => {
    let mathService: MathService;
    let mathJsStaticSpy: SpyObj<math.MathJsStatic>;
    let dataFixture: DataFixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MathService,
                {
                    provide: MathJsStaticInjectionToken,
                    useValue: jasmine.createSpyObj<math.MathJsStatic>('math.MathJsStatic', [
                        'pickRandom',
                    ]),
                },
            ],
        });

        dataFixture = new DataFixture();
        mathJsStaticSpy = TestBed.inject<SpyObj<math.MathJsStatic>>(MathJsStaticInjectionToken);
        mathService = TestBed.inject(MathService);
    });

    describe('pickRandomCards', () => {
        it('with number is 1 should return correct cards', () => {
            const cards = dataFixture.createCards();
            const number = 1;
            const expected = cards.slice(0, number);
            mathJsStaticSpy.pickRandom
                .withArgs(jasmine.any(Array), number)
                .and.returnValue(cards[0].id);

            const actual = mathService.pickRandomCards(cards, number);

            expect(actual).toEqual(expected);
        });

        it('with number is more than 1 should return correct cards', () => {
            const cards = dataFixture.createCards();
            const number = 2;
            const expected = cards.slice(0, number);
            mathJsStaticSpy.pickRandom
                .withArgs(jasmine.any(Array), number)
                .and.returnValue([cards[0].id, cards[1].id]);

            const actual = mathService.pickRandomCards(cards, number);

            expect(actual).toEqual(expected);
        });

        it('with weights should return correct cards', () => {
            const cards = dataFixture.createCards();
            const number = 1;
            const weights = [1, 3, 2];
            const expected = cards.slice(0, number);
            mathJsStaticSpy.pickRandom
                .withArgs(jasmine.any(Array), number, weights)
                .and.returnValue(cards[0].id);

            const actual = mathService.pickRandomCards(cards, number, weights);

            expect(actual).toEqual(expected);
        });
    });
});
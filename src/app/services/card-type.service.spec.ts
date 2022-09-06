import { TestBed } from '@angular/core/testing';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { DataFixture } from 'src/testing/data-fixture';
import { SpyObj } from 'src/testing/spy-obj';
import { CardType } from '../models/card-type';

import { CardTypeService } from './card-type.service';
import { DataService } from './data.service';

describe('CardTypeService', () => {
    let cardTypeService: CardTypeService;
    let dataServiceSpy: SpyObj<DataService>;
    let dataFixture: DataFixture;
    let cardTypes: CardType[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DataService,
                    useValue: jasmine.createSpyObj<DataService>('DataService', ['fetchCardTypes']),
                },
            ],
        });

        dataFixture = new DataFixture();
        cardTypes = dataFixture.createCardTypes();

        dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    });

    describe('cardTypes$', () => {
        it('with initialization is pending should return from server fetched data after initialization and complete', () => {
            const fetchCardTypes$ = cold('--(a|)', { a: cardTypes });
            const expected$ = cold('      --(a|)', { a: cardTypes });
            dataServiceSpy.fetchCardTypes.and.returnValue(fetchCardTypes$);
            cardTypeService = TestBed.inject(CardTypeService);

            const actual$ = cardTypeService.cardTypes$;

            expect(actual$).toBeObservable(expected$);
        });

        it('with initialization is completed should return cached data immediately and complete', () => {
            const fetchCardTypes$ = cold('--(a|)', { a: cardTypes });
            const expected$ = cold('      (a|)  ', { a: cardTypes });
            dataServiceSpy.fetchCardTypes.and.returnValue(fetchCardTypes$);
            cardTypeService = TestBed.inject(CardTypeService);
            getTestScheduler().flush();
            getTestScheduler().frame = 0;

            const actual$ = cardTypeService.cardTypes$;

            expect(actual$).toBeObservable(expected$);
        });
    });
});

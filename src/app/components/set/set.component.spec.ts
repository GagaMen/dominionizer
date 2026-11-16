import { SetService } from '../../services/set.service';
import { ShuffleService } from '../../services/shuffle.service';
import { AppBarConfiguration } from '../../models/app-bar-configuration';
import { SpyObj } from '../../../testing/spy-obj';
import { AppBarService } from '../../services/app-bar.service';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetComponent } from './set.component';
import { MatMenu } from '@angular/material/menu';
import { DataFixture } from 'src/testing/data-fixture';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { By } from '@angular/platform-browser';
import { CardListStubComponent } from 'src/testing/components/card-list.stub.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAccordionHarness } from '@angular/material/expansion/testing';
import { CardListComponent } from '../card-list/card-list.component';
import { SetOrderingMenuStubComponent } from 'src/testing/components/set-ordering-menu.stub.component';
import { SetOrderingMenuComponent } from '../set-ordering-menu/set-ordering-menu.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SetComponent', () => {
    let component: SetComponent;
    let fixture: ComponentFixture<SetComponent>;
    let harnessLoader: HarnessLoader;
    let shuffleServiceSpy: SpyObj<ShuffleService>;
    let setServiceSpy: SpyObj<SetService>;
    let appBarServiceSpy: SpyObj<AppBarService>;
    let dataFixture: DataFixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SetComponent, NoopAnimationsModule],
            providers: [
                {
                    provide: ShuffleService,
                    useValue: jasmine.createSpyObj<ShuffleService>('ShuffleService', [
                        'shuffleSet',
                    ]),
                },
                {
                    provide: SetService,
                    useValue: {},
                },
                {
                    provide: AppBarService,
                    useValue: jasmine.createSpyObj<AppBarService>('AppBarService', [
                        'updateConfiguration',
                    ]),
                },
            ],
        }).overrideComponent(SetComponent, {
            remove: { imports: [CardListComponent, SetOrderingMenuComponent] },
            add: { imports: [CardListStubComponent, SetOrderingMenuStubComponent] },
        });

        dataFixture = new DataFixture();

        shuffleServiceSpy = TestBed.inject(ShuffleService) as jasmine.SpyObj<ShuffleService>;
        setServiceSpy = TestBed.inject(SetService) as jasmine.SpyObj<SetService>;
        setServiceSpy.set = signal(dataFixture.createSet());
        appBarServiceSpy = TestBed.inject(AppBarService) as jasmine.SpyObj<AppBarService>;

        fixture = TestBed.createComponent(SetComponent);
        harnessLoader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
    });

    describe('setOrderingMenu', () => {
        it('should be resolved before change detection runs', () => {
            expect(component.setOrderingMenu).toBeDefined();
        });
    });

    describe('ngOnInit', () => {
        it('should shuffle', () => {
            const shuffleSpy = spyOn(component, 'shuffle').and.stub();

            fixture.detectChanges();

            expect(shuffleSpy).toHaveBeenCalled();
        });

        it('should update AppBarConfiguration correctly', () => {
            const stubMatMenu: MatMenu = {} as MatMenu;

            component.setOrderingMenu!.matMenu = stubMatMenu;
            const configuration = jasmine.objectContaining<AppBarConfiguration>({
                navigationAction: 'back',
                actions: [
                    {
                        icon: 'sort',
                        matMenu: stubMatMenu,
                    },
                    {
                        icon: 'casino',
                        onClick: jasmine.any(Function),
                    },
                ],
            });
            const shuffleSpy = spyOn(component, 'shuffle').and.stub();

            fixture.detectChanges();
            appBarServiceSpy.updateConfiguration.calls.first().args[0].actions[1].onClick?.();

            expect(appBarServiceSpy.updateConfiguration).toHaveBeenCalledWith(configuration);
            expect(shuffleSpy).toHaveBeenCalled();
        });
    });

    describe('shuffle', () => {
        it('should shuffle set', () => {
            component.shuffle();

            expect(shuffleServiceSpy.shuffleSet).toHaveBeenCalled();
        });
    });

    describe('template', () => {
        it('should render MatAccordion', () => {
            fixture.detectChanges();
            const actual = fixture.debugElement.query(By.directive(MatAccordion));

            expect(actual).not.toBeNull();
        });

        it('should render MatAccordion that allows multiple expanded accordian items simultaneously', async () => {
            fixture.detectChanges();
            const matAccordion = await harnessLoader.getHarness(MatAccordionHarness);
            const actual = await matAccordion.isMulti();

            expect(actual).toBe(true);
        });

        it('should render MatExpansionPanel for kingdom cards inside MatAccordion correctly', async () => {
            fixture.detectChanges();
            const matAccordion = await harnessLoader.getHarness(MatAccordionHarness);
            const actual = (await matAccordion.getExpansionPanels())[0];

            expect(actual).toBeDefined();
            expect(await actual.isExpanded())
                .withContext('expanded')
                .toBe(true);
            expect(await actual.getTitle())
                .withContext('title')
                .toBe('Kingdom Cards');
        });

        it('should render CardList for kingdom cards inside MatExpansionPanel correctly', () => {
            const set = dataFixture.createSet();
            setServiceSpy.set = signal(set);
            const expectedCardList = set.kingdomCards;

            fixture.detectChanges();
            const actual = fixture.debugElement
                .query(By.directive(MatExpansionPanel))
                .query(By.directive(CardListStubComponent))
                .injector.get(CardListStubComponent);

            expect(actual).toBeDefined();
            expect(actual.cardList()).withContext('cardList').toBe(expectedCardList);
        });

        it('should render MatExpansionPanel for special cards inside MatAccordion correctly', async () => {
            fixture.detectChanges();
            const matAccordion = await harnessLoader.getHarness(MatAccordionHarness);
            const actual = (await matAccordion.getExpansionPanels())[1];

            expect(actual).toBeDefined();
            expect(await actual.isExpanded())
                .withContext('expanded')
                .toBe(true);
            expect(await actual.getTitle())
                .withContext('title')
                .toBe('Special Cards');
        });

        it('should render CardList for special cards inside MatExpansionPanel correctly', () => {
            const set = dataFixture.createSet();
            setServiceSpy.set = signal(set);
            const expectedCardList = set.specialCards;

            fixture.detectChanges();
            const actual = fixture.debugElement
                .queryAll(By.directive(MatExpansionPanel))[1]
                .query(By.directive(CardListStubComponent))
                .injector.get(CardListStubComponent);

            expect(actual).toBeDefined();
            expect(actual.cardList()).withContext('cardList').toBe(expectedCardList);
        });

        it('with no special cards should render MatExpansionPanel only for kingdom cards', async () => {
            const set = dataFixture.createSet({ specialCards: [] });
            setServiceSpy.set = signal(set);

            fixture.detectChanges();
            const matAccordion = await harnessLoader.getHarness(MatAccordionHarness);
            const actual = await matAccordion.getExpansionPanels();

            expect(actual.length).toBe(1);
        });
    });
});

import { SetService } from '../../services/set.service';
import { ShuffleService } from '../../services/shuffle.service';
import { AppBarConfiguration } from '../../models/app-bar-configuration';
import { SpyObj } from '../../../testing/spy-obj';
import { AppBarService } from '../../services/app-bar.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetComponent } from './set.component';
import { MatMenu } from '@angular/material/menu';
import { cold } from 'jasmine-marbles';
import { DataFixture } from 'src/testing/data-fixture';
import { MatAccordion, MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CardListStubComponent } from 'src/testing/components/card-list.stub.component';
import { SetPartName, Set } from 'src/app/models/set';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAccordionHarness } from '@angular/material/expansion/testing';
import { detectChangesAndFlush } from 'src/testing/utilities';
import { GroupingAndSortingMenuStubComponent } from 'src/testing/components/grouping-and-sorting-menu.stub.component';

interface SetPartDescription {
    name: SetPartName;
    label: string;
}

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
            imports: [MatExpansionModule, NoopAnimationsModule],
            declarations: [
                SetComponent,
                CardListStubComponent,
                GroupingAndSortingMenuStubComponent,
            ],
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
        });

        dataFixture = new DataFixture();

        shuffleServiceSpy = TestBed.inject(ShuffleService) as jasmine.SpyObj<ShuffleService>;
        setServiceSpy = TestBed.inject(SetService) as jasmine.SpyObj<SetService>;
        setServiceSpy.set$ = cold('--a', { a: dataFixture.createSet() });
        appBarServiceSpy = TestBed.inject(AppBarService) as jasmine.SpyObj<AppBarService>;

        fixture = TestBed.createComponent(SetComponent);
        harnessLoader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
    });

    describe('groupingAndSortingMenu', () => {
        it('should be resolved before change detection runs', () => {
            expect(component.groupingAndSortingMenu).toBeDefined();
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
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            component.groupingAndSortingMenu!.matMenu = stubMatMenu;
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
        it('with SetService never emits set should not render MatAccordion', () => {
            setServiceSpy.set$ = cold('---');

            detectChangesAndFlush(fixture);
            const actual = fixture.debugElement.query(By.directive(MatAccordion));

            expect(actual).toBeNull();
        });

        it('with SetService emits set should render MatAccordion', () => {
            setServiceSpy.set$ = cold('--a', { a: dataFixture.createSet() });

            detectChangesAndFlush(fixture);
            const actual = fixture.debugElement.query(By.directive(MatAccordion));

            expect(actual).not.toBeNull();
        });

        it('should render MatAccordion that allows multiple expanded accordian items simultaneously', async () => {
            detectChangesAndFlush(fixture);
            const matAccordion = await harnessLoader.getHarness(MatAccordionHarness);
            const actual = await matAccordion.isMulti();

            expect(actual).toBeTrue();
        });

        it('should render MatExpansionPanel for kingdom cards inside MatAccordion correctly', async () => {
            detectChangesAndFlush(fixture);
            const matAccordion = await harnessLoader.getHarness(MatAccordionHarness);
            const actual = (await matAccordion.getExpansionPanels())[0];

            expect(actual).toBeDefined();
            expect(await actual.isExpanded())
                .withContext('expanded')
                .toBeTrue();
            expect(await actual.getTitle())
                .withContext('title')
                .toBe('Kingdom Cards');
        });

        it('should render CardList for kingdom cards inside MatExpansionPanel correctly', () => {
            const set = dataFixture.createSet();
            setServiceSpy.set$ = cold('--a', { a: set });
            const expectedCardList = set.kingdomCards;
            const expectedSetPartName: SetPartName = 'kingdomCards';

            detectChangesAndFlush(fixture);
            const actual = fixture.debugElement
                .query(By.directive(MatExpansionPanel))
                .query(By.directive(CardListStubComponent))
                .injector.get(CardListStubComponent);

            expect(actual).toBeDefined();
            expect(actual.cardList).withContext('cardList').toBe(expectedCardList);
            expect(actual.setPartName).withContext('setPartName').toBe(expectedSetPartName);
        });

        it('with no special cards should render MatExpansionPanel only for kingdom cards', async () => {
            const set = dataFixture.createSet({
                events: [],
                landmarks: [],
                projects: [],
                ways: [],
            });
            setServiceSpy.set$ = cold('--a', { a: set });

            detectChangesAndFlush(fixture);
            const matAccordion = await harnessLoader.getHarness(MatAccordionHarness);
            const actual = await matAccordion.getExpansionPanels();

            expect(actual.length).toBe(1);
        });

        const specialSetParts: SetPartDescription[] = [
            { name: 'events', label: 'Events' },
            { name: 'landmarks', label: 'Landmarks' },
            { name: 'projects', label: 'Projects' },
            { name: 'ways', label: 'Ways' },
        ];
        specialSetParts.forEach((specialSetPart: SetPartDescription) => {
            describe(`with set contains ${specialSetPart.name}`, () => {
                let set: Set;

                beforeEach(() => {
                    set = dataFixture.createSet({
                        events: [],
                        landmarks: [],
                        projects: [],
                        ways: [],
                    });
                    set[specialSetPart.name] = dataFixture.createCards();
                    setServiceSpy.set$ = cold('--a', { a: set });
                });

                it(`should render MatExpansionPanel for ${specialSetPart.name} inside MatAccordion correctly`, async () => {
                    detectChangesAndFlush(fixture);
                    const matAccordion = await harnessLoader.getHarness(MatAccordionHarness);
                    const actual = (await matAccordion.getExpansionPanels())[1];

                    expect(actual).toBeDefined();
                    expect(await actual.isExpanded())
                        .withContext('expanded')
                        .toBeTrue();
                    expect(await actual.getTitle())
                        .withContext('title')
                        .toBe(specialSetPart.label);
                });

                it(`should render CardList for ${specialSetPart.name} inside MatExpansionPanel correctly`, () => {
                    const expectedCardList = set[specialSetPart.name];
                    const expectedSetPartName: SetPartName = specialSetPart.name;

                    detectChangesAndFlush(fixture);
                    const actual = fixture.debugElement
                        .queryAll(By.directive(MatExpansionPanel))[1]
                        .query(By.directive(CardListStubComponent))
                        .injector.get(CardListStubComponent);

                    expect(actual).toBeDefined();
                    expect(actual.cardList).withContext('cardList').toBe(expectedCardList);
                    expect(actual.setPartName).withContext('setPartName').toBe(expectedSetPartName);
                });
            });
        });
    });
});

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { GroupingOption, SetService, SortingOption } from 'src/app/services/set.service';
import { SpyObj } from 'src/testing/spy-obj';
import { MatMenuHarness, MatMenuItemHarness } from '@angular/material/menu/testing';
import { MatIconHarness } from '@angular/material/icon/testing';

import { GroupingAndSortingMenuComponent } from './grouping-and-sorting-menu.component';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GroupingAndSortingMenuHostComponent } from 'src/testing/components/grouping-and-sorting-menu.host.component';

describe('GroupingAndSortingMenuComponent', () => {
    let component: GroupingAndSortingMenuComponent;
    let fixture: ComponentFixture<GroupingAndSortingMenuComponent>;
    let setServiceSpy: SpyObj<SetService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDividerModule, MatIconModule, MatMenuModule, NoopAnimationsModule],
            declarations: [GroupingAndSortingMenuComponent, GroupingAndSortingMenuHostComponent],
            providers: [
                {
                    provide: SetService,
                    useValue: jasmine.createSpyObj<SetService>('SetService', [
                        'updateGroupingOption',
                        'updateSortingOption',
                    ]),
                },
            ],
        });

        setServiceSpy = TestBed.inject(SetService) as jasmine.SpyObj<SetService>;

        fixture = TestBed.createComponent(GroupingAndSortingMenuComponent);
        component = fixture.componentInstance;
    });

    describe('matMenu', () => {
        it('should be resolved before change detection runs', () => {
            expect(component.matMenu).toBeDefined();
        });
    });

    describe('onGroup', () => {
        it('should update grouping option with given value', () => {
            const groupingOption: GroupingOption = 'byExpansion';

            component.onGroup(groupingOption);

            expect(setServiceSpy.updateGroupingOption).toHaveBeenCalledWith(groupingOption);
        });
    });

    describe('onSort', () => {
        it('should update sorting option with given value', () => {
            const sortingOption: SortingOption = 'byCost';

            component.onSort(sortingOption);

            expect(setServiceSpy.updateSortingOption).toHaveBeenCalledWith(sortingOption);
        });
    });

    describe('template', () => {
        let matMenu: MatMenuHarness;

        async function initMenu(): Promise<void> {
            const fixture = TestBed.createComponent(GroupingAndSortingMenuHostComponent);
            component = fixture.componentInstance.menu as GroupingAndSortingMenuComponent;
            const harnessLoader = TestbedHarnessEnvironment.loader(fixture);
            matMenu = await harnessLoader.getHarness(MatMenuHarness);
            await matMenu.open();
            getTestScheduler().flush();
        }

        it('should render "Without" menu item', async () => {
            await initMenu();

            const actual = await matMenu.getHarness(MatMenuItemHarness.with({ text: /Without$/ }));

            expect(actual).toBeDefined();
        });

        it('should render "Without" menu item which calls onGroup() correctly on click', async () => {
            await initMenu();
            const onGroupSpy = spyOn(component, 'onGroup');

            const matMenuItem = await matMenu.getHarness(
                MatMenuItemHarness.with({ text: /Without$/ }),
            );
            await matMenuItem.click();

            expect(onGroupSpy).toHaveBeenCalledWith('without');
        });

        it('with grouping option is "without" should render "Without" menu item with "check" icon', async () => {
            setServiceSpy.groupingOption$ = cold('a', { a: 'without' });
            await initMenu();

            const matMenuItem = await matMenu.getHarness(
                MatMenuItemHarness.with({ text: /Without$/ }),
            );
            const actual = await matMenuItem.getHarness(MatIconHarness);

            expect(await actual.getName()).toBe('check');
        });

        it('with grouping option is "byExpansion" should render "Without" menu item with empty icon', async () => {
            setServiceSpy.groupingOption$ = cold('a', { a: 'byExpansion' });
            await initMenu();

            const matMenuItem = await matMenu.getHarness(
                MatMenuItemHarness.with({ text: /Without$/ }),
            );
            const actual = await matMenuItem.getHarness(MatIconHarness);

            expect(await actual.getName()).toBe('');
        });

        it('should render "By Expansion" menu item', async () => {
            await initMenu();

            const actual = await matMenu.getHarness(
                MatMenuItemHarness.with({ text: /By Expansion$/ }),
            );

            expect(actual).toBeDefined();
        });

        it('should render "By Expansion" menu item which calls onGroup() correctly on click', async () => {
            await initMenu();
            const onGroupSpy = spyOn(component, 'onGroup');

            const matMenuItem = await matMenu.getHarness(
                MatMenuItemHarness.with({ text: /By Expansion$/ }),
            );
            await matMenuItem.click();

            expect(onGroupSpy).toHaveBeenCalledWith('byExpansion');
        });

        it('with grouping option is "byExpansion" should render "By Expansion" menu item with "check" icon', async () => {
            setServiceSpy.groupingOption$ = cold('a', { a: 'byExpansion' });
            await initMenu();

            const matMenuItem = await matMenu.getHarness(
                MatMenuItemHarness.with({ text: /By Expansion$/ }),
            );
            const actual = await matMenuItem.getHarness(MatIconHarness);

            expect(await actual.getName()).toBe('check');
        });

        it('with grouping option is "without" should render "By Expansion" menu item with empty icon', async () => {
            setServiceSpy.groupingOption$ = cold('a', { a: 'without' });
            await initMenu();

            const matMenuItem = await matMenu.getHarness(
                MatMenuItemHarness.with({ text: /By Expansion$/ }),
            );
            const actual = await matMenuItem.getHarness(MatIconHarness);

            expect(await actual.getName()).toBe('');
        });

        it('should render "By Name" menu item', async () => {
            await initMenu();

            const actual = await matMenu.getHarness(MatMenuItemHarness.with({ text: /By Name$/ }));

            expect(actual).toBeDefined();
        });

        it('should render "By Name" menu item which calls onSort() correctly on click', async () => {
            await initMenu();
            const onSortSpy = spyOn(component, 'onSort');

            const matMenuItem = await matMenu.getHarness(
                MatMenuItemHarness.with({ text: /By Name$/ }),
            );
            await matMenuItem.click();

            expect(onSortSpy).toHaveBeenCalledWith('byName');
        });

        it('with sorting option is "byName" should render "By Name" menu item with "check" icon', async () => {
            setServiceSpy.sortingOption$ = cold('a', { a: 'byName' });
            await initMenu();

            const matMenuItem = await matMenu.getHarness(
                MatMenuItemHarness.with({ text: /By Name$/ }),
            );
            const actual = await matMenuItem.getHarness(MatIconHarness);

            expect(await actual.getName()).toBe('check');
        });

        it('with sorting option is "byCost" should render "By Name" menu item with empty icon', async () => {
            setServiceSpy.sortingOption$ = cold('a', { a: 'byCost' });
            await initMenu();

            const matMenuItem = await matMenu.getHarness(
                MatMenuItemHarness.with({ text: /By Name$/ }),
            );
            const actual = await matMenuItem.getHarness(MatIconHarness);

            expect(await actual.getName()).toBe('');
        });

        it('should render "By Cost" menu item', async () => {
            await initMenu();

            const actual = await matMenu.getHarness(MatMenuItemHarness.with({ text: /By Cost$/ }));

            expect(actual).toBeDefined();
        });

        it('should render "By Cost" menu item which calls onSort() correctly on click', async () => {
            await initMenu();
            const onSortSpy = spyOn(component, 'onSort');

            const matMenuItem = await matMenu.getHarness(
                MatMenuItemHarness.with({ text: /By Cost$/ }),
            );
            await matMenuItem.click();

            expect(onSortSpy).toHaveBeenCalledWith('byCost');
        });

        it('with sorting option is "byCost" should render "By Cost" menu item with "check" icon', async () => {
            setServiceSpy.sortingOption$ = cold('a', { a: 'byCost' });
            await initMenu();

            const matMenuItem = await matMenu.getHarness(
                MatMenuItemHarness.with({ text: /By Cost$/ }),
            );
            const actual = await matMenuItem.getHarness(MatIconHarness);

            expect(await actual.getName()).toBe('check');
        });

        it('with sorting option is "byName" should render "By Cost" menu item with empty icon', async () => {
            setServiceSpy.sortingOption$ = cold('a', { a: 'byName' });
            await initMenu();

            const matMenuItem = await matMenu.getHarness(
                MatMenuItemHarness.with({ text: /By Cost$/ }),
            );
            const actual = await matMenuItem.getHarness(MatIconHarness);

            expect(await actual.getName()).toBe('');
        });
    });
});

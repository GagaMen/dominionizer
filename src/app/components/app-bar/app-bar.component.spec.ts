import { cold, getTestScheduler } from 'jasmine-marbles';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatButton, MatButtonModule, MatAnchor } from '@angular/material/button';
import { DataFixture } from './../../../testing/data-fixture';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { SpyObj } from './../../../testing/spy-obj';
import { AppBarService } from './../../services/app-bar.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppBarComponent } from './app-bar.component';
import { NEVER } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('AppBarComponent', () => {
    let fixture: ComponentFixture<AppBarComponent>;
    let appBarServiceSpy: SpyObj<AppBarService>;
    let dataFixture: DataFixture;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [MatToolbarModule, MatButtonModule, MatIconModule],
            declarations: [AppBarComponent],
            providers: [
                {
                    provide: AppBarService,
                    useValue: jasmine.createSpyObj<AppBarService>('AppBarService', [
                        'configuration$',
                    ]),
                },
            ],
        });

        dataFixture = new DataFixture();
        appBarServiceSpy = TestBed.inject(AppBarService) as jasmine.SpyObj<AppBarService>;

        fixture = TestBed.createComponent(AppBarComponent);
    }));

    describe('template', () => {
        it('with no configuration should not display MatToolbar', () => {
            appBarServiceSpy.configuration$ = NEVER;
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.directive(MatToolbar));

            expect(actual).toBeNull();
        });

        it('with configuration.navigationAction is "none" should display no MatButton and MatAnchor', () => {
            appBarServiceSpy.configuration$ = cold('-a-', {
                a: dataFixture.createAppBarConfiguration({ navigationAction: 'none' }),
            });
            fixture.detectChanges();
            getTestScheduler().flush();
            fixture.detectChanges();

            const actual = fixture.debugElement.query(
                By.css(
                    '.navigation-action > button[mat-icon-button], .navigation-action > a[mat-icon-button]',
                ),
            );

            expect(actual).toBeNull();
        });

        it('with configuration.navigationAction is "sidenav" should display MatButton with "menu" icon', () => {
            appBarServiceSpy.configuration$ = cold('-a-', {
                a: dataFixture.createAppBarConfiguration({ navigationAction: 'sidenav' }),
            });
            fixture.detectChanges();
            getTestScheduler().flush();
            fixture.detectChanges();

            const actualElement = fixture.debugElement
                .query(By.directive(MatButton))
                .queryAll(By.directive(MatIcon));
            const actualText = actualElement[0].nativeElement.textContent;

            expect(actualElement.length).toBe(1);
            expect(actualText).toBe('menu');
        });

        it('with configuration.navigationAction is "back" should display MatAnchor with "arrow_back" icon', () => {
            appBarServiceSpy.configuration$ = cold('-a-', {
                a: dataFixture.createAppBarConfiguration({ navigationAction: 'back' }),
            });
            fixture.detectChanges();
            getTestScheduler().flush();
            fixture.detectChanges();

            const actualElement = fixture.debugElement
                .query(By.directive(MatAnchor))
                .queryAll(By.directive(MatIcon));
            const actualText = actualElement[0].nativeElement.textContent;

            expect(actualElement.length).toBe(1);
            expect(actualText).toBe('arrow_back');
        });

        it('with configuration.actions is empty should display no action container', () => {
            appBarServiceSpy.configuration$ = cold('-a-', {
                a: dataFixture.createAppBarConfiguration({
                    actions: [],
                }),
            });
            fixture.detectChanges();
            getTestScheduler().flush();
            fixture.detectChanges();

            const actualElement = fixture.debugElement.query(By.css('.actions'));

            expect(actualElement).toBeNull();
        });

        it('with configuration.actions contains actions should display corresponding MatButtons with MatIcon', () => {
            appBarServiceSpy.configuration$ = cold('-a-', {
                a: dataFixture.createAppBarConfiguration({
                    actions: [
                        { icon: 'icon', onClick: () => null },
                        { icon: 'icon2', onClick: () => null },
                    ],
                }),
            });
            fixture.detectChanges();
            getTestScheduler().flush();
            fixture.detectChanges();

            const actualElement = fixture.debugElement.queryAll(
                By.css('.actions > [mat-icon-button] mat-icon'),
            );

            expect(actualElement.length).toBe(2);
        });

        it('with configuration.actions contains actions should register a click event for each MatButton', () => {
            let clickCounter = 0;
            appBarServiceSpy.configuration$ = cold('-a-', {
                a: dataFixture.createAppBarConfiguration({
                    actions: [{ icon: 'icon', onClick: () => clickCounter++ }],
                }),
            });
            fixture.detectChanges();
            getTestScheduler().flush();
            fixture.detectChanges();

            const actualElement = fixture.debugElement.query(
                By.css('.actions > [mat-icon-button]'),
            );

            actualElement.nativeElement.click();

            expect(clickCounter).toBe(1);
        });
    });
});

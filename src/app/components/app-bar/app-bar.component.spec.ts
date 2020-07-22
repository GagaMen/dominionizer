import { cold, getTestScheduler } from 'jasmine-marbles';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { DataFixture } from './../../../testing/data-fixture';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { SpyObj } from './../../../testing/spy-obj';
import { AppBarService } from './../../services/app-bar.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppBarComponent } from './app-bar.component';
import { NEVER } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('AppBarComponent', () => {
    let component: AppBarComponent;
    let fixture: ComponentFixture<AppBarComponent>;
    let appBarServiceSpy: SpyObj<AppBarService>;
    let dataFixture: DataFixture;

    beforeEach(async(() => {
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
        component = fixture.componentInstance;
    }));

    describe('template', () => {
        it('with no configuration should not display MatToolbar', () => {
            appBarServiceSpy.configuration$ = NEVER;
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.directive(MatToolbar));

            expect(actual).toBeNull();
        });

        it('with configuration.navigationAction equals "none" should not display MatIconButton', () => {
            appBarServiceSpy.configuration$ = cold('-a-', {
                a: dataFixture.createAppBarConfiguration({ navigationAction: 'none' }),
            });
            fixture.detectChanges();
            getTestScheduler().flush();
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.directive(MatButton));

            expect(actual).toBeNull();
        });

        it('with configuration.navigationAction equals "sidenav" should display one MatIcon "menu"', () => {
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

        it('with configuration.navigationAction equals "back" should display one MatIcon "arrow_back"', () => {
            appBarServiceSpy.configuration$ = cold('-a-', {
                a: dataFixture.createAppBarConfiguration({ navigationAction: 'back' }),
            });
            fixture.detectChanges();
            getTestScheduler().flush();
            fixture.detectChanges();

            const actualElement = fixture.debugElement
                .query(By.directive(MatButton))
                .queryAll(By.directive(MatIcon));
            const actualText = actualElement[0].nativeElement.textContent;

            expect(actualElement.length).toBe(1);
            expect(actualText).toBe('arrow_back');
        });
    });
});

import { signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconAnchor, MatIconButton } from '@angular/material/button';
import { DataFixture } from './../../../testing/data-fixture';
import { injectSpy, SpyObj } from './../../../testing/spy-obj';
import { AppBarService } from './../../services/app-bar.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppBarComponent } from './app-bar.component';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

describe('AppBarComponent', () => {
    let fixture: ComponentFixture<AppBarComponent>;
    let appBarServiceSpy: SpyObj<AppBarService>;
    let dataFixture: DataFixture;

    beforeEach(() => {
        const spy = {
            updateConfiguration: vi.fn(),
            configuration: signal(AppBarService.defaultConfiguration),
        };

        TestBed.configureTestingModule({
            imports: [AppBarComponent],
            providers: [
                provideRouter([]),
                {
                    provide: AppBarService,
                    useValue: spy,
                },
            ],
        });

        dataFixture = new DataFixture();
        appBarServiceSpy = injectSpy(AppBarService);

        fixture = TestBed.createComponent(AppBarComponent);
    });

    describe('template', () => {
        it('with configuration.navigationAction is "none" should display no action container', () => {
            appBarServiceSpy.configuration.set(
                dataFixture.createAppBarConfiguration({ navigationAction: 'none' }),
            );
            fixture.detectChanges();

            const actualElement = fixture.debugElement.query(By.css('.actions'));

            expect(actualElement).toBeNull();
        });

        it('with configuration.navigationAction is "sidenav" should display MatButton with "menu" icon', () => {
            appBarServiceSpy.configuration.set(
                dataFixture.createAppBarConfiguration({ navigationAction: 'sidenav' }),
            );
            fixture.detectChanges();

            const actualElement = fixture.debugElement
                .query(By.directive(MatIconButton))
                .queryAll(By.directive(MatIcon));
            const actualText = actualElement[0].nativeElement.textContent;

            expect(actualElement.length).toBe(1);
            expect(actualText).toBe('menu');
        });

        it('with configuration.navigationAction is "back" should display MatAnchor with "arrow_back" icon', () => {
            appBarServiceSpy.configuration.set(
                dataFixture.createAppBarConfiguration({ navigationAction: 'back' }),
            );
            fixture.detectChanges();

            const actualElement = fixture.debugElement
                .query(By.directive(MatIconAnchor))
                .queryAll(By.directive(MatIcon));
            const actualText = actualElement[0].nativeElement.textContent;

            expect(actualElement.length).toBe(1);
            expect(actualText).toBe('arrow_back');
        });

        it('with configuration.actions contains actions should display corresponding MatButtons with MatIcon', () => {
            appBarServiceSpy.configuration.set(
                dataFixture.createAppBarConfiguration({
                    actions: [
                        { icon: 'icon', onClick: () => null },
                        { icon: 'icon2', onClick: () => null },
                    ],
                }),
            );
            fixture.detectChanges();

            const actualElement = fixture.debugElement.queryAll(
                By.css('.actions > [mat-icon-button] mat-icon'),
            );

            expect(actualElement.length).toBe(2);
        });

        it('with configuration.actions contains actions should register a click event for each MatButton', () => {
            let clickCounter = 0;
            appBarServiceSpy.configuration.set(
                dataFixture.createAppBarConfiguration({
                    actions: [{ icon: 'icon', onClick: () => clickCounter++ }],
                }),
            );
            fixture.detectChanges();

            const actualElement = fixture.debugElement.query(
                By.css('.actions > [mat-icon-button]'),
            );

            actualElement.nativeElement.click();

            expect(clickCounter).toBe(1);
        });
    });
});

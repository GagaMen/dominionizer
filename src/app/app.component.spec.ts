import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AppBarComponent } from './components/app-bar/app-bar.component';
import { By } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LOCALE_ID } from '@angular/core';
import { injectSpy, SpyObj } from 'src/testing/spy-obj';
import { InstallService } from './services/install.service';
import { EMPTY, Subject } from 'rxjs';
import { RouterOutletStub } from 'src/testing/angular/router-outlet.stub';
import { AppBarStubComponent } from 'src/testing/components/app-bar.stub.component';
import { FooterStubComponent } from 'src/testing/components/footer.stub.component';
import { FooterComponent } from './components/footer/footer.component';

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let installServiceSpy: SpyObj<InstallService>;
    let routerSpy: SpyObj<Router>;
    let routerEvents: Subject<Event>;

    beforeEach(() => {
        routerEvents = new Subject<Event>();

        TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                {
                    provide: LOCALE_ID,
                    useValue: 'de',
                },
                {
                    provide: InstallService,
                    useValue: {
                        activate: vi.fn(),
                    },
                },
                {
                    provide: Router,
                    useValue: { url: '/', events: routerEvents },
                },
            ],
        }).overrideComponent(AppComponent, {
            remove: { imports: [AppBarComponent, FooterComponent, RouterOutlet] },
            add: { imports: [AppBarStubComponent, FooterStubComponent, RouterOutletStub] },
        });

        installServiceSpy = injectSpy(InstallService);
        installServiceSpy.activate.mockReturnValue(EMPTY);

        routerSpy = injectSpy(Router);

        fixture = TestBed.createComponent(AppComponent);
    });

    describe('ngOnInit', () => {
        it('with production environment should set entryPoint correctly', () => {
            environment.production = true;

            fixture.detectChanges();

            expect(environment.entryPoint).toBe('/de');
        });

        it('should activate install service', () => {
            fixture.detectChanges();

            expect(installServiceSpy.activate).toHaveBeenCalled();
        });
    });

    describe('appBar', () => {
        it('with root route should not display AppBar', () => {
            routerSpy.url = '/';
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.directive(AppBarComponent));

            expect(actual).toBeNull();
        });

        it('with non root route should display AppBar', () => {
            routerSpy.url = '/configuration';
            fixture = TestBed.createComponent(AppComponent);
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.css('app-bar'));

            expect(actual).not.toBeNull();
        });

        it('with navigation to non root route should display AppBar', () => {
            fixture.detectChanges();
            routerSpy.url = '/configuration';
            routerEvents.next(new NavigationEnd(1, '/configuration', '/configuration'));
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.css('app-bar'));

            expect(actual).not.toBeNull();
        });

        it('with navigation to root route should not display AppBar', () => {
            routerSpy.url = '/configuration';
            fixture = TestBed.createComponent(AppComponent);
            fixture.detectChanges();
            routerSpy.url = '/';
            routerEvents.next(new NavigationEnd(1, '/', '/'));
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.directive(AppBarComponent));

            expect(actual).toBeNull();
        });
    });
});

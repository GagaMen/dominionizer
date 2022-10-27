import { Router } from '@angular/router';
import { AppBarComponent } from './components/app-bar/app-bar.component';
import { By } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutletStub } from 'src/testing/angular/router-outlet.stub';
import { AppBarStubComponent } from 'src/testing/components/app-bar.stub.component';
import { FooterStubComponent } from 'src/testing/components/footer.stub.component';
import { AppComponent } from './app.component';
import { LOCALE_ID } from '@angular/core';
import { SpyObj } from 'src/testing/spy-obj';
import { InstallService } from './services/install.service';
import { EMPTY } from 'rxjs';

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let installServiceSpy: SpyObj<InstallService>;
    let routerSpy: SpyObj<Router>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                AppBarStubComponent,
                RouterOutletStub,
                FooterStubComponent,
            ],
            providers: [
                {
                    provide: LOCALE_ID,
                    useValue: 'de',
                },
                {
                    provide: InstallService,
                    useValue: jasmine.createSpyObj<InstallService>('InstallService', ['activate']),
                },
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj<Router>('Router', [], ['url']),
                },
            ],
        });

        installServiceSpy = TestBed.inject(InstallService) as jasmine.SpyObj<InstallService>;
        installServiceSpy.activate.and.returnValue(EMPTY);

        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

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
            (Object.getOwnPropertyDescriptor(routerSpy, 'url')?.get as jasmine.Spy).and.returnValue(
                '/',
            );
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.directive(AppBarComponent));

            expect(actual).toBeNull();
        });

        it('with non root route should display AppBar', () => {
            (Object.getOwnPropertyDescriptor(routerSpy, 'url')?.get as jasmine.Spy).and.returnValue(
                '/configuration',
            );
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.css('app-bar'));

            expect(actual).not.toBeNull();
        });
    });
});

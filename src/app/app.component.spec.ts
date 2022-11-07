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
            ],
        });

        installServiceSpy = TestBed.inject(InstallService) as jasmine.SpyObj<InstallService>;
        installServiceSpy.activate.and.returnValue(EMPTY);

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
});

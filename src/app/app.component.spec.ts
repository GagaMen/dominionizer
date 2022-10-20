import { environment } from 'src/environments/environment';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutletStub } from 'src/testing/angular/router-outlet.stub';
import { AppBarStubComponent } from 'src/testing/components/app-bar.stub.component';
import { FooterStubComponent } from 'src/testing/components/footer.stub.component';
import { AppComponent } from './app.component';
import { LOCALE_ID } from '@angular/core';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

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
            ],
        });

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
    });

    it('should be creatable', () => {
        expect(component).toBeInstanceOf(AppComponent);
    });

    it('with production environment should set entryPoint correctly', () => {
        environment.production = true;
        fixture = TestBed.createComponent(AppComponent);

        expect(environment.entryPoint).toBe('/de');
    });
});

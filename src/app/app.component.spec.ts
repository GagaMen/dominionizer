import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutletStub } from 'src/testing/angular/router-outlet.stub';
import { AppBarStubComponent } from 'src/testing/components/app-bar.stub.component';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent, AppBarStubComponent, RouterOutletStub],
        });

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
    });

    it('should be creatable', () => {
        expect(component).toBeInstanceOf(AppComponent);
    });
});

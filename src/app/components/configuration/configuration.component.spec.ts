import { SpyObj } from './../../../testing/spy-obj';
import { AppBarConfiguration } from './../../models/app-bar-configuration';
import { AppBarService } from './../../services/app-bar.service';
import { Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationComponent } from './configuration.component';
import { MatStepperModule } from '@angular/material/stepper';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ExpansionSelectStubComponent } from 'src/testing/components/expansion-select.stub.component';
import { SpecialCardSelectStubComponent } from 'src/testing/components/special-card-select.stub.component';
import { ExpansionService } from 'src/app/services/expansion.service';

describe('ConfigurationComponent', () => {
    let fixture: ComponentFixture<ConfigurationComponent>;
    let appBarServiceSpy: SpyObj<AppBarService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatStepperModule, NoopAnimationsModule],
            declarations: [
                ConfigurationComponent,
                ExpansionSelectStubComponent,
                SpecialCardSelectStubComponent,
            ],
            providers: [
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj<Router>('Router', ['navigate']),
                },
                {
                    provide: AppBarService,
                    useValue: jasmine.createSpyObj<AppBarService>('AppBarService', [
                        'updateConfiguration',
                    ]),
                },
                {
                    provide: ExpansionService,
                    useValue: {},
                },
            ],
        });

        appBarServiceSpy = TestBed.inject(AppBarService) as jasmine.SpyObj<AppBarService>;

        fixture = TestBed.createComponent(ConfigurationComponent);
    });

    describe('ngOnInit', () => {
        it('should update AppBarConfiguration correctly', () => {
            const configuration: AppBarConfiguration = {
                navigationAction: 'none',
                actions: [],
            };

            fixture.detectChanges();

            expect(appBarServiceSpy.updateConfiguration).toHaveBeenCalledWith(configuration);
        });
    });
});

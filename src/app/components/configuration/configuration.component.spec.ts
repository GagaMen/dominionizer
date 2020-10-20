import { NEVER } from 'rxjs';
import { SpyObj } from './../../../testing/spy-obj';
import { AppBarConfiguration } from './../../models/app-bar-configuration';
import { DataFixture } from './../../../testing/data-fixture';
import { AppBarService } from './../../services/app-bar.service';
import { ShuffleService } from './../../services/shuffle.service';
import { Router } from '@angular/router';
import { ConfigurationService } from './../../services/configuration.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationComponent } from './configuration.component';
import { MatStepperModule } from '@angular/material/stepper';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ExpansionSelectStubComponent } from 'src/testing/components/expansion-select.stub.component';
import { SpecialCardSelectStubComponent } from 'src/testing/components/special-card-select.stub.component';

describe('ConfigurationComponent', () => {
    let component: ConfigurationComponent;
    let fixture: ComponentFixture<ConfigurationComponent>;
    let configurationServiceSpy: SpyObj<ConfigurationService>;
    let shuffleServiceSpy: SpyObj<ShuffleService>;
    let appBarServiceSpy: SpyObj<AppBarService>;
    let dataFixture: DataFixture;

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
                    provide: ConfigurationService,
                    useValue: {},
                },
                {
                    provide: ShuffleService,
                    useValue: {},
                },
                {
                    provide: AppBarService,
                    useValue: jasmine.createSpyObj<AppBarService>('AppBarService', [
                        'updateConfiguration',
                    ]),
                },
            ],
        });

        dataFixture = new DataFixture();

        configurationServiceSpy = TestBed.inject(ConfigurationService) as jasmine.SpyObj<
            ConfigurationService
        >;
        configurationServiceSpy.configuration$ = NEVER;
        shuffleServiceSpy = TestBed.inject(ShuffleService) as jasmine.SpyObj<ShuffleService>;
        appBarServiceSpy = TestBed.inject(AppBarService) as jasmine.SpyObj<AppBarService>;

        fixture = TestBed.createComponent(ConfigurationComponent);
        component = fixture.componentInstance;
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

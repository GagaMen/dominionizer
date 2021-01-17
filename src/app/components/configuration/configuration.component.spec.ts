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
import { ConfigurationService } from 'src/app/services/configuration.service';
import { DataFixture } from 'src/testing/data-fixture';
import { CardType } from 'src/app/models/card-type';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ConfigurationComponent', () => {
    let component: ConfigurationComponent;
    let fixture: ComponentFixture<ConfigurationComponent>;
    let appBarServiceSpy: SpyObj<AppBarService>;
    let expansionServiceSpy: SpyObj<ExpansionService>;
    let configurationServiceSpy: SpyObj<ConfigurationService>;
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
                    provide: AppBarService,
                    useValue: jasmine.createSpyObj<AppBarService>('AppBarService', [
                        'updateConfiguration',
                    ]),
                },
                {
                    provide: ExpansionService,
                    useValue: {},
                },
                {
                    provide: ConfigurationService,
                    useValue: jasmine.createSpyObj<ConfigurationService>('ConfigurationService', [
                        'isCardTypeAvailable',
                        'updateExpansions',
                        'updateSpecialCardsCount',
                    ]),
                },
            ],
        });

        dataFixture = new DataFixture();

        appBarServiceSpy = TestBed.inject(AppBarService) as jasmine.SpyObj<AppBarService>;

        expansionServiceSpy = TestBed.inject(ExpansionService) as jasmine.SpyObj<ExpansionService>;
        expansionServiceSpy.expansions$ = of(dataFixture.createExpansions());

        configurationServiceSpy = TestBed.inject(ConfigurationService) as jasmine.SpyObj<
            ConfigurationService
        >;
        configurationServiceSpy.configuration$ = of(dataFixture.createConfiguration());
        configurationServiceSpy.isCardTypeAvailable.and.returnValue(of(false));

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

        it('should set specialCardsAvailability$ correctly', () => {
            const availability = dataFixture.createSpecialCardsAvailability();
            const areEventsAvailable$ = cold('   --a', { a: availability.events });
            const areLandmarksAvailable$ = cold('--b', { b: availability.landmarks });
            const areProjectsAvailable$ = cold(' --c', { c: availability.projects });
            const areWaysAvailable$ = cold('     --d', { d: availability.ways });
            const expected$ = cold('             --e', { e: availability });
            configurationServiceSpy.isCardTypeAvailable
                .withArgs(CardType.Event)
                .and.returnValue(areEventsAvailable$);
            configurationServiceSpy.isCardTypeAvailable
                .withArgs(CardType.Landmark)
                .and.returnValue(areLandmarksAvailable$);
            configurationServiceSpy.isCardTypeAvailable
                .withArgs(CardType.Project)
                .and.returnValue(areProjectsAvailable$);
            configurationServiceSpy.isCardTypeAvailable
                .withArgs(CardType.Way)
                .and.returnValue(areWaysAvailable$);

            fixture.detectChanges();
            const actual$ = component.specialCardsAvailability$;

            expect(actual$).toBeObservable(expected$);
        });
    });

    describe('template', () => {
        it('should bind change event of ExpansionSelectComponent correctly', () => {
            fixture.detectChanges();
            const expansions = dataFixture.createExpansions();

            const expansionSelectComponent = fixture.debugElement
                .query(By.directive(ExpansionSelectStubComponent))
                .injector.get(ExpansionSelectStubComponent);
            expansionSelectComponent.change.emit(expansions);

            expect(configurationServiceSpy.updateExpansions).toHaveBeenCalledWith(expansions);
        });

        it('should bind change event of SpecialCardSelectComponent correctly', () => {
            fixture.detectChanges();
            const count = dataFixture.createSpecialCardsCount();

            const specialCardSelectComponent = fixture.debugElement
                .query(By.directive(SpecialCardSelectStubComponent))
                .injector.get(SpecialCardSelectStubComponent);
            specialCardSelectComponent.change.emit(count);

            expect(configurationServiceSpy.updateSpecialCardsCount).toHaveBeenCalledWith(count);
        });
    });
});

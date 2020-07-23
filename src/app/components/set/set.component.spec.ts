import { NEVER } from 'rxjs';
import { SetService } from '../../services/set.service';
import { ShuffleService } from '../../services/shuffle.service';
import { FormBuilder } from '@angular/forms';
import { DataFixture } from 'src/testing/data-fixture';
import { AppBarConfiguration } from '../../models/app-bar-configuration';
import { SpyObj } from '../../../testing/spy-obj';
import { AppBarService } from '../../services/app-bar.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetComponent } from './set.component';

describe('SetComponent', () => {
    let component: SetComponent;
    let fixture: ComponentFixture<SetComponent>;
    let shuffleServiceSpy: SpyObj<ShuffleService>;
    let setServiceSpy: SpyObj<SetService>;
    let appBarServiceSpy: SpyObj<AppBarService>;
    let dataFixture: DataFixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SetComponent],
            providers: [
                {
                    provide: ShuffleService,
                    useValue: jasmine.createSpyObj<ShuffleService>('ShuffleService', [
                        'shuffleCards',
                    ]),
                },
                {
                    provide: SetService,
                    useValue: {},
                },
                FormBuilder,
                {
                    provide: AppBarService,
                    useValue: jasmine.createSpyObj<AppBarService>('AppBarService', [
                        'updateConfiguration',
                    ]),
                },
            ],
        });

        dataFixture = new DataFixture();

        shuffleServiceSpy = TestBed.inject(ShuffleService) as jasmine.SpyObj<ShuffleService>;
        setServiceSpy = TestBed.inject(SetService) as jasmine.SpyObj<SetService>;
        setServiceSpy.set$ = NEVER;
        appBarServiceSpy = TestBed.inject(AppBarService) as jasmine.SpyObj<AppBarService>;

        fixture = TestBed.createComponent(SetComponent);
        component = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
        it('should update AppBarConfiguration correctly', () => {
            const configuration: AppBarConfiguration = {
                navigationAction: 'back',
                actions: [],
            };

            fixture.detectChanges();

            expect(appBarServiceSpy.updateConfiguration).toHaveBeenCalledWith(configuration);
        });
    });
});

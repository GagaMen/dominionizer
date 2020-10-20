import { NEVER } from 'rxjs';
import { SetService } from '../../services/set.service';
import { ShuffleService } from '../../services/shuffle.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AppBarConfiguration } from '../../models/app-bar-configuration';
import { SpyObj } from '../../../testing/spy-obj';
import { AppBarService } from '../../services/app-bar.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetComponent } from './set.component';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

describe('SetComponent', () => {
    let component: SetComponent;
    let fixture: ComponentFixture<SetComponent>;
    let setServiceSpy: SpyObj<SetService>;
    let appBarServiceSpy: SpyObj<AppBarService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatCardModule, MatCheckboxModule, MatRadioModule, ReactiveFormsModule],
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

        setServiceSpy = TestBed.inject(SetService) as jasmine.SpyObj<SetService>;
        setServiceSpy.set$ = NEVER;
        appBarServiceSpy = TestBed.inject(AppBarService) as jasmine.SpyObj<AppBarService>;

        fixture = TestBed.createComponent(SetComponent);
        component = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
        it('should update AppBarConfiguration correctly', () => {
            const configuration = jasmine.objectContaining<AppBarConfiguration>({
                navigationAction: 'back',
                actions: [
                    {
                        icon: 'cached',
                        onClick: jasmine.any(Function),
                    },
                ],
            });
            const shuffleSpy = spyOn(component, 'shuffle').and.stub();

            fixture.detectChanges();
            appBarServiceSpy.updateConfiguration.calls.first().args[0].actions[0].onClick();

            expect(appBarServiceSpy.updateConfiguration).toHaveBeenCalledWith(configuration);
            expect(shuffleSpy).toHaveBeenCalled();
        });
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialCardSelectComponent } from './special-card-select.component';

xdescribe('SpecialCardSelectComponent', () => {
    let component: SpecialCardSelectComponent;
    let fixture: ComponentFixture<SpecialCardSelectComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SpecialCardSelectComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SpecialCardSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

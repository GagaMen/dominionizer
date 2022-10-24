import { MatButtonModule } from '@angular/material/button';
import { LanguageMenuStubComponent } from './../../../testing/components/language-menu.stub.component';
import { FooterComponent } from './footer.component';
import { waitForAsync, TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { getTestScheduler } from 'jasmine-marbles';
import { LanguageMenuComponent } from '../language-menu/language-menu.component';

describe('FooterComponent', () => {
    let fixture: ComponentFixture<FooterComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [MatButtonModule],
            declarations: [FooterComponent, LanguageMenuStubComponent],
        });

        fixture = TestBed.createComponent(FooterComponent);
    }));

    describe('languageMenu', () => {
        it('should be resolved before change detection runs', () => {
            fixture.detectChanges();
            getTestScheduler().flush();
            fixture.detectChanges();

            const actual = fixture.debugElement.query(By.directive(LanguageMenuComponent));

            expect(actual).not.toBeNull();
        });
    });
});

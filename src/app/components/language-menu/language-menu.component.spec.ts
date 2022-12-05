import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { Language } from './../../models/language';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageMenuComponent } from './language-menu.component';
import {
    MatLegacyMenuHarness as MatMenuHarness,
    MatLegacyMenuItemHarness as MatMenuItemHarness,
} from '@angular/material/legacy-menu/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { getTestScheduler } from 'jasmine-marbles';
import { LanguageMenuHostComponent } from 'src/testing/components/language-menu.host.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LanguageMenuComponent', () => {
    let component: LanguageMenuComponent;
    let fixture: ComponentFixture<LanguageMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatMenuModule, MatButtonModule, MatIconModule, NoopAnimationsModule],
            declarations: [LanguageMenuComponent, LanguageMenuHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LanguageMenuComponent);
        component = fixture.componentInstance;
    });

    describe('matMenu', () => {
        it('should be resolved before change detection runs', () => {
            expect(component.matMenu).toBeDefined();
        });
    });

    describe('template', () => {
        let matMenu: MatMenuHarness;

        async function initMenu(): Promise<void> {
            const fixture = TestBed.createComponent(LanguageMenuHostComponent);
            component = fixture.componentInstance.menu as LanguageMenuComponent;
            const harnessLoader = TestbedHarnessEnvironment.loader(fixture);
            matMenu = await harnessLoader.getHarness(MatMenuHarness);
            await matMenu.open();
            getTestScheduler().flush();
        }

        for (const [languageName, redirectionTarget] of Object.entries(Language)) {
            it(`with language "${languageName}" should render "${languageName}" menu item with href to "${redirectionTarget}"`, async () => {
                await initMenu();

                const actual = await matMenu.getHarness(
                    MatMenuItemHarness.with({ text: new RegExp(`${languageName}$`) }),
                );
                const host = await actual.host();
                const href = await host.getAttribute('href');

                expect(actual).not.toBeNull();
                expect(href).toBe(`/${redirectionTarget}/`);
            });
        }
    });
});

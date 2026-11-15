import { LanguageMenuComponent } from './../../app/components/language-menu/language-menu.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatMenu } from '@angular/material/menu';

@Component({
    selector: 'app-language-menu',
    standalone: true,
    providers: [
        {
            provide: LanguageMenuComponent,
            useClass: LanguageMenuStubComponent,
        },
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: '',
})
export class LanguageMenuStubComponent {
    matMenu?: MatMenu;
}

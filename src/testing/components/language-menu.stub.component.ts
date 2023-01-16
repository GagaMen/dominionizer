import { LanguageMenuComponent } from './../../app/components/language-menu/language-menu.component';
import { Component } from '@angular/core';
import { MatLegacyMenu as MatMenu } from '@angular/material/legacy-menu';

@Component({
    selector: 'app-language-menu',
    template: '',
    providers: [
        {
            provide: LanguageMenuComponent,
            useClass: LanguageMenuStubComponent,
        },
    ],
})
export class LanguageMenuStubComponent {
    matMenu?: MatMenu;
}

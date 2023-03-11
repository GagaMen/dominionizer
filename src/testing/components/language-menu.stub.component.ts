import { LanguageMenuComponent } from './../../app/components/language-menu/language-menu.component';
import { Component } from '@angular/core';
import { MatMenu } from '@angular/material/menu';

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

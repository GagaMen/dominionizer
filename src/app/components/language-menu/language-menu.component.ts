import { Language } from './../../models/language';
import { Component, ViewChild } from '@angular/core';
import { MatLegacyMenu as MatMenu } from '@angular/material/legacy-menu';

@Component({
    selector: 'app-language-menu',
    templateUrl: './language-menu.component.html',
    styleUrls: ['./language-menu.component.scss'],
})
export class LanguageMenuComponent {
    @ViewChild(MatMenu, { static: true }) matMenu?: MatMenu;
    public languages: [string, string][] = Object.entries(Language);
}

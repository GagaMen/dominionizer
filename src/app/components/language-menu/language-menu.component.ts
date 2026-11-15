import { Language } from './../../models/language';
import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatMenu, MatMenuTrigger, MatMenuItem } from '@angular/material/menu';

import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-language-menu',
    imports: [MatMenu, MatMenuItem, MatMenuTrigger, MatIcon],
    templateUrl: './language-menu.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./language-menu.component.scss'],
})
export class LanguageMenuComponent {
    @ViewChild(MatMenu, { static: true }) matMenu?: MatMenu;
    public languages: [string, string][] = Object.entries(Language);
}

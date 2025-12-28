import { Language } from './../../models/language';
import { Component, ViewChild } from '@angular/core';
import { MatMenu, MatMenuTrigger, MatMenuItem } from '@angular/material/menu';
import { NgFor } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-language-menu',
    imports: [MatMenu, MatMenuItem, MatMenuTrigger, MatIcon, NgFor],
    templateUrl: './language-menu.component.html',
    styleUrls: ['./language-menu.component.scss'],
})
export class LanguageMenuComponent {
    @ViewChild(MatMenu, { static: true }) matMenu?: MatMenu;
    public languages: [string, string][] = Object.entries(Language);
}

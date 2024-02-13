import { Component } from '@angular/core';
import { LanguageMenuComponent } from '../language-menu/language-menu.component';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [LanguageMenuComponent],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
    currentYear = new Date().getFullYear();
}

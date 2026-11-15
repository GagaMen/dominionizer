import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LanguageMenuComponent } from '../language-menu/language-menu.component';

@Component({
    selector: 'app-footer',
    imports: [LanguageMenuComponent],
    templateUrl: './footer.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
    currentYear = new Date().getFullYear();
}

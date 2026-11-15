import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { SetOrderingMenuComponent } from 'src/app/components/set-ordering-menu/set-ordering-menu.component';

@Component({
    selector: 'app-set-ordering-menu',
    standalone: true,
    providers: [
        {
            provide: SetOrderingMenuComponent,
            useClass: SetOrderingMenuStubComponent,
        },
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: '',
})
export class SetOrderingMenuStubComponent {
    matMenu?: MatMenu;
}

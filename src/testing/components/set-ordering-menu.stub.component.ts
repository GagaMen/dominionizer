import { Component } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { SetOrderingMenuComponent } from 'src/app/components/set-ordering-menu/set-ordering-menu.component';

@Component({
    selector: 'app-set-ordering-menu',
    template: '',
    providers: [
        {
            provide: SetOrderingMenuComponent,
            useClass: SetOrderingMenuStubComponent,
        },
    ],
})
export class SetOrderingMenuStubComponent {
    matMenu?: MatMenu;
}

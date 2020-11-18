import { Component } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { GroupingAndSortingMenuComponent } from 'src/app/components/grouping-and-sorting-menu/grouping-and-sorting-menu.component';

@Component({
    selector: 'app-grouping-and-sorting-menu',
    template: '',
    providers: [
        {
            provide: GroupingAndSortingMenuComponent,
            useClass: GroupingAndSortingMenuStubComponent,
        },
    ],
})
export class GroupingAndSortingMenuStubComponent {
    matMenu?: MatMenu;
}

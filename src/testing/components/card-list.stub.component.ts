import { Component, Input } from '@angular/core';
import { Card } from 'src/app/models/card';
import { SetPartName } from 'src/app/models/set';

@Component({
    selector: 'app-card-list',
    template: '',
})
export class CardListStubComponent {
    @Input() setPartName: SetPartName = 'cards';
    @Input() cardList: Card[] = [];
}

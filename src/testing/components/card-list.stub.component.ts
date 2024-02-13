import { Component, Input } from '@angular/core';
import { Card } from 'src/app/models/card';

@Component({
    selector: 'app-card-list',
    standalone: true,
    template: '',
})
export class CardListStubComponent {
    @Input() cardList: Card[] = [];
}

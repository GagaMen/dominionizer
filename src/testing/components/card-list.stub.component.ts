import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Card } from 'src/app/models/card';

@Component({
    selector: 'app-card-list',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    template: '',
})
export class CardListStubComponent {
    @Input() cardList: Card[] = [];
}

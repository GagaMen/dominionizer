import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card, NullCard } from 'src/app/models/card';

@Component({
    selector: 'app-card',
    template: '',
})
export class CardStubComponent {
    @Input() card: Card = NullCard;
    @Output() reshuffle: EventEmitter<undefined> = new EventEmitter<undefined>();
}

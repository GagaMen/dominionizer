import { Component, input, output } from '@angular/core';
import { Card, NullCard } from 'src/app/models/card';

@Component({
    selector: 'app-card',
    standalone: true,
    template: '',
})
export class CardStubComponent {
    readonly card = input<Card>(NullCard);
    readonly reshuffle = output<void>();
}

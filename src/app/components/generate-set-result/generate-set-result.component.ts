import { Component } from '@angular/core';
import { ShuffleService } from '../../services/shuffle.service';
import { SetService } from 'src/app/services/set.service';

@Component({
    selector: 'app-generate-set-result',
    templateUrl: './generate-set-result.component.html',
    styleUrls: ['./generate-set-result.component.scss'],
})
export class GenerateSetResultComponent {
    constructor(private shuffleService: ShuffleService, public setService: SetService) {
        this.shuffle();
    }

    shuffle(): void {
        this.shuffleService.shuffleCards();
    }
}

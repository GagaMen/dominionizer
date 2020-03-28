import { Component } from '@angular/core';
import { Observable, Subject, forkJoin, BehaviorSubject } from 'rxjs';
import { ShuffleService } from '../../services/shuffle.service';
import { Set } from '../../models/set';
import { exhaustMap } from 'rxjs/operators';

@Component({
    selector: 'app-generate-set-result',
    templateUrl: './generate-set-result.component.html',
    styleUrls: ['./generate-set-result.component.scss'],
})
export class GenerateSetResultComponent {
    private shuffleSubject: Subject<unknown> = new BehaviorSubject<unknown>({});
    set$: Observable<Set>;

    constructor(private shuffleService: ShuffleService) {
        const singleSet$ = forkJoin({
            cards: this.shuffleService.shuffleCards(),
            events: this.shuffleService.shuffleEvents(),
            landmarks: this.shuffleService.shuffleLandmarks(),
            boons: this.shuffleService.shuffleBoons(),
            hexes: this.shuffleService.shuffleHexes(),
            states: this.shuffleService.shuffleStates(),
        });

        this.set$ = this.shuffleSubject.pipe(exhaustMap(() => singleSet$));
    }

    shuffle(): void {
        this.shuffleSubject.next();
    }
}

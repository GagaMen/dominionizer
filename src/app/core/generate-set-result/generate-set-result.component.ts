import { Component } from '@angular/core';
import { Observable, Subject, forkJoin, BehaviorSubject } from 'rxjs';
import { ShuffleService } from '../services/shuffle.service';
import { SetResult } from '../models/set-result';
import { exhaustMap } from 'rxjs/operators';

@Component({
  selector: 'app-generate-set-result',
  templateUrl: './generate-set-result.component.html',
  styleUrls: ['./generate-set-result.component.scss']
})
export class GenerateSetResultComponent {
  private shuffleSubject: Subject<any> = new BehaviorSubject({});
  setResult$: Observable<SetResult>;

  constructor(private shuffleService: ShuffleService) {
    const singleSetResult$ = forkJoin({
      cards: this.shuffleService.shuffleCards(),
      events: this.shuffleService.shuffleEvents(),
      landmarks: this.shuffleService.shuffleLandmarks(),
      boons: this.shuffleService.shuffleBoons(),
      hexes: this.shuffleService.shuffleHexes(),
      states: this.shuffleService.shuffleStates(),
    });

    this.setResult$ = this.shuffleSubject.pipe(
      exhaustMap(() => singleSetResult$)
    );
  }

  shuffle(): void {
  this.shuffleSubject.next();
  }
}

import { Component } from '@angular/core';
import { Configuration } from '../models/configuration';
import { Observable, Subject, forkJoin, iif, of, BehaviorSubject } from 'rxjs';
import { ShuffleService } from '../services/shuffle.service';
import { SetResult } from '../models/set-result';
import { exhaustMap } from 'rxjs/operators';

@Component({
  selector: 'app-generate-set-result',
  templateUrl: './generate-set-result.component.html',
  styleUrls: ['./generate-set-result.component.scss']
})
export class GenerateSetResultComponent {
  private configuration: Configuration = history.state;
  private shuffleSubject: Subject<any> = new BehaviorSubject({});
  setResult$: Observable<SetResult>;

  constructor(private shuffleService: ShuffleService) {
    const singleSetResult$ = forkJoin({
      cards: this.shuffleService.shuffleCards(this.configuration),
      events: iif(
        () => this.configuration.options.events,
        this.shuffleService.shuffelEvents(this.configuration),
        of(null)
      ),
    });

    this.setResult$ = this.shuffleSubject.pipe(
      exhaustMap(() => singleSetResult$)
    );
  }

  shuffle(): void {
  this.shuffleSubject.next();
  }
}

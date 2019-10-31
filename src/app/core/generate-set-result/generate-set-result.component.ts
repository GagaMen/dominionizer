import { Component, OnInit } from '@angular/core';
import { Configuration } from '../models/configuration';
import { Observable } from 'rxjs';
import { Card } from '../models/card';
import { ShuffleService } from '../services/shuffle.service';

@Component({
  selector: 'app-generate-set-result',
  templateUrl: './generate-set-result.component.html',
  styleUrls: ['./generate-set-result.component.scss']
})
export class GenerateSetResultComponent {
  private configuration: Configuration = history.state;
  cards$: Observable<Card[]>;
  events$: Observable<Card[]>;

  constructor(private shuffleService: ShuffleService) {
    this.shuffle();
   }

   shuffle(): void {
    this.cards$ = this.shuffleService.shuffleCards(this.configuration);

    if (this.configuration.options.events) {
      this.events$ = this.shuffleService.shuffelEvents(this.configuration);
    }
   }
}

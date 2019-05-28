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
export class GenerateSetResultComponent implements OnInit {
  cards: Observable<Card[]>;

  constructor(private shuffleService: ShuffleService) {
    const configuration: Configuration = history.state;
    this.cards = this.shuffleService.shuffle(configuration);
   }

  ngOnInit() {
  }

}

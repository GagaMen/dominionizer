import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Configuration } from '../models/configuration';

@Component({
  selector: 'app-generate-set-result',
  templateUrl: './generate-set-result.component.html',
  styleUrls: ['./generate-set-result.component.scss']
})
export class GenerateSetResultComponent implements OnInit {
  configuration: Configuration;

  constructor() {
    this.configuration = history.state;
   }

  ngOnInit() {
  }

}

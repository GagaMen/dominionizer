import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.scss']
})
export class AppBarComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter();
  title = 'Dominionizer';

  constructor() { }

  ngOnInit() {
  }
}

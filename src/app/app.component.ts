import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(MatSidenav, {static: false}) private sidenav: MatSidenav;

  title = 'dominionizer';

  onSidenavToggle(): void {
    this.sidenav.toggle();
  }
}

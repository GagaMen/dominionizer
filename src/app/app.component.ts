import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(MatSidenav) private sidenav: MatSidenav;

  title = 'dominionizer';

  onSidenavToggle(): void {
    this.sidenav.toggle();
  }
}

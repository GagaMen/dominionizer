import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title = 'Dominionizer';

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'menu',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_menu_48px.svg')
    );

    iconRegistry.addSvgIcon(
      'home',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_home_48px.svg')
    );

    iconRegistry.addSvgIcon(
      'game',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_games_48px.svg')
    );

    iconRegistry.addSvgIcon(
      'info',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_info_outline_48px.svg')
    );
  }

  ngOnInit() {
  }

}

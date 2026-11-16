import { AppBarService } from './../../services/app-bar.service';
import { Component, inject } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatIconAnchor } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
    selector: 'app-bar',
    imports: [MatToolbar, MatIconButton, MatIcon, MatIconAnchor, MatMenuTrigger, RouterLink],
    templateUrl: './app-bar.component.html',
    styleUrls: ['./app-bar.component.scss'],
})
export class AppBarComponent {
    appBarService = inject(AppBarService);
}

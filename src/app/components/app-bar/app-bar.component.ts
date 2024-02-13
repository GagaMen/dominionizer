import { AppBarService } from './../../services/app-bar.service';
import { Component } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatIconAnchor } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-bar',
    standalone: true,
    imports: [
        MatToolbar,
        MatIconButton,
        MatIcon,
        MatIconAnchor,
        MatMenuTrigger,
        NgIf,
        NgFor,
        AsyncPipe,
        RouterLink,
    ],
    templateUrl: './app-bar.component.html',
    styleUrls: ['./app-bar.component.scss'],
})
export class AppBarComponent {
    constructor(public appBarService: AppBarService) {}
}

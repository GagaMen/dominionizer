import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { MatAnchor } from '@angular/material/button';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [MatAnchor, MatDivider, RouterLink],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { MatAnchor } from '@angular/material/button';

@Component({
    selector: 'app-home',
    imports: [MatAnchor, MatDivider, RouterLink],
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
